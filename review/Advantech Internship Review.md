# Advantech Internship Review

## Intro

在研華工作的這九個月，我覺得非常舒適，學到了很多但不會壓力大。這可能要感謝我的主管 Michael，他給我們實習生很大的空間去開發，但同時不會讓我們扛太多的壓力，一句話總結來說：他是我心中最理想的主管會有的模樣。

在這次的實習心得分享，我希望可以從三個維度來分享：工作內容、文化、面試心得，如果可以幫到你的話歡迎來關注我的哀居工程帳 @[backend_b_\_](https://www.instagram.com/backend_b_\_/) 我平常會在上面分享自己的所見所聞

## Tech Stack in this internship

在九個月的實習中，需要去學習並使用的技能算是蠻廣泛的，基本上需要用到你就得去學一下

不過也不用擔心，雖然我自己在進研華之前已經會大部分的工具，但對於不太熟悉的前端、LangChain 這些都會有時間讓你學習再投入開發。不要害怕自己會的技能太少，機會是給想把握的人去抓住的，只要你會基本的前後端、docker，就可以來面試看看！



![Tech Stack in this internship](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252F0a52fa63-bb11-4454-a510-cd86189408dc%252FUntitled.png%3Ftable%3Dblock%26id%3Df6e474f0-d6c9-4b4b-a060-bc6643f77284%26cache%3Dv2&w=3840&q=75)

Tech Stack in this internship

## What I do

在這個段落我會簡單回顧一下我在研華的工作內容，不過根據不同部門跟主管本來就會有很大的變化，因此這邊只是給好奇研華工作的人一個參考點

### 產品 PHM 開發

> 大致上是在幫公司給工廠客戶端的產品寫介面、支援 dashboard 的顯示格式。
>
> 以數字來說，在這次的產品開發中 trace 了超過五個 Grafana 插件、開發了超過三個客製 Grafana 插件。

- 後端微服務開發

   - 首先需要開發後端 micro service 來支援插件的資料格式，這邊算是偏簡單的地方，大概就是起個 FastAPI 服務、串接資料就沒問題了

- 前端 Dashboard 插件開發

   - 由於產品的前端介面基於 Grafana 生態系，為了讓 dashboard 插件符合 Grafana 生態系的規範，我 trace 了很多網路上的開源專案，還有嘗試去學一點點 Angular，這過程對於不熟前端的人來說會有點頭疼。

- Kubernetes 部署

   - 相對於前面寫功能，這邊比較像是學怎麼用工具，要用公司內部架好的 K8s 服務來部署到集群裡面，說白了其實就是學學 YAML 檔怎麼寫，有問題就問，沒特別難的地方。

### 我在這當中帶走了：強化 Trace Code / Issue能力

現在回顧起來，忙 PHM 的這段期間像是在熟悉開發流程、幫開發 LLM 服務熱身。

雖然我平常已經很習慣用 GitHub 達成團隊協作、git flow control 等等的事情，但其實很少在認真關注社群的討論，最多就是在 StackOverflow 上找找解答吧。

但有些 Grafana 生態系的插件偏冷門，如果出錯了 ChatGPT 不一定能幫上忙、StackOverflow 也不一定會有人討論，因此我會需要跑去該插件的 GitHub repo 找相關 issue，或甚至去看他們的程式碼怎麼寫的，對於理解怎麼自己實作插件、排除問題很有幫助。

對於後面的 LLM 專案幫助不小，因為 LangChain、很多向量資料庫都很新很年輕，完整的知識、雷點整理很少，必須要自己去挖 issue，甚至自己去發問。

### LLM、RAG 研究與實作

> 由於導入 AI 到研華以及各工廠客戶還在新興階段，因此相對前面的產品的開發方向會非常多元，但也因為這樣探索到了特別多新知識。

開發的重點太多太雜了，我挑三個印象深刻的事情來分享就好。

#### 設計、實作工廠場景 Chatbot

必須說生成式 AI 是個非常有趣的主題，對 AI 完全不熟的我透過這個契機開始接觸 RAG、embedding、fine-tune，甚至到後來會滑推特的時候沒事就看一下最新的 LLM paper⋯⋯雖然只是看個皮毛，但去了解生成式 AI 最新的發展實在很有趣。

並且在熟悉這些技術之後，我們要開始透過 LangChain 實作 AI 服務來幫助工廠管理員減輕管理負擔。因為 LangChain 實在是個很年輕的框架，有一堆問題需要去參考跟解決，所幸在上個專案中已經養成了從 issue 海去撈取資訊的習慣，在每個坑都沒有停留太久就解決了。

在這個專案中最讓我印象深刻的是：我主管讓我們實習生去調查 RediSearch / PGVector 作為公司向量資料庫的優勢以及侷限性，在這之後讓我們設計＋實作了 prototype 出來。



![當初我所提出的架構（一）](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252F3f4c8ab1-2b2e-461c-8539-1b6578dacfc3%252FUntitled.png%3Ftable%3Dblock%26id%3Dad764c91-66ec-4903-9ac5-11b94fd0c917%26cache%3Dv2&w=1920&q=75)

當初我所提出的架構（一）



![當初我所提出的架構（二）](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252Fc8b8198f-66b6-4ceb-9faf-a02f960aee6e%252FUntitled.png%3Ftable%3Dblock%26id%3Dfe0f5628-94d9-48a8-aec3-f8bdd929a331%26cache%3Dv2&w=1920&q=75)

當初我所提出的架構（二）

通常實習生很難得會得到 own 一個專案的高度自主權，但我們拿到了。因此我好好地砸了時間在探索以 Redis 作為主力向量資料庫會遇到的問題，以及如何去 scale up，是個很棒的機會來認識分散式 Redis (sentinel / cluster) 以及一些原理跟策略。

在這邊想題外話一下，當初在調查 PostgreSQL 做為向量資料庫可能的時候，我們發現 PGVector 支援的 vector indexing method 不包含 HNSW，因此在 github issue 被敲碗敲爆，也是我們當初不選用 PGVector 主要原因。但過了一個月就發現他們支援了！超級快就把這個 feature 給趕出來⋯⋯軟體圈前進的速度真的很快。

#### 技術選型說服

> 除了上面提到幫忙向量資料庫（RediSearch / PGVector）選用之外，我還拿到了另一個重大的任務：負責上台簡報說服另一個 team 的高層，改用另一種 low code 工具



![工程師的簡報都很陽春，簡單易懂就好](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252Fc4114e4d-171a-4f69-a70c-617876ba6d9c%252FScreenshot_2024-02-19_at_5.48.20_PM.png%3Ftable%3Dblock%26id%3Dd3c65d32-16d4-4323-8cd8-3b8337241f6c%26cache%3Dv2&w=3840&q=75)

工程師的簡報都很陽春，簡單易懂就好

當初主要是我跟另一個實習生覺得目前的工具不是那麼好用，因此跟主管簡單分析、比較了兩種不同的 low code 工具，主管也覺得有道理，就展開了這次的行動。

這讓我感到備受重用，因為通常實習生說話的份量在大公司並不那麼容易受到重視，但我拿到了這個機會上台說服別的 Team 改用別的 Tech Stack，到最後也順利成功了，非常的有成就感。

我覺得重點在於分析現況、比較兩者優缺、Use Case 舉例。不用太汲汲營營，重點在於呈現客觀的分析，大家都是工程師，在理性討論後會做出好決定的。

#### 優化 RAG 表現

- 在周會上偶爾簡單報一下最新的 LLM paper 研究，基本上我關注的都是進階 RAG 的方法

   - [Corrective RAG](https://arxiv.org/pdf/2401.15884.pdf)

   - [Chain of Table](https://arxiv.org/abs/2401.04398)

   - [MultiHop-RAG](https://arxiv.org/pdf/2401.15391.pdf)

   - [Condorcet fusion](https://dl.acm.org/doi/abs/10.1145/584792.584881)

   - [Reciprocal Rank Fusion](https://plg.uwaterloo.ca/\~gvcormac/cormacksigir09-rrf.pdf)

### Open Source 啟蒙

> 在參與公司內部專案開發時，常常會需要用到不同的 Open Source 專案，算是我做開源的一塊敲門磚，回饋給社群的時候非常有成就感

- Grafana 插件

- LangChain

- LangFlow

上面這三個是我除了使用之外，有去碰內部程式碼的專案，這裡面每個專案都有一定規模、星星數，其中最讓我印象深刻的是 LangFlow，在做公司基礎建設的時候，我發現 LangFlow 缺乏 Redis VectorStore、PGVector 的連線 client，剛好這些功能實作出來並不困難，因此我就發了兩個 Pull Request 並且被成功 merge 進去，成就感滿到掉地上



![那個螢光筆畫起來的帳號就是我！](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252F34b0ca1b-6bbf-450e-89a7-f0ef31a75a69%252FUntitled.png%3Ftable%3Dblock%26id%3Da510ae2a-6f01-4714-9d80-30bd05db3cdb%26cache%3Dv2&w=1920&q=75)

那個螢光筆畫起來的帳號就是我！

題外話，我目前正在投入一個 Metalake 的開源專案 [Gravitino](https://github.com/datastrato/gravitino)，歡迎來一起貢獻、給星星喔！這個社群有十位 mentor 可以帶你開發功能，並且創辦人都是來自世界各地開源圈的大佬，發展性非常高。

## Culture

由於我不是正職員工，就不分享所謂公司的價值觀、或其他的部分，我會聚焦在我所感受到的研華生活：以自身感覺來說，我對研華的福利感到蠻滿足的；實習生之間也有蠻多機會可以彼此認識，暑假去研華會很像是待在一個有薪水的夏令營 XD

### 期中、期末實習發表



![舞台蠻大的，報告起來很爽](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252F81d72dce-0a0c-4b7f-83ea-de1db450d96b%252FUntitled.png%3Ftable%3Dblock%26id%3Ddc0dc6b2-cc34-42fb-916f-506a0a0085b4%26cache%3Dv2&w=3840&q=75)

舞台蠻大的，報告起來很爽

- 研華很重視他們的實習計畫，會有高層來看實習生各個主題的發表。對於主題的多元性、學習潛力是有要求的。

### Tech Sharing

我們 team 大概每過一段時間就會有一次技術分享會，只要是跟工作相關的主題都可以發表，我自己有參加到兩次，分別是以下兩個主題

- 如何擴充現有 LangFlow 組件

- [乾淨架構心法](https://www.canva.com/design/DAF4zeC54nA/tBUkvdDt71Y5dSOgqRRbfw/edit?utm_content=DAF4zeC54nA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

### Team Building



![隨便找了一張看起來感情好的照片](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252Ff6172cf1-42b2-4d9a-b20b-e58cf56b59a5%252FUntitled.png%3Ftable%3Dblock%26id%3D32ba4d80-5258-40a3-b39b-f021a7391116%26cache%3Dv2&w=3840&q=75)

隨便找了一張看起來感情好的照片

會把不同部門的實習生打散，一起組隊玩密室逃脫，是個蠻有趣的體驗

### 點數換食物



![我最常點的套裝：草莓貝果＋拿鐵](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252Fb4873b0a-6e0b-404e-939e-c73ae32f0151%252FUntitled.png%3Ftable%3Dblock%26id%3Dea930746-f59b-4f4f-817b-657bdb06b704%26cache%3Dv2&w=1920&q=75)

我最常點的套裝：草莓貝果＋拿鐵

每個月會有大約價值八百元的點數，可以拿去換公司內部咖啡廳的餐點，我都拿來吃早餐、買咖啡，這部分讚讚

點數也可以拿去換電影票或是其他的票卷，不過我還沒試過就是了

### 休息時間飛空拍機



![DJI mini2 超讚](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252Fbad07264-d65d-477e-8835-b5d764b3f6f8%252FIMG_0204_2.heic%3Ftable%3Dblock%26id%3D79595a9f-1c45-450c-aa66-4e1c1d7b233e%26cache%3Dv2&w=3840&q=75)

DJI mini2 超讚

由於在暑假過後，會根據各部門的習慣決定實習生能否遠距上班，我很幸運的是主管很放心讓我們全遠距上班，因此我在每天的下午三點半到四點這個休息時間，會去樓頂飛空拍機，相信大家對各自的遠距生活都很有規劃的

## 結語

能夠看到這邊的人，應該多少對研華的實習感到興趣吧，快去職缺官網看看吧

然後別忘了追蹤分享 @[backend_b_\_](https://www.instagram.com/backend_b_\_/)，我們下次見



Source: <https://www.backend-b.com/advantech-internship-review>
