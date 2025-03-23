# 初探 Event Sourcing



## 一、What is event sourcing?

**核心概念**：系統內所有「狀態變化」都使用「事件（Event）」的形式，追加（append-only）到不可變的事件日誌（Event Log）中，而非直接更新資料表或欄位。

#### **State Sourcing vs. Event Sourcing**

舉例來說：在 **State Sourcing** (CRUD) 的系統裡面，更新交易帳號餘額的方式可能會是直接覆寫餘額

例：今天花了一百元

本來有 1000 元 → 記錄更新後的結果 900 元

在 event sourcing 的系統裡，更新交易帳號的方式是紀錄 event

例：今天花了一百元

記錄 -100 元的 event 進去資料庫

如果要得到現在的帳戶餘額，那就需要把過往的記錄給 replay 一遍

## 二、引入 Event Sourcing 的好處是什麼

### 1\. 完整的歷史紀錄（Audit Trail / Traceability）

在 Event Sourcing 中，每次狀態變更都以「事件」的形式記錄下來，形成 immutable Event Log

這讓你可以回溯任何時點的系統狀態，以及瞭解「為什麼」會演變到目前狀態。

- **金融交易系統**：

   銀行的交易紀錄，每一筆轉帳或存款都保留在事件日誌中，事後若有糾紛，可清楚追溯誰在何時做了什麼操作。

- **共編文件**

### 2\. 搭配 CQRS 可以提升系統的 scalability 與 availability

**簡介 CQRS:**

在傳統 CRUD 架構中，系統通常會：

- **使用相同的 data model 處理讀取與寫入**。

- **寫入時** 可能需要多表 JOIN 或複雜的 transaction。

- **查詢時** 可能因為 data model 設計過於正規化（Normalized）導致查詢效能低下。

所以 CQRS 想做到的是把 command 跟 query 所使用的 data model 分離，讀寫各自用適合的 model 進行

例如，在一個 **電子商務系統**：

- 一筆「訂單」可能會涉及 **訂單表、商品表、庫存表、用戶表、支付表** 等。

- 若直接查詢「某用戶的所有訂單」，可能需要多次 JOIN 操作，導致查詢變慢。

- 前提：系統的讀寫比例是寫少讀多

![notion image](https://www.notion.so/image/attachment%3A12009e60-275a-4ee7-8cac-7d56f1ed528f%3Aimage.png%3FspaceId%3D0786106d-95fd-4999-b526-8595056ea48c?table=block&id=1a961fa7-980f-8048-9314-c151b457e2d8&cache=v2)

**問題來了，CQRS 如何幫助提升吞吐量？**

CQRS 帶來的吞吐量提升主要來自於：

1. 讀取與寫入可獨立擴展 → 避免讀取壓力影響寫入性能。

2. 讀取可以使用專門的快取、NoSQL → 讓查詢更快，不影響主資料庫的負載。

3. 寫入可以先把 request data 給 queue 起來 → 減少同步寫入的鎖定問題，讓寫入性能更穩定。

   1. 要怎麼做 multi-master 在 DDIA 有講，cue 一下 jerry 之後可以研究

### 3\. Event Sourcing 可以帶來 Multi Read Model，提升系統資料運用彈性

因為每個事件都會發佈到 log，**任何下游系統**只要訂閱這個log event，就可以根據事件內容建立或更新自己的資料庫 (讀模型)

![notion image](https://www.notion.so/image/attachment%3Ad95ea368-1802-424c-a789-5ecfae0f7b9f%3Aimage.png%3FspaceId%3D0786106d-95fd-4999-b526-8595056ea48c?table=block&id=1a961fa7-980f-805b-a45c-de733b8abdfd&cache=v2)

以商品 event 為例子：

#### MySQL read model（訂單後台/客服用）

- 公司內部的客服人員需要傳統的「資料表檢視」，用來查詢訂單狀態、客戶資訊。

- 之後客服或管理人員可以透過 MySQL 讀取當前最新資訊（例如：`select * from orders where orderId = ?`）。

#### ElasticSearch read model（商品搜尋）

- 傳統 SQL 對文字搜尋不夠彈性。

- 官網前端需要提供使用者「關鍵字搜尋商品」功能，含模糊搜尋、同義詞匹配等。

#### OLAP 數據分析（顧客行為/銷售趨勢）

- 市場行銷部想要分析「月銷售趨勢」「熱賣商品」「轉換率」等指標，並建立儀表板 (Dashboard)。

- 通常這些分析要跑在 **Data Warehouse**（例如 BigQuery、Snowflake、Redshift）或 Hadoop/Spark 環境。

如果要再加入新的 read model，就只要加入一個新的 consumer 來訂閱 producer channel 就行

## 三、Event Sourcing 的潛在問題

### 每次建立最新狀態都需要 replay 所有 event

> event sourcing 的系統會不會出現：為了要重現目前的狀態，而將過去一千萬筆 event 給撈出來做 replay 的情況？這樣顯然效率非常差勁，有什麼改善方案

我們可以建立 snapshot 紀錄當前資源狀態，下次 replay 時就有一個中繼的存擋點，不用每次都重新播放所有 event

建立 snapshot 會有一些策略：

#### 依「事件數量」

1. 優點：簡單直觀

2. 缺點：事件產生有高峰期與低峰期

   - 某些時候（假期促銷、流量高峰、季節性需求），事件量激增；在其他時段，事件量則稀少。

   - 單純靠「事件數量 N 筆」做為快照門檻，**無法反映動態負載**。

   - 高峰期頻繁產生快照，**持續佔用系統資源**，甚至可能在關鍵時刻影響系統效能。

![notion image](https://www.notion.so/image/attachment%3A53225eaa-1efd-43b4-a8bf-8e1dc0a54edb%3A%25E6%2588%25AA%25E5%259C%2596_2025-03-01_21.12.08.png%3FspaceId%3D0786106d-95fd-4999-b526-8595056ea48c?table=block&id=1a961fa7-980f-80a0-a82e-ec759fd5bde3&cache=v2)

#### 依「時間週期」

1. 優點：簡單直觀

2. 缺點：

   1. 若某段時間事件爆量，還要等到排程到期才做快照，期間重播量仍然很大。

   2. 反之，如果事件量低，定期做快照可能是多餘的開銷。

      ![notion image](https://www.notion.so/image/attachment%3Aca7b6fb6-21de-4c94-b913-a8b3c22c9bd7%3A%25E6%2588%25AA%25E5%259C%2596_2025-03-01_21.13.24.png%3FspaceId%3D0786106d-95fd-4999-b526-8595056ea48c?table=block&id=1a961fa7-980f-80f8-82b1-eca9a8add818&cache=v2)

#### 依「業務邏輯觸發」

例：電商平台的每張訂單的狀態變更（下單、付款、出貨、完成、取消）都透過事件紀錄。

每次系統要查詢「訂單最新狀態」，都得回放事件來組合狀態，但某些訂單已經不再變動，重播是沒必要的。

當訂單進入「完成」或「取消」狀態時，存一次快照。

之後系統查詢這些訂單時，直接讀快照，不需要再重播事件。

1. **優點：** 更貼近業務邏輯，減少不必要的快照頻率。

2. **缺點：** 設計上需要深入理解 **業務的狀態切換時機**，若業務規則頻繁變更，快照時機也要跟著調整。

   如果「完成狀態」的訂單仍然可能有其他影響（如後續退款、客戶異議），要考慮如何更新快照。

### Event 的版本演進，維護複雜

在維護系統的時候不只需要考慮到現在、未來，過去的需求也要考慮到，因為過去的 event 已經發生並且記錄下來了。

#### 範例 1：欄位改名（Rename）與意義改變

有一個電商系統，最初的購物車事件定義如下：

```
Event: CartItemAdded
version: 1
fields:
  - cartId: String
  - productId: String
  - qty: Int
  - price: Double （設計的時候預設只會用 USD）
```

一段時間後，系統演進了，下列需求出現：

1. 價格必須同時紀錄「幣別」（currency），而不再是單純的 Double。

2. 也想要把欄位 `price` 改名為 `unitPrice`，避免讓人誤以為是總價。

**問題:**

- **舊事件都只有 `price`，且沒有幣別**。

- 新版系統若只用新的欄位 `unitPrice` + `currency`，在重播舊事件時，**要從哪裡來判定幣別**？

- 若沒有處理，系統在重播（replay）舊事件時會出現「找不到欄位」或「幣別為 null」等問題。也可能會在報表計算時搞混。

**解法：**

1. **向後相容**：

   - 每次讀舊事件時，預設 `currency = 'USD'`，並把 `price` 當作 `unitPrice`。

   - 不刪除舊欄位 `price`，只是在新事件中新增 `unitPrice` 與 `currency`。

   - 這樣新的讀邏輯可以同時吃舊、新事件；雖然事件結構逐漸臃腫，但對維運衝擊小。

2. **做批量轉換（transformation 或 upcasting）**：

   - 寫一個小程式去掃所有舊事件（`CartItemAdded/v1`），將事件「升級」成 `CartItemAdded/v2`：

      - 新增欄位 `currency='USD'`

      - 將舊欄位 `price` rename 成 `unitPrice`

   - 最後將轉換後的事件重新寫入新的 Event Store（或新的 stream）。上線新版本後，程式只讀取 `CartItemAdded/v2` 格式。

#### 範例 2：欄位意義改變，導致歷史事件解釋不同

```
Event: UserRegistered
version: 1
fields:
  - userId: String
  - email: String
  - age: Int         （當時腦破了，直接記錄使用者年齡）
```

後來發現：

1. `age` 根本不適合作為長期的不可變紀錄，因為使用者年齡每年都會變。

2. 新規定必須取得使用者的「出生年月日」，以支援其他報表需求。

**問題**

- 舊事件裡只有 `age`，新事件想要存 `birthDate`。那舊事件該怎麼辦？

- 讀舊事件時，無法從 `age` 精準推算 `birthDate`。假設有人在 2019 年註冊，年齡=30，但現在 2025 年重播事件，你「回放」時是否要繼續把他當作 30 歲？

- 這會牽涉到**歷史事件的語意**：當時註冊時，他的確填寫「當年的年齡」，跟新需求要的「出生年月日」是完全不同的概念。

**解法**

1. **補充欄位 / 加註 metadata**：

   - 繼續保留舊事件不動，但在新事件或後續 event 中，引導使用者或系統**再產生**一個 `UserProvidedBirthDate` 的事件。

   - 舊事件照原樣保留，顯示「當時的年齡資訊」只是個歷史參考，新事件紀錄真正的出生年月日。

   - 報表層或讀模型（projection）在遇到舊事件時，若沒有 `birthDate` 就必須依靠後續的 `UserProvidedBirthDate` 事件去補齊。

2. **完全 upcast**：

   - 在事件層級做大規模資料修訂（假設公司有備份可能查到每個使用者真正的出生年月日），批量更新所有舊事件，將 `age` 改為 `birthDate`。

   - 作法類似把舊 `age` 欄位換成 `birthDate`。若缺少資料就填 `null` 或 `unknown`。

   - 雖然可以「強制一致」，但要付出大規模清理與人工作業成本。

### event sourcing 會讓系統難以遵守強一致性

- 通常 event sourcing 的系統會直接把資料寫進去 log，並且透過非同步的方式將資料 sync 過去 read db

- 因此有可能會出現：我剛留完言，但我重整後 fetch 下來的資料來自 read db，而 read db 還沒同步到來自 leader 的資料。因此對使用者來說，他剛剛的留言直接不見了

   - 延伸：如何做到 read your own write?

      - 一、read from leader

      - 二、在一定時間內 read from leader

         - 固定一分鐘內可以問 leader，在這之後就去問 read db

      - 三、帶著 create 的時間戳

         - 如果 read db **已經拿得到**這個時間戳的資料，那就去問 read db

         - 如果 read db 拿不到這個時間戳的資料

            - 可以去問 leader

            - 或是 retry

### 要記錄每個 event 所需的儲存空間需求巨大

延伸：log compaction

### 導入團隊的難度

- event sourcing 跟 CRUD 的設計不太一樣

- event sourcing 背後牽涉到 DDD 的概念，整個知識體系學起來不容易

## Reference:

延伸：Git 原理



Source: <https://www.backend-b.com/%E5%88%9D%E6%8E%A2-event-sourcing>