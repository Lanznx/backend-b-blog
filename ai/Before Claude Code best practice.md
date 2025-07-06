## Before Claude Code best practice

### 前言

公司最近的讀書會在分享 claude code best practice，我在想大家可能多少都會去講 [claude 官方的文章](https://www.anthropic.com/engineering/claude-code-best-practices)，所以我想分享一些不一樣的觀點：before claude code

在讓 Agent 有辦法加入我們的團隊之前，我們應該要先想想辦法讓 Agent onboard 我們 team，這也就代表要有辦法讓 AI 了解我們在做的事情、domain knowledge、開發規範。

### AI Agent infra setup

其實就跟教育新人很像，因為我們 team 最近新進了幾個新人，所以我在這塊特別有感：如果文件沒寫、或是過期，那其實新人獲取知識的管道完全耦合在前輩身上。

如果我們可以降低這部分的門檻，那不是很棒嗎！

目前在我的親身經歷，專案知識的來源有以下管道：

- 產品規格文件（Spec）

- 架構決策紀錄（ADR）

- 會議討論

- codebase 與 test（測試本身是很好的文件）

- slack

目前我們公司對於 spec, ADR, 測試都很有要求，我覺得這方面要讓 AI 進行 onboard 是沒問題的，但這些知識來源的更新速度相對其他的來源慢，可以說是在整個專案供應鏈的尾端。真正要解放產能的話，我覺得應該從知識的上游開始：會議討論、slack 討論。

因此我有個構想：把這些知識自動匯聚到 github repository 裡面，這樣有兩個好處：

- 新人在 onboard 專案的時候，有任何問題就用 vscode agent 之類的工具問問題，提升新人 onboard 效率、減少前輩解決問題的成本。

- AI Agent 在解 ticket 的時候更容易理解今天的專案背景知識、要解決的問題具體是什麼。

### 具體怎麼做？

針對會議記錄來說，我的構想是整合 n8n 做自動化處理。

![notion image](https://www.notion.so/image/attachment%3Aa0caed09-c431-4568-9483-b6cca1d193df%3Aimage.png%3FspaceId%3D0786106d-95fd-4999-b526-8595056ea48c?table=block&id=22761fa7-980f-80ab-acaa-ee4a8a232612&cache=v2)

首先可以讓 AI meeting note 工具在整理好語音稿之後把會議記錄打去 n8n 上，透過 n8n 自動傳到 slack、並且 commit 進去 git repo 裡面。

至於 slack 討論，我覺得理想的方式是可以擴充 slack bot 的功能，除了讓他可以搜集討論串的內容整理成文件，也要可以 commit 文件進去 git repo。

### 要解決的問題

寫文件本身其實就不是一件容易養成的習慣，寫好更是困難。但是除了寫出好文件之外，最難的其實是文件的「新鮮度」

我們在不同會議裡面可能對一件議題的結論會是有衝突的。在產品生命週期比較長的專案裡面，絕對會有一大堆的文件記載的知識會相互衝突，如果把它一股腦丟進去給 AI，有可能會發生舊文件誤導 AI 的情況。

我目前還沒有一個很明確的想法，但我知道 Mem0 他們家的工具可以做到 conflict resolution，或許我們可以透過整合 Mem0 他們家的工具，去 minimize 維護文件新鮮度的勞力。

### 小結

我覺得上述的基礎建設都蓋好了，數位勞工就會離我們又跨出了更大一步，可以因為這些基礎建設受益的部門絕對不止 Engineer，也可以複用在其他的工作崗位上。

在公司不會裁員的前提下，應該是可以大幅提升員工產能、讓大家提早下班、提升人類的快樂指數。

### 歪題一下

不過我自己覺得經濟學跟資本主義不會允許這種事情發生，接下來會發生的應該會是：

- 產能曲線顯著右移，但需求曲線如果不怎麼動的話：市場均衡價格下滑

- 公司手上有的選項：

   1. 保留大多數員工，但是員工薪資下降

   2. 裁員，因為不需要這麼多人＋數位勞工很划算

   3. 1, 2 並行運作，一邊裁員，一邊降新人的薪水

上面的事情應該也不是未來的事，大概正在慢慢發生了 :P

或許我們要多想想人類的價值在哪，為什麼一間公司還需要人？寫到這邊覺得世界好像快毀滅了 XD



Source: <https://www.backend-b.com/before-claude-code-best-practice>