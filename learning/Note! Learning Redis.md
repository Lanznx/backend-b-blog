# Note: Learning Redis

有點凌亂的角落，如果希望看我做好的圖卡整理可以到

1. [Redis as a Cache：由淺入沒很深的問題](https://www.instagram.com/p/Cvug8YiyXVW/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==)

2. [你知道 Redis 可以當持久化資料庫？！](https://www.instagram.com/p/CwALKjISYme/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==)

3. [Redis 高可用介紹](https://www.instagram.com/p/CwNUzzHS4FA/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==)



## Redis Cache

### Redis 怎麼知道一個資料過期了沒？

```
typedef struct redisDb {
    dict *dict;    /* 数据库键空间，存放着所有的键值对 */
    dict *expires; /* 键的过期时间 */
    ....
} redisDb;
```



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Ffa91970e-b04e-4540-bf1f-5b00da328d38%252FUntitled.png%3Ftable%3Dblock%26id%3Db49eaff8-5bc5-4da3-8fbb-793190ef98de%26cache%3Dv2&w=3840&q=75)

### 如何因應 Redis 可能會放滿資料的情況？

### 一、放滿前：

#### 1\. 定期刪除所有過期資料 TTL-based expiration

- 優點：記憶體清理乾淨

- 缺點：由於 Redis 是 single thread，在刪除時會卡到其他資料操作

#### 2\. 隨機刪除法 Periodic expiration



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fa9d1e672-63ff-464f-b6ef-a73764b1cecf%252FUntitled.png%3Ftable%3Dblock%26id%3D67fef791-9ee4-4011-9e61-7447d527873e%26cache%3Dv2&w=3840&q=75)

- **定期隨機刪除部分過期資料，只要 RAM 夠用就好**

- 優：

   - 省 CPU 資源

- 缺：

   - 清理方面沒有定時刪除效果好，同時沒有惰性刪除使用的系統資源少

   - 還是會有過期資料沒被清除

#### 3\. 惰性刪除法 Lazy expiration

- **資料被查到，若發現已過期就刪除資料**

- 優：

   - 省 CPU 資源

- 缺：

   - 但還是會有過期資料沒被清除

   - 若是 TTL 設定很久，有可能在清除資料前 RAM 就先爆掉

### 二、放滿時：

#### 記憶體淘汰策略 **maxmemory policy**

- 觸發時機：達到記憶體上限

| **Eviction Policy** | **Description** | 
|---|---|
| noeviction | New values aren’t saved when memory limit is reachedWhen a database uses replication, this applies to the primary database | 
| allkeys-lru | Keeps most recently used keys; removes least recently used (LRU) keys | 
| allkeys-lfu | Keeps frequently used keys; removes least frequently used (LFU) keys | 
| allkeys-random | Randomly removes keys | 
| **`volatile-lru` （預設策略）** | Removes least recently used keys with `expire` field set to true | 
| volatile-lfu | Removes least frequently used keys with `expire` field set to true | 
| volatile-random | Randomly removes keys with `expire` field set to true | 
| volatile-ttl | Removes least frequently used keys with `expire` field set to true and the shortest remaining time-to-live (TTL) value | 

1. 有到期欄位的

   **volatile-lru**

   - **描述**：移除設有到期欄位的最少近期使用的鍵。

   - **優點**：僅針對設定了到期時間的鍵，避免刪除持久數據。

   - **缺點**：如果只有少數鍵設定了到期時間，則效率可能不高。

   **volatile-lfu**

   - **描述**：移除設有到期欄位的最少頻繁使用的鍵。

   - **優點**：針對設有到期時間且不常用的鍵。

   - **缺點**：與 **`volatile-lru`** 相同，依賴設置了到期時間的鍵的數量。

   **volatile-ttl**

   - **描述**：移除設有到期欄位且剩餘生存時間（TTL）最短的＋最少使用的鍵。

   - **優點**：優先刪除即將過期的數據。

   - **缺點**：依賴設置了到期時間的鍵的數量，可能不會立即釋放大量記憶體。

   **volatile-random**

   - **描述**：隨機移除設有到期欄位的鍵。

   - **優點**：僅針對設定了到期時間的鍵。

   - **缺點**：隨機性可能導致重要鍵的提前刪除。

2. 所有資料都被考慮進去

   **allkeys-lru**

   - **描述**：保留最近使用的鍵；移除最少近期使用（LRU）的鍵。

   - **優點**：優先保持最近活躍的數據。

   - **缺點**：可能會刪除長時間未使用但仍然重要的數據。

   **allkeys-lfu**

   - **描述**：保留經常使用的鍵；移除最少頻繁使用（LFU）的鍵。

   - **優點**：優先保持高頻繁使用的數據。

   - **缺點**：新的或偶爾使用的數據可能會被提前移除。

   **allkeys-random**

   - **描述**：隨機移除鍵。

   - **優點**：簡單且不需要維護使用頻率或時間戳信息。

   - **缺點**：可能會隨機刪除重要數據。

3. 預設

   **noeviction**

   - **描述**：當記憶體限制達到時，不保存新的值。

   - **優點**：確保數據的完整性，不會丟失當前存在的數據。

   - **缺點**：當記憶體達到上限時，所有寫操作都會失敗，可能導致應用程序中斷或出錯。

   備註：當一個資料庫使用 replica 時，適用於主資料庫

   1. **數據一致性**：確保主資料庫中的所有數據都被復制到所有復制品上是很重要的。如果主資料庫開始因為達到記憶體限制而刪除數據，那麼復制品可能無法獲得所有最新的數據。

   2. **避免不一致的過期行為**：如果主資料庫使用基於過期的策略，例如 **`volatile-lru`** 或 **`allkeys-lru`**，並且復制品使用了不同的過期策略或不同的過期設定，這可能導致主資料庫和復制品之間的數據不一致。

   3. **寫操作的預期行為**：當主資料庫使用 **`noeviction`** 策略並且記憶體達到上限時，所有新的寫操作都會失敗，這會提供一個清晰的信號，告知應用程序或操作員需要進一步的干預。

   4. **故障轉移**：如果主資料庫發生故障，一個復制品可能被提升為新的主資料庫。在這種情況下，選擇 **`noeviction`** 策略確保這個新的主資料庫具有完整的數據集，不會因為過期策略而丟失數據。

### 有 LRU 為什麼還要有 LFU 演算法？

**LRU 原理**：淘汰最久沒被訪問的數據。

- 如果最近一批大量數據只被撈一次，**很長時間不再被訪問**，它會佔用大量緩存

**LFU 優點**：

- 對於持續高頻訪問的數據非常有利，因為這些數據不容易被淘汰。

- 能夠識別真正的 hot data，即長期高頻訪問的數據。

**LFU 缺點**：

- 如果某個數據之前被高頻存取，但**現在不再需要**，LFU 可能會持續保留這些不再需要的熱數據。

### 如果 Master 資料庫淘汰掉了某些資料，Slave 也會跟著一起淘汰嗎？

在 Redis 的複製模型中，從資料庫會嘗試模仿主資料庫的所有操作，以確保它們的數據集是一致的。因此，當主資料庫因為某種淘汰策略而刪除了鍵，相應的刪除操作也會被傳送到所有的從資料庫，導致它們也刪除同樣的鍵。

但要注意的是，這種行為只適用於主資料庫上的`淘汰策略`。例如，如果主資料庫因達到記憶體上限而啟動了淘汰策略，那麼從資料庫會模仿這些淘汰操作。但是，如果一個鍵在主資料庫中自然到期並被刪除（`惰性刪除、定期刪除`），則從資料庫不會立即刪除該鍵，而是會等到該鍵在從資料庫自己的到期時間到達時再進行刪除。

### 如何因應大量 hot data 同時過期，導致資料庫被打爆的狀況？

- 在 AP 層可以設定 TTL 為亂數，避免同時過期的狀況

- hot data 的 TTL 直接不過期

#### 冷知識

- a single Redis string can be a maximum of 512 MB.

#### **Standard Cache vs Semantic Cache**

- <https://python.langchain.com/docs/integrations/llms/llm_caching>

- **Standard :** by promt

- **Semantic :** by similarity

## R**edis as vector database**

- redis langchain 文件:

   - vectorstores/redis：<https://python.langchain.com/docs/integrations/vectorstores/redis>

   - providers/redis <https://python.langchain.com/docs/integrations/providers/redis>

   - api <https://api.python.langchain.com/en/latest/vectorstores/langchain.vectorstores.redis.Redis.html#langchain.vectorstores.redis.Redis.add_documents>

- 官方專案範例:

   - <https://redis.com/blog/build-ecommerce-chatbot-with-redis/>

   - <https://github.com/RedisVentures/redis-langchain-chatbot/blob/main/redis-langchain-ecommerce-chatbot.ipynb>

- redis stack

   - docker image <https://hub.docker.com/r/redis/redis-stack>

   - 官方 module <https://redis.io/resources/modules/>

   - [redis-stack](https://github.com/redis-stack/redis-stack)

      [redis-stack](https://github.com/redis-stack/redis-stack)

      ![](https://img.shields.io/github/last-commit/redis-stack/redis-stack)

      ![](https://img.shields.io/github/stars/redis-stack/redis-stack?logo=github)

   - <https://redis.io/docs/about/about-stack/>

- redis search

   - [RediSearch](https://github.com/RediSearch/RediSearch)

      [RediSearch](https://github.com/RediSearch/RediSearch)

      ![](https://img.shields.io/github/last-commit/RediSearch/RediSearch)

      ![](https://img.shields.io/github/stars/RediSearch/RediSearch?logo=github)

   - <https://redis.io/docs/interact/search-and-query/search/vectors/#querying-vector-fields>

- VSS <https://redis.com/wp-content/uploads/2023/04/vss-cheat-sheet.pdf>

   - vector indexing method <https://weaviate.io/developers/weaviate/concepts/vector-index>

#### Redis Cluster

- 中文筆記 [https://medium.com/fcamels-notes/redis-和-redis-cluster-概念筆記-fdc19a3117f3](https://medium.com/fcamels-notes/redis-%E5%92%8C-redis-cluster-%E6%A6%82%E5%BF%B5%E7%AD%86%E8%A8%98-fdc19a3117f3)

- 官網擴展性概念解說 <https://redis.io/docs/management/replication/>

#### Redis Sentinel

- langchain <https://python.langchain.com/docs/integrations/vectorstores/redis#redis-connection-url-examples>

- [docker-compose-redis-sentinel](https://github.com/880831ian/docker-compose-redis-sentinel)

   [docker-compose-redis-sentinel](https://github.com/880831ian/docker-compose-redis-sentinel)

   ![](https://img.shields.io/github/last-commit/880831ian/docker-compose-redis-sentinel)

   ![](https://img.shields.io/github/stars/880831ian/docker-compose-redis-sentinel?logo=github)

    ← 這個有 bug，但是拿來理解跟看看還算可以

- ← 這個可以成功跑起來

   - 說明文件 <https://www.developers-notebook.com/development/using-redis-sentinel-with-docker-compose/>

### Persistence Storage

#### RDB

- 中文簡介 <https://ithelp.ithome.com.tw/articles/10277020>

- 儲存時間、載入時間參考 <https://webcache.googleusercontent.com/search?q=cache:A4HuPmSiYm4J:https://groups.google.com/g/redis-db/c/HfGU_yqYzSc&cd=3&hl=zh-TW&ct=clnk&gl=tw>

#### AOF

- 中文簡介 <https://ithelp.ithome.com.tw/articles/10277477>

- RDB 可以跟 AOF 混用 <https://ithelp.ithome.com.tw/articles/10278088>

#### 想到的 Redis 問題

- RediSearch 跟 PGvector 比較

- LangChain 目前還不支援 redis cluster，之後規模擴充之後該怎辦？

   - 💡 cache 跟 vector store 分離 → 兩台機器

   - 設定 eviction policy：allkeys-lfu

- 在「不支援 redis cluster」的情況下要怎麼達成 Redis as vectorDB 的擴展性？

   - 目前系統：Read intensive

   - 💡 將專家資料庫分類

      

      ![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F1e62facc-b7c2-4606-86a6-e8af58a0c996%252FUntitled.png%3Ftable%3Dblock%26id%3D45e76f48-f8da-4d8a-939d-ccfc48cb5dc2%26cache%3Dv2&w=3840&q=75)

      作法：

      - 採用 Master-Slave 架構，進行讀取分流

      

      ![notion image](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)

      - 一顆 Master redis 配合數顆 Slave 負責某範圍內的專家資料庫（需要計算資料量才能評估範圍大小）

      - 自己實作負載[平衡演算法](https://samwho.dev/load-balancing/)，分流讀取量到不同 redis

      好處：

      - 故障轉移＋Read Replica 提高`可用性`

      - 就算 langchain 不支援 Redis Cluster 也能進行`讀取分流`

         - `知識範圍`做到分流

         - `機器`也做到分流

      限制：

      - 如果「單一專家資料庫」需要放的內容大於「單一 Redis 資料容量」可能會發生放不下的狀況

         - 但可以試著把資料庫範圍拆小

      - 目前 lancgchain 提供的架構沒辦法享受 sharding 帶來的好處，只能自己想辦法逼近 sharding

- 要怎麼達成 Redis as vectorDB 的高可用性？

   - 使用 `Sentinel` + `Master Slave 模式`

      

      ![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F099c3dbb-443b-4363-a067-cfaa511ca32f%252FUntitled.png%3Ftable%3Dblock%26id%3D72b58ae4-3751-4a00-a8a5-9db9e4e981fd%26cache%3Dv2&w=1080&q=75)

      作法：

      - Sentinel 持續監聽所有 redis 的狀態，若任一一個 instance 倒下都會收到通知

      - 若是 Master 倒下，則進行故障自動轉移

      - App 只需要跟 Sentinel 要 redis instance，不必再應用程式層手動處理 redis pool

      

      ![notion image](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)

      缺點：

      - lancgain 目前只支援單一 sentinel，因此若是哨兵故障，就沒人可以顧 redis master-slave（不過目前想像不到可能發生哨兵倒下的常見原因）

**Quick Start**

#### Mac 快速安裝

```
brew install redis
```

#### 啟動 Redis

```
redis-server
```

#### 背景運行 Redis

```
brew services start redis
```

#### 查看目前 Redis 資訊

```
brew services info redis
```

#### 停止 Redis

```
brew services stop redis
```

#### 連線到 Redis

```
redis-cli
```



Source: <https://www.backend-b.com/note-learning-redis>