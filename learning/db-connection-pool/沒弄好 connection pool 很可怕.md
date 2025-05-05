# **沒弄好 connection pool 很可怕**

我在調整 LangChain 跟向量資料庫的互動時，注意到一個被我忽略的效能問題。起因是我在實作 createPGVectorStore 的過程中，發現同樣一段程式碼，在某些情況下只需要 0.132 ms 就能完成，但在另一個版本中卻要超過 1267.61 ms。這中間的差異不是偶發性的，而是平均下來超過一萬倍的效能落差。

因為這個過程，我重新梳理了 PostgreSQL Connection Pool 的生命週期，以及在幾種實作選擇下，效能可能會受到什麼影響。

## **PostgreSQL Connection Pool 是什麼？**

建立一個資料庫連線的成本其實不低。以 PostgreSQL 為例，從應用程式發出請求開始，資料庫連線的建立通常會經歷下列步驟：

- DNS 解析：如果本地 DNS 快取 missed，就需要向上層 DNS 伺服器 query；查詢來回至少要 1～2 次 RTT

- TCP 連線建立：

   1. Client → Server：SYN

   2. Server → Client：SYN+ACK

   3. Client → Server：ACK

   - 如果網路品質差、封包掉包也會需要 retry

- TLS handshake（如果有開啟加密）

   - 這個我不熟，以後再回來細看

- 建立資料庫 session 狀態（如 transaction isolation level）

   - 這個我也還不熟，可以之後來延伸學習一下

這些操作加總起來的開銷還蠻可觀的，特別是在位於遠端資料中心時，Connection Pool（連線池）就是為了解決這個問題而存在的。它的作法是：

- 提前建立多個資料庫連線

- 在應用程式需要連線時，從 Pool 中撈取現成的可用連線

- 用完之後把連線歸還，而不是關閉

這樣一來，我們可以將建立連線的成本攤平，避免每次資料庫操作都重新初始化

## **為什麼這會影響 PGVectorStore 的初始化效能？**

如果每次在 LangChain 都重新建立一個新的 Pool，就等於每次都重走一輪 TCP + TLS + Auth，這會讓效能表現明顯下滑

## **實驗設計：兩組 Pool 使用方式的對照測試**

這次的實驗主要對比兩種實作方式在 createPGVectorStore() 上的表現

我將程式碼放在文末，有興趣的話去看一下～

### **A 組：每次呼叫都新建 Connection Pool**

```
export async function createPGVectorStore(
  tableName: string,
  embeddingModel: EmbeddingsInterface
): Promise<PGVectorStore> {
  return await PGVectorStore.initialize(embeddingModel, {
    pool: reusablePool,
    tableName,
    columns: {
      idColumnName: "id",
      vectorColumnName: "vector",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
  });
} 

```

這樣的做法，會在每次建立 Vector Store 的時候，都重新建立一個連線池，等同於每個請求都從 TCP 開始接上資料庫。

### **B 組：重用一個初始化後的 Pool 實例**

```
export async function createPGVectorStore(
  tableName: string,
  embeddingModel: EmbeddingsInterface
): Promise<PGVectorStore> {
  if (!initializedConfig) {
    console.log("🚀 B組: 首次初始化 PGVectorStore");

    // 只在第一次呼叫時 init config
    initializedConfig = {
      pool: reusablePool,
      tableName: "vector_store",
      collectionTableName: "vector_store_collection",
      collectionName: tableName,
      columns: {
        idColumnName: "id",
        vectorColumnName: "vector",
        contentColumnName: "content",
        metadataColumnName: "metadata",
      },
    };

    // 第一次呼叫時需要 init
    return await PGVectorStore.initialize(embeddingModel, initializedConfig);
  }

  // 後續呼叫直接使用 new 建立 instance，不再 init connection pool
  console.log("🔄 B組: 重用已初始化的 PGVectorStore 配置");
  return new PGVectorStore(embeddingModel, initializedConfig);
} 

```

Pool 的建立發生在模組初始化階段，後續每次建立 store 時只會用相同的連線資源，不重新初始化。

## **實驗結果**

本次測試皆在本機資料庫環境進行，操作重複十次。各組統計如下：

| **項目** | **A 組（每次建立 Pool）** | **B 組（重用 Pool）** | **倍數差異** | 
|---|---|---|---|
| 平均耗時 | 11\.09 ms | 0\.051 ms | 216\.58x | 
| 中位數耗時 | 10\.30 ms | 0\.025 ms | 416\.16x | 
| 最小耗時 | 8\.04 ms | 0\.016 ms | 510\.49x | 
| 最大耗時 | 21\.59 ms | 0\.178 ms | 121\.06x | 
| P95 | 21\.59 ms | 0\.178 ms | 121\.06x | 

可以看到，即使在本地環境，兩者之間的差異依然明顯。如果將資料庫部署於不同區域的雲端平台（例如 RDS in Singapore、應用程式部署在台灣），實際的差距可能會是上百倍以上。

## 反思

這類效能問題通常不會在 unit test 被發現，因為初始化時間常常被包在整體操作內部而被忽略。如果應用程式頻繁地初始化 vector store、或是在 request handler 中重新建立連線池，會讓 latency 成本逐漸堆疊。

以下是幾點建議：

- 避免每次呼叫都初始化 Pool。應該將 Pool 的建立移到應用啟動階段，讓整個程式共用單一實例。

- 初始化 PGVectorStore 的 config 時要注意初始化成本是否重複出現。

- 用 client 時，先釐清哪些操作是「stateful initialization」，哪些可以安全重用。

Database Connection Pool 是一個用對了沒感覺，用錯了很致命的東西。這次的實驗雖然只針對 LangChain 的 PGVectorStore 做測試，但實際上同樣的陷阱，有可能存在於其他資料庫互動的工具。

希望這篇文章能幫你在寫下一個 createXxxStore() 的時候，多想一下這些初始化動作背後的實際成本！

我是後端工程師布蘭登，我們下次見！

## **補充：為什麼之前我看到的是一萬倍差異？**

這次的測試是在本機環境進行的，連線不需要經過 DNS lookup、TLS handshake 等遠端網路開銷。

但在我第一次觀察到 latency 超過 1000ms 的時候，應用部署在台灣，而資料庫則在其他國家。這種跨區延遲，加上 TLS 和 remote server 的驗證時間，才造成了最初將近 1267ms 的 latency。

Refer link:

- langchain pgvector: <https://js.langchain.com/docs/integrations/vectorstores/pgvector/#advanced-reusing-connections>

- 我的實驗腳本: <https://github.com/Lanznx/backend-b-blog/tree/main/learning/db-connection-pool/pgvector-benchmark>