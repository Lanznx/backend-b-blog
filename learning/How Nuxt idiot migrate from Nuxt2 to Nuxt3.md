# How Nuxt idiot migrate from Nuxt2 to Nuxt3

### 前端小白的 Nuxt 專案 migration 之旅

嗨大家，我是 Brandon，今天想來跟大家聊聊身為前端小白的我是怎麼去規劃並進行全端專案 Nuxt 重大版本 migration。由於筆者本身具備的前端經驗少之又少，本篇並不希望將焦點放在 Nuxt 或任何技術上；反之希望帶給讀者的是：我在面對未知領域時，拆解問題的思路以及心得。



![Issue + PR 一共 70 個⋯⋯有些還在解決的路上](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252F15d04b3d-5863-44be-87bb-874a9697b70f%252Fimage.png%3Ftable%3Dblock%26id%3Dd705b4fd-bc07-490e-bde1-8706746bb84c%26cache%3Dv2&w=3840&q=75)

Issue + PR 一共 70 個⋯⋯有些還在解決的路上

開頭先來跟大家閒聊一下，**我在過去三個月獨立負責公司內部專案的技術遷移：從 Nuxt2 升級成 Nuxt3 的過程中貢獻了 70 個 Issue + PR**。

身為只會用 useState / useEffect 的 React 小白，我得說去進行 Nuxt2 升級 Nuxt3 是個莫大的挑戰！先說心得，這次的挑戰非常有成就感：我本身只注重後端技術的鑽研，但在三個月的 migration 生活當中，憑藉著條理的規劃以及耐心，最後克服重重困難、成功地遷移絕大多數的前端技術以及工具了！

### 為什麼要進行 Nuxt migration?

分發我這項任務的主管曾經丟給我這個問題：在開始一件任務之前你都要去思考「Why」，你回去之後想想為什麼套件版本的 migration 是必要的？

要進行套件升級的理由可以有一百個，但我覺得在公司內重點是這兩個：資安考量以及可維護性

1. 資安考量：在軟體的世界裡總是有堵不完的安全漏洞，每天都有海量、有大有小的資安漏洞被舉報出來，要是因為資安漏洞而導致公司被駭客走後門入侵、或是對外發動攻擊就糟了。

2. 可維護性：在短期內不升級 Nuxt2 到 Nuxt3 其實沒什麼關係，但在今年 (2024) Nuxt2 跟 Vue2 已被宣告 EOL (End of Life) 了，這意味著未來若是希望為使用到 Nuxt2 專案增添新功能，很可能會受到套件支援的限制。換個角度想：過個幾年也許就很難找到熟悉使用 Nuxt2 的開發者了，根本沒辦法維護這個專案。

綜上考量，即使 Nuxt 版本的遷移非常棘手，但這件任務還是具備其重要意義的。於是我收到了「將所有 dependecies 升到最新版」的任務，旅程就此開始。

### 前端小白執行 Nuxt migration 的困難點為何？

首先，在沒有接觸過 Vue / Nuxt / Next 的前提之下，我在前端領域的知識非常貧乏，對於前端的語法、常見工具、狀態管理十分不熟悉⋯⋯除此之外，由於許多工具都依賴於 Nuxt 版本（包含但不限於 Vuex, VueRouter, Vue Test Util, Nuxt ESLint, Boostrap Vue, …）

一旦升級了 Nuxt2 到 Nuxt3，就會導致許多工具 crash、整個專案無法顯示畫面、根本運行不起來。

於是我意識到了：要完成眼前這塊零散的拼圖，我首先需要了解拼圖的原貌。我需要做的是去了解在這個全端專案中的 migration 前後（分別是 Nuxt2, Nuxt3）需要用到什麼樣的工具、每個工具的使用情境為何。有了這些先備知識後我才能夠開始規劃並進行 migration 的任務。

### 身為一個前端小白，我是如何規劃並執行 migration 的？

由於 Nuxt2 到 Nuxt3 包含眾多 breaking changes（官方的 migration guide 將要做的準備分成十類，其中一類的其中一個任務是「升級 Vue2 到 Vue3」這當中又包含了無數個 breaking changes 要注意。身為一個前端小白，100% 不懂這些 breaking changes 背後代表什麼意義，有句話說得好：「當你的才華撐不起野心時，你就應該靜下心來學習」

小白該做的第一件事就是去學習，我將 migration 大致分成三個階段：Study / Follow migration guides / Fix Bugs，不過這三個階段並不互斥，在 migration 的過程中經常交錯進行。

#### 1\. Study

我在我的同事 William 身上學到腳踏實地才是最快的道路。因此我首先一步一步建立自己對前端知識的理解，在了解前端生態系之後，我才有能力去識別接下來技術遷移時遇到的問題本質是什麼、可能可以朝什麼方向尋找解決方案。

接著，問題回到了：前端的世界博大精深，我在 Study 階段要怎麼決定該了解什麼樣的知識呢？ 我認為軟體工程的知識學海無涯，要鑽研下去的話會沒有結束一天，要完全準備好再去進行 migration 是一件不切實際的事。所以我在大致理解各工具之間的定位以及依賴關係後就先推進到下個階段了。

#### 2\. Follow migration guides

在剛開始 migration 的時候很容易迷失方向，因為整個專案在升級之後會有非常多的 breaking changes 需要專案配合新寫法，導致專案根本無法跑起來、也無從得知是否自己的修改對專案有用。這時候我們就需要追隨 migration guide 的明燈，一步步修復專案了。

由於包含 Vue2 to Vue3 在內的 Nuxt 升級工項影響範圍實在廣泛，因此大多數受到影響的套件都有備妥 migration guide（以這次要遷移的專案來說至少有六本 migration guide 需要盤查）除此之外，在前面的階段我已經盤點好要做哪些套件的升級，以及套件升級的先後順序，所以在 migration 的前期規劃上，我主要是參考各大 migration guide 所建議的事項來開出要做的 ticket。



![參考完 migration guide 所列出的工項大概會長這樣](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252Fa7131bcf-a4e0-4bbf-8f3b-494f37dfdfbb%252FScreenshot_2024-08-28_at_15.57.53.png%3Ftable%3Dblock%26id%3D437fbae4-c38b-45c1-ab58-ffb7fe9d3584%26cache%3Dv2&w=3840&q=75)

參考完 migration guide 所列出的工項大概會長這樣

在 ticket 的歸類上我參考了開源社群常用的幾個分類：EPIC, Subtask, Bug, Improvement。在每個重大的 EPIC 項目下都會有數個 Subtask，而每個 Subtask 底下都會有數個待辦事項。例如 Nuxt migration 本身會包含 Config 類等等的 Subtask 需要去處理，而 Config 類底下還會有 Vuex / Vue 之類顆粒度更小的工作需要去處理。

在這邊需要注意一件事情：由於 migration guide 本身的目標讀者是廣大的開發者社群，因此文件本身會寫得又廣又細。根據專案，有時候其實不一定每個 TODO 都會需要去解決，小白們可以不用被這個工作量嚇到！因此在 Follow migration guides 這個階段，我只會先依據 migration guides 開出 EPIC 跟 Subtask，最細節的 TODO 會於進行到對應的 Subtask 再來比對專案以及 breaking changes，也許我們的專案沒有被該 breaking change 影響到，就不需要特別列該 TODO 在 Issue 裡面。

因為官方列出的 breaking changes 實在多到數不清，我當時的做法是將心力集中在影響力最大最廣的 Nuxt Migration Guide，根據官方所提出的十大分類，一步步開出相對應的 Subtask，每當我完成一樣 TODO，跑專案時的錯誤訊息都會有所變化，這時候就開始進行三個階段的交錯混雜期了。

#### 3\. Fix Bugs

我的 migration 節奏是這樣的：最開始是照著 Nuxt Migration Guide 按表操課、一步步遷移，但在 Nuxt Migration Guide 的指引之下，可以提供的幫助依然是有限的。因為今天壞掉的、需要被修改的更動不限於在 Nuxt 的範疇，因此我會需要針對錯誤訊息快速定位出問題並加以解決。在面對問題時我會先問自己下面幾個問題：

1. 該問題的發生範圍在哪段程式碼？

2. 該問題與什麼工具有關？相關文件如何敘述該處用法？

3. 該問題是否牽涉到前端狀態管理？管理的相關程式碼上下游在哪？

4. 該問題與什麼功能有關？是否有其他區域具有一樣問題？

5. 最後一定要參考 ChatGPT 的意見，加速瞭解問題所在

透過釐清這些問題，可以在最短的時間內鎖定需要參考的 migration guide / document 以及程式碼受到損害的範圍，這樣在修改程式碼上才有方向。

讓我們以下列錯誤訊息為例，首先我會去盤查 `ProjectPresenter.formatDisplayData` ，接著可能會發現原來變數的生命週期出了問題，本應是 `id` 的值居然收到 `undefined`。如果是要盤查資料流的狀況，我會多使用中斷點加上 IDE 的除錯功能。經過上述盤查後會找到原來是 Vuex 的部分出錯了，再經過查閱文件、反覆比對後會發現有微妙的地方需要進行修改。

```
TypeError: Cannot destructure property 'id' of 'undefined' as it is undefined.
    at new ProjectView (ProjectPresenter.js:174:5)
    at ProjectPresenter.js:95:34
    at Array.map (<anonymous>)
    at ProjectPresenter.formatDisplayData (ProjectPresenter.js:95:23)
    at Proxy.project ([id].vue:84:30)
    at ReactiveEffect.fn (reactivity.esm-bundler.js?v=7dcd1077:957:13)
    at ReactiveEffect.run (reactivity.esm-bundler.js?v=7dcd1077:150:19)
    at get value (reactivity.esm-bundler.js?v=7dcd1077:969:102)
    at Object.get [as project] (runtime-core.esm-bundler.js?v=7dcd1077:2642:22)
    at [id].vue:13:30
```

在深入瞭解問題的過程中，我經常發現自己缺乏某方面的知識：比如 Vuex 做狀態管理的原理以及使用方法，這時候就需要回到第一階段：Study。比起使用 ChatGPT 快速得到問題的可能解方，其實先去看該工具的 Quick Start 教學了解工具用法，會比起盲餵問題、error log 進去還要快解決問題。因為在累積知識後，處理類似的問題速度會越來越快。

總之，在修好一個 bug 之後可能就可以回去繼續照著 Nuxt Migration Guide 繼續遷移，或是遇到下一個 bug，於是在 Study / Follow migration guides / Fix Bugs 之間互相切換，大概在耐心的這樣輪替數百回後就可以成功了。

#### 結語：那些殺不死我的使我更強大

雖然前端能力增強並不存在於我的 Career Goal 的任一向量內，但我在這過程中得到不少收穫：

首先是**問題拆解與規劃能力**：我在面對未知領域時，不停嘗試將問題拆解成可管理的子工作，並進行系統性的規劃。

再來是**學習新技術的能力**：身為一個幾乎零基礎的前端小白，從零開始學習 Vue、Nuxt 及相關工具，並應用這些知識進行技術遷移，整個過程不容易，但我也因此學到了不少。

還有**文件撰寫能力**：由於在遷移的當下時常感到自己的不足，我會將 Issue 的前後文、潛在解決方向、後續的決策以及原因都詳細記錄，幻想哪天若突然有人力可以來幫忙的話，對方可以在最短的時間內加入貢獻的行列。雖然最後我還是自己解決了，但我認為寫了好文件可以幫到的不只是別人，更是未來的自己，可以快速回憶起當時做出的決策原因、以及後續如何處理。

最後是**增強問問題的能力**：一個人能做的事終究有限，在很多時候工程師是需要互相幫助的，在這次的遷移過程中，若是希望可以加速解決複雜問題的話，就必須用簡單易懂、有效率的方式使他人明白我受困的問題點，這樣其他人才能夠快速進入狀況、協助解決問題。

#### 致謝

Min, Steve, Ryan, YU: 在我對於前端知識無能為力時你們幫了我好多的忙，沒有你們的話我這個前端小白應該會做 Nuxt migration 做到畢業。

Jason Yang: 感謝大大提供 Migration 建議，十分受用。

Robert Yen: 謝謝給我這份任務，讓我跨出了舒適圈。



Source: <https://www.backend-b.com/how-nuxt-idiot-migrate-from-nuxt2-to-nuxt3>