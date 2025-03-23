# Cloudflare Email Routing & Gmail

## 使用 Cloudflare 設定 Email Routing 與 Gmail 寄件別名

### 前言

2025 年開始，我希望可以重新認真經營 [backend-b](https://ig.backend-b.com/) 這個地方。在個人品牌或技術部落格的經營中，擁有自訂網域的信箱能夠擁有一個正式的門面，並讓外界更容易聯繫你。

因此本篇文章將詳細介紹如何使用 **Cloudflare Email Routing** 來轉信，並在 **Gmail** 設定寄件別名，使你的回信也能顯示為自訂信箱。

---

### **Cloudflare Email Routing 設定**

Cloudflare Email Routing 提供了一個免費且簡單的方式，讓你可以使用自己的網域來接收郵件，並將郵件轉寄至 Gmail 或其他個人信箱。

#### **步驟 1：開啟 Cloudflare Email Routing**

1. 登入 Cloudflare（https://dash.cloudflare.com）。

2. 選擇你的網域。

   ![notion image](https://www.notion.so/image/attachment%3Adfd53da4-0440-43f8-847b-0422b0f3de0c%3A%25E6%2588%25AA%25E5%259C%2596_2025-03-23_16.00.08.png%3FspaceId%3D0786106d-95fd-4999-b526-8595056ea48c?table=block&id=1bf61fa7-980f-806f-80ff-ca98f642b626&cache=v2)

3. 在側邊選單點擊 **「Email」** 或 **「Email Routing」**。

![notion image](https://www.notion.so/image/attachment%3A4023a272-da95-45d8-a59c-4cd796bbad2f%3Aimage.png%3FspaceId%3D0786106d-95fd-4999-b526-8595056ea48c?table=block&id=1bf61fa7-980f-80be-8dfc-ccca2c77b427&cache=v2)

1. 點擊 **「Get Started」**。

   ![notion image](https://www.notion.so/image/attachment%3A6f6d5ea8-1c7b-46b6-a85b-d056e2e0d76d%3A%25E6%2588%25AA%25E5%259C%2596_2025-03-23_16.03.44.png%3FspaceId%3D0786106d-95fd-4999-b526-8595056ea48c?table=block&id=1bf61fa7-980f-802b-8bdc-ec4efefba417&cache=v2)

#### **步驟 2：新增 Email 地址**

1. 在「Email Routing」頁面點擊 **「Create Address」**。

   ![notion image](https://www.notion.so/image/attachment%3A17dba096-e818-4c88-b512-d3bcb20e5e2b%3A%25E6%2588%25AA%25E5%259C%2596_2025-03-23_16.04.13.png%3FspaceId%3D0786106d-95fd-4999-b526-8595056ea48c?table=block&id=1bf61fa7-980f-8064-9bb0-e04ebe8956b6&cache=v2)

2. 設定轉寄地址，如下：

   - `contact@yourdomain.com` → 轉寄至你的 Gmail 信箱

   - `b@yourdomain.com` → 轉寄至你的 Gmail 信箱

3. 點擊 **「Add」**。

#### **步驟 3：設定 Cloudflare DNS 記錄**

Cloudflare 會自動生成以下 DNS 記錄，你只需確認這些設定已啟用：

| 類型 | 名稱 | 內容 | 優先順序 | 
|---|---|---|---|
| MX | @ | `route1.mx.cloudflare.net` | 10 | 
| MX | @ | `route2.mx.cloudflare.net` | 20 | 
| MX | @ | `route3.mx.cloudflare.net` | 30 | 
| TXT | @ | `v=spf1 include:_spf.mx.cloudflare.net ~all` | \- | 

如果這些 DNS 記錄尚未生效，請點擊 **「Apply DNS Changes」** 以套用。

#### **步驟 4：測試轉信功能**

1. 從任何信箱（如 Gmail、Outlook）寄信至 `contact@yourdomain.com`。

2. 確認該郵件是否成功轉寄到你的 Gmail 信箱。

---

### **設定 Gmail 寄件別名**

Cloudflare 目前僅提供「郵件轉寄」，**不支援 SMTP 發信**，不過還是可以在回信的時候顯示別的名稱，避免露餡。因此你需要透過 Gmail 來設定寄件別名，確保回信時顯示 `contact@yourdomain.com` 而不是你的 Gmail 地址。

#### **步驟 1：設定 Gmail 別名**

1. 打開 Gmail（[https://mail.google.com](https://mail.google.com/)）。

2. 點擊 **⚙️ 設定** > **「查看所有設定」**。

   ![notion image](https://www.notion.so/image/attachment%3A90f4fbd3-c5de-47c2-b53d-870e36d6a132%3A%25E6%2588%25AA%25E5%259C%2596_2025-03-23_16.15.59.png%3FspaceId%3D0786106d-95fd-4999-b526-8595056ea48c?table=block&id=1bf61fa7-980f-80fe-854f-e4b0347b6a4c&cache=v2)

3. 切換到 **「帳戶與匯入」** 分頁。

4. 找到 **「以其他地址寄信」**，點擊 **「新增其他電子郵件地址」**。

   ![notion image](https://www.notion.so/image/attachment%3A9f03ddc9-f487-477b-bede-33bb7e146d5f%3A%25E6%2588%25AA%25E5%259C%2596_2025-03-23_16.16.27.png%3FspaceId%3D0786106d-95fd-4999-b526-8595056ea48c?table=block&id=1bf61fa7-980f-803f-9bcf-f1549281968b&cache=v2)

5. 輸入：

   - **名稱：** 你的名稱

   - **電子郵件地址：** `contact@yourdomain.com`

   - ✅ 勾選「視為別名」

6. 點擊 **「下一步」**。

#### **步驟 2：選擇 SMTP 伺服器**

你有兩種方式來設定 SMTP 發信：

#### **方法 1：使用 Gmail SMTP（最簡單）**

| 設定 | 值 | 
|---|---|
| 使用者名稱 | 你的名字 | 
| 電子郵件地址 | 你負責寄信的帳號（非顯示帳號） | 

![notion image](https://www.notion.so/image/attachment%3A734fcc90-b3b7-400a-bc87-688b30ffe3cb%3A%25E6%2588%25AA%25E5%259C%2596_2025-03-23_16.17.45.png%3FspaceId%3D0786106d-95fd-4999-b526-8595056ea48c?table=block&id=1bf61fa7-980f-804c-bff3-e414769c6c54&cache=v2)

| 設定 | 值 | 
|---|---|
| SMTP 伺服器 | `smtp.gmail.com` | 
| 連接埠（Port） | `587` | 
| 使用者名稱 | **你的 Gmail 帳號** | 
| 密碼 | **應用程式密碼（見下方）** | 
| 安全連線 | `TLS` | 

![notion image](https://www.notion.so/image/attachment%3Af985aa18-dafd-439e-8650-255cef7be3f1%3A%25E6%2588%25AA%25E5%259C%2596_2025-03-23_16.33.52.png%3FspaceId%3D0786106d-95fd-4999-b526-8595056ea48c?table=block&id=1bf61fa7-980f-804f-8a62-d253ad75c643&cache=v2)

**重要提醒：Gmail 需要應用程式密碼**

- 進入 Google 應用程式密碼管理

- 產生 **16 碼應用程式密碼**

- 複製後填入 Gmail SMTP 設定

#### **方法 2：使用 Mailgun / SendGrid（更專業）**

如果不想用 Gmail SMTP，可以使用像 Mailgun、Postmark、SendGrid 這類服務來發信。但我懶，有興趣的話可以來研究一下

#### **步驟 3：驗證信箱**

Gmail 會發送驗證信到 `contact@yourdomain.com`（已設定轉寄到 Gmail），點擊驗證連結即可完成。

#### **步驟 4：測試回信**

1. 撰寫新郵件，點擊「寄件人」欄位。

2. 確保 `contact@yourdomain.com` 出現在選項中。

3. 送出郵件並確認收件人看到的寄件人是否正確。

---

### **結論**

透過 Cloudflare Email Routing，你可以輕鬆設定 **自訂網域的信箱轉寄**，並透過 Gmail **設定寄件別名** 來發送郵件。這樣，你的信箱看起來完全專業，不需要額外架設 mail server。

#### **完整流程回顧**

1. **Cloudflare Email Routing** 設定 **轉寄 `contact@yourdomain.com` → Gmail**。

2. **Cloudflare DNS** 設定 **MX 與 SPF 記錄**。

3. **Gmail 別名設定**，讓回信顯示 `contact@yourdomain.com`。

4. **使用 Gmail SMTP 或第三方 SMTP** 發送郵件。

5. **測試寄信與回信**，確認別名與郵件轉發功能正常運作。


Source: <https://www.backend-b.com/cloudflare-email-routing-gmail>

