# Introduction to JSON Web Token

## **猴子也能懂的 JWT，不懂有點可惜了**

（圖片若無法載入請重新整理幾次看看）

## 分享架構

[猴子也能懂的 JWT，不懂有點可惜了](#45e346644d814e368f89b18851600e1a)[分享架構](#9742fc278f6e407fa2656e8c4044cd0e)[API 是什麼？怎麼運作的？](#9da4e5478bdb44f7b3bf47c75c1d9034)[系統要怎麼辨識使用者是誰？](#1e2b7393896a44f1988cbd76fec59473)[ 這就是為什麼要有 Token 的存在](#4b825032c4b346c79e7a38e6ee402762)[JSON Web Token 是什麼？怎麼組成的？](#1aafa1390a2b4127ac1f87c8fe776df4)[JWT 這個酷 Token 應該要放在哪裡？](#abb30b1dbe0a41258c2e38e38a283062)[延伸閱讀](#7ba31b7892ed4f1097531649dd48435c)

### API 是什麼？怎麼運作的？



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F4468ae0e-2fc2-45c0-8c9a-6a269b52dbe1%252F%25E6%2588%25AA%25E5%259C%2596_2022-07-13_09.31.10.png%3Ftable%3Dblock%26id%3Dd7cfb3cc-327c-402f-8c69-2d12658baabf%26cache%3Dv2&w=1920&q=75)

API 的全名是 Application Programming Interface，聽完了還是不懂？

只要注意一個關鍵字：Interface → 連接程式與程式的介面

很像是你在使用電腦時會有一個一個插孔：

- 你必須符合一定的規範才能連接

- 這個連接可以讓兩個載體（兩隻程式）互相溝通

所以透過 API 就可以讓 user 端的瀏覽器跟你的伺服器溝通（新增、修改、刪除、查詢資料）

在這邊的例子就是：

💡

browser 要透過一定的規範（菜單不能畫歪）才能讓老闆聽懂客人要點什麼 也才能回傳客人點的菜

### 系統要怎麼辨識使用者是誰？



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F41dbd1fa-e95e-4158-b6a7-b0b200fb3212%252F%25E6%2588%25AA%25E5%259C%2596_2022-07-13_09.24.49.png%3Ftable%3Dblock%26id%3De5e41867-9e03-4e9c-a150-cb0ac0ef5722%26cache%3Dv2&w=2048&q=75)

但問題就來了，每碗滷肉飯都應該要回傳給特定的客人

系統要怎麼辨識哪碗滷肉飯要給誰啊？

### 這就是為什麼要有 Token 的存在



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F0e675bf8-e2b8-436f-98a9-1357227b330e%252F%25E6%2588%25AA%25E5%259C%2596_2022-07-13_09.32.22.png%3Ftable%3Dblock%26id%3Db3ec28dc-d227-4b74-b80e-df2fc895d59c%26cache%3Dv2&w=2048&q=75)

當使用者登入帳號密碼之後，系統就會核發一個 token 給使用者

這樣當他要執行一些需要**確認身份才能做**的動作時

不用再登入一次，系統也可以認得使用者是誰

### JSON Web Token 是什麼？怎麼組成的？



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fee055dc3-8d64-42ab-8b4c-5bb7554d611c%252F%25E6%2588%25AA%25E5%259C%2596_2022-07-13_14.06.13.png%3Ftable%3Dblock%26id%3D6e3fcdc3-411c-4e7b-a485-fa898d9d8ee9%26cache%3Dv2&w=1080&q=75)



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F1de99a8b-ad34-4f88-9d7b-b95f6325a1ab%252F%25E6%2588%25AA%25E5%259C%2596_2022-07-13_14.14.59.png%3Ftable%3Dblock%26id%3Dc2eda3eb-ac31-47de-99b2-be62707f046f%26cache%3Dv2&w=1080&q=75)

JWT 可以拆分成三個零件，他們分別用兩個 `.` 去做分隔（見上圖）

- Header → 存放 token 加密的方式

```
{
  "alg": "HS256", // 預設加密方式是 HS256
  "typ": "JWT" // token 型別 （其實就是 JWT 根本廢話哈哈）
}
```

- Payload → JWT 所攜帶的 data

```
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
	"exp" : 9999999999 // timestamp，設定 token 何時過期

}
```

- Signature → 加密過的 Payload, Header，用來**檢查 token 是否被篡改過！**

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F51e52419-c59c-413c-aaa2-543e29ef069b%252F%25E6%2588%25AA%25E5%259C%2596_2022-07-13_14.32.22.png%3Ftable%3Dblock%26id%3Dfca4cd11-871c-4352-8d8a-cf003c99485d%26cache%3Dv2&w=1920&q=75)

有 JWT 真的蠻方便的，在 handle 用戶登入、做一些需要購買權限的問題可以很輕鬆地去解決

### JWT 這個酷 Token 應該要放在哪裡？

通常一狗票人（包含之前我）都會把 token 存放在 `localStorage` 裏面

但 localStorage 的存取權限太容易拿到了

💡

有心人士或第三方串接服務隨便一個放一個 script 在你的頁面就可以把 token 給偷走 !!

那應該怎麼辦呢？到底應該放在哪裡？

你應該放在 `httpOnly cookie`

### 延伸閱讀

- 好像常常聽到 Cookie, Session，這些又是什麼？

- Cookie, Session, JWT 比較



Source: <https://www.backend-b.com/introduction-to-json-web-token>