# 01 JavaScript is more than single-threaded



![01 JavaScript is more than single-threaded](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252Fe3e375b8-8cfe-4e3a-ad83-69f32b733a80%252Fjavascript.webp%3Ftable%3Dblock%26id%3Dbe5aab1e-ecb8-44ac-94ca-990c200920c0%26cache%3Dv2&w=640&q=75)

平常沒什麼機會特別寫多執行緒的程式，而 Thread 的創建成本相對低廉，如果我們在適合平行執行的任務中使用多個 thread，並且硬體也支援的話，那會對於效能的提升產生顯著的影響力！

[全書終極目標](#44f687611fee40d983e1791bd7efc419)[Prerequisite: Cost，為什麼 Thread 比較便宜？](#8ae88399074a44c28da7effea665f82e)[Concurrency vs Parallel](#f4d860de0dce435a8ac5201fb4affcef)[Multithreaded、Parallel 一定永遠比較好嗎？](#636e129fc2834bf7a076bda662924534)[JavaScript 到底是 single-threaded 還是 multi-threaded ?](#9bd63cd5d0bb4f2a909dbfd4095b0da5)[Realm？為什麼會提到他？](#69422d9f66934ddc91de9bccd2328cc1)[實作：1 thread vs 4 threads](#96cb7e4016104e35938dabfb53a4c7cb)[小結：可以多認識一下 Thread](#034c25feea904534b8e5f4d904e1dcda)

## 全書終極目標

- JavaScript Multithreading programming

- Understanding of web worker API , pros and cons, and when to use

   - message passing

   - shared memory

## Prerequisite: Cost，**為什麼 Thread 比較便宜？**

- Creation Cost && Context Switch Cost：

   - 相較 process，Thread 需要創建的項目少

   - Context Switch 需要暫存的東西也少

   - 甚至不用做 Interprocess-communication (IPC)

   - 題外話：Event loop 帶來的好處是直接避免掉 Context Switch

   

   ![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252F888cdb55-881a-48fd-923e-707b8719e672%252FScreenshot_2024-01-17_at_3.41.33_PM.png%3Ftable%3Dblock%26id%3D297a2921-ce67-4113-bc4e-29d4a94674e4%26cache%3Dv2&w=1920&q=75)

- Share

   - Code

   - `Shared Memory` (heap) (static/global variables)

   - OS resources (e.g. open files and signals)

- Not share

   - `PC` program counter -> thread 各自 instruction 執行到的位置

   - `register` set -> context switch 的時候暫存 instruction 用到的資料

   - stack

   - TLS (Thread Local Storage)

   - thread ID

- **一些有趣的延伸主題**

   - 既然 Thread 共享記憶體，要怎麼避免 Race Condition？

   - Goroutine 是什麼、為什麼要用、有什麼優缺點、應用在哪

   - Coroutine 是什麼、為什麼要用、有什麼優缺點、應用在哪

## Concurrency vs Parallel



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252F62717357-974c-4bb2-9114-45b6f36cef3a%252FScreenshot_2024-01-17_at_3.42.42_PM.png%3Ftable%3Dblock%26id%3D3b00d519-2488-4eb6-a011-3dc1d0d9db6a%26cache%3Dv2&w=1920&q=75)

### **Multithreaded、Parallel 一定永遠比較好嗎？**

- 取決於硬體，假設 CPU core 比 user thread 少的話，會有 context switch 的成本

- 除此之外也要考量到 synchronization 的成本

   - 1\. 鎖（Locks）的使用和競爭

      - **例子**：假設有一個共享的資料結構，如一個列表，多個線程需要對其進行讀寫操作。為了避免資料競爭（data race），我們通常會使用鎖來同步對共享資料的訪問。

      - **成本**：當多個線程嘗試同時獲取鎖時，只有一個線程可以持有鎖，其他線程則被阻塞，直到鎖被釋放。這個等待過程會造成性能的顯著下降，尤其是在鎖競爭激烈的情況下。

   - 2\. 死鎖（Deadlock）

      - **例子**：兩個或多個線程相互等待對方釋放資源，從而陷入永久的等待狀態。例如，線程 A 持有資源 1 並等待資源 2，同時線程 B 持有資源 2 並等待資源 1。

      - **成本**：死鎖導致系統效能完全喪失，因為涉及的線程都不能繼續執行。解決死鎖通常需要複雜的策略和額外的編程工作。

- 還要考慮到問題的可分割性。並行和多線程特別適合於可以被分割成獨立或半獨立子任務的問題

- 程式碼複雜度也須考慮進來

### JavaScript 到底是 single-threaded 還是 multi-threaded ?

- JavaScript 原生沒有 thread 相關模組可以呼叫 --> 不能呼叫出第二條 thread

   - JavaScript 是基於單線程模型的語言

   - JavaScript 在其主要的 runtime 中運行在單一的 thread 中。所以 JavaScript 程序一次只能執行一個任務。這種設計可以簡化 event oriented programming，減少與多線程相關的複雜性，如 race condition / synchronization 問題

- Web Workers 提供了類似 multi-threaded 的功能

   - Web Workers 是瀏覽器實現的，不是 JavaScript 原生的東西。雖然 JavaScript 的 main thread 是 single-threaded 的，但現代的瀏覽器環境提供了 Web Workers API，使得在背景線程中執行JavaScript代碼成為可能。

   - 這些 Web Workers 運行在與主執行線程分離的自己的全局上下文中，允許執行耗時任務而不阻塞 UI。

- 類似於 Thread 但有差異

   - Web Workers 運行在自己的 context，無法直接訪問 DOM 或其他一些瀏覽器特定的 API。

   - 它們與主線程之間的通信基於 message-passing，意味著數據是通過 copy 而不是 share 來傳遞。

- 使用場景

   - Web Workers 適用於那些需要長時間計算而不希望影響用戶界面響應性的任務。例如，處理大量數據、執行複雜算法或加載大型資源等。

### Realm？為什麼會提到他？

- a realm as basically `an ecosystem` in which a JavaScript program lives, **it provides different elements** that JavaScript programs must have in order to exist within it.

- Realm 的中文叫做「領域」，提供了以下三樣元素，讓 JavaScript 可以活在裡面

   - **global executing environment**：類似 window / web worker / frame / node.js 各自程式執行的 scope 都不會互相影響彼此

   - **global object**：不同的 "領域" 底下會有各自隸屬於彼此的 global object，互不干涉

      - 可以用 `instanceof` 檢查看看，把在領域Ａ創建的 Array aaa 拿去領域Ｂ檢查，會因為創建的 constructor 所在的領域不一樣，導致 `isinstanceof` 檢查結果為否

   - JavaScript **本人**：像是居民的概念

- 但如果今天希望跨 realm 交流，可以透過像是 message-passing 的方式傳遞 object

   - `window.postMessage` -> 但原理不是 call by value 或 call by reference，這個需要委託大家好奇的話查一下，搞不好後面章節會提到也不一定

- 參考

   - [How to understand JS realms](https://stackoverflow.com/questions/49832187/how-to-understand-js-realms)

   - [What is a realm in JavaScript?](https://weizmangal.com/2022/10/28/what-is-a-realm-in-js/#1-a-global-execution-environment)

   - [延伸：Realm 可以用來繞過資安防護？](https://twitter.com/WeizmanGal/status/1576942106156810240)

## 實作：1 thread vs 4 threads

- [範例 code](https://github.com/MultithreadedJSBook/code-samples/tree/main/ch1-c-threads)

   - 實務演練一下

- 我們可以說程式執行時間縮短四倍嗎？

   - 不行！考量進 thread 初始化成本、列印在 terminal 的 IO 時間，就不會是完整的四倍速

   - Multithread 應用場景：適合可拆分平行工作的任務

   - Multithread 缺點：需要處理 synchronization 問題

## 小結：可以多認識一下 Thread

平常沒什麼機會特別寫多執行緒的程式，而 Thread 的創建成本相對低廉，如果我們在適合平行執行的任務中使用多個 thread，並且硬體也支援的話，那會對於效能的提升產生顯著的影響力！



Source: <https://www.backend-b.com/01-javascript-is-more-than-single-threaded>