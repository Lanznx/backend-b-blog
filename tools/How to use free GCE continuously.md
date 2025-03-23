# How to use free GCE continuously



![How to use free GCE continuously](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252F3e9fb6e0-db30-496e-95ce-e3ab6f5b4f48%252FGoogle_Compute_Engine-Logo.wine.png%3Ftable%3Dblock%26id%3D5ccc09de-5595-4839-af8c-668886caa972%26cache%3Dv2&w=3840&q=75)

免費 GCE 接力給另一個帳戶，不用再重新設定 VM 了！

## **免費 GCE 接力給另一個帳戶，不用再重新設定 VM 了！**

**（圖片若無法載入請重新整理幾次看看）**

Google Cloud Platform 提供每個用戶三個月三百美金的免費額度 筆者本身是一位窮學生，所以只好靠建立一個又一個的新帳戶來使用免費 Google Cloud Engine 但每建立一個新的 VM，上面的所有工具、設定都需要重新來過一遍，即使把所有指令都打在 notion 上，複製貼上就可以完成設定，但整體時間還是非常冗長，所以想說做今天這個紀錄，以後忘記可以回來看一下

============ 以下正文 ============

在開始轉移之前，你要完成兩件事

1. 打開 AMI，新增你要分享的帳戶

2. 先把你的 VM 給關掉，這樣才能建立 image

完成之後你只需要把另一個帳戶加入 AMI 就可以共享映像檔囉！



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F79fb557c-1918-41cf-8cc6-9671047f0194%252F%2525E6%252588%2525AA%2525E5%25259C%252596_2022-08-08_01.43.23.png%3Ftable%3Dblock%26id%3Dca49b116-16a1-45d4-91cb-3b13829d312a%26cache%3Dv2&w=3840&q=75)

再來建立你的 image



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F39304df9-998d-455c-9af6-5e9fae5fbe44%252F%2525E6%252588%2525AA%2525E5%25259C%252596_2022-08-08_01.45.21.png%3Ftable%3Dblock%26id%3D8d581d0b-2af1-4e49-903d-e97bed9198a8%26cache%3Dv2&w=3840&q=75)

接著在映像檔可以透過「篩選」找到你的映像檔



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Faa731365-b837-441b-ac00-cfd26f3d1a66%252F%2525E6%252588%2525AA%2525E5%25259C%252596_2022-08-29_20.01.33.png%3Ftable%3Dblock%26id%3D8bebe320-c7e8-40c3-a33f-8b1fc948526c%26cache%3Dv2&w=3840&q=75)

做好映像檔之後就可以開始共享這個專案給另一個帳戶囉

開啟「IAM 與管理」並點選「新增」



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F070af744-7f44-44ee-847b-c35ad2f8f57f%252F%2525E6%252588%2525AA%2525E5%25259C%252596_2022-08-29_20.05.26.png%3Ftable%3Dblock%26id%3Ddff12083-45b2-48cf-8a9a-d9e98186745c%26cache%3Dv2&w=3840&q=75)

再來填入你的電子郵件、選取角色

就可以成功共享ㄌ！



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F753bd041-1117-46e4-b1bc-0edb765664b3%252F%2525E6%252588%2525AA%2525E5%25259C%252596_2022-08-29_20.06.01.png%3Ftable%3Dblock%26id%3D028b0040-7e5e-4b31-94ae-33df66eb0db3%26cache%3Dv2&w=3840&q=75)

接下來去你的Ｂ帳戶，暗下「來源」並把選項換成「映像檔」



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Ff14e00da-eab8-4891-b5f5-6415d8fb2fd0%252F%2525E6%252588%2525AA%2525E5%25259C%252596_2022-08-29_21.02.37.png%3Ftable%3Dblock%26id%3Dcf794c9d-8263-4913-a3ba-72bf68b79f06%26cache%3Dv2&w=3840&q=75)

這樣就可以用之前的映像檔（image）無痛建立囉！



Source: <https://www.backend-b.com/how-to-use-free-gce-continuously>