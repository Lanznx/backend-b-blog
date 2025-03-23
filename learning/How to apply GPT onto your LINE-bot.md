# How to apply GPT onto your LINE-bot

## 串接 GPT-3 機器人教學

（圖片若無法載入請重新整理幾次看看）

#### 前言

今天要實作的語言是 Python 版，若希望使用 Node.js 或 C# 可以左轉其他大神的：

基本上串 ChatGPT 很簡單，尤其是 python 已經有套件的狀況下

都是看一下官方文件就可以串起來的簡單步驟

讀者們如果有 Docker 的基礎，應該二十分鐘內就可以串好並部署了！

#### 第一步：到 openAI 網站申請 `API key`

切記，這個 api key 不可以推上來 github 喔，可能會不明人士盜用！



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fec8c3410-9e3e-4e13-9e23-02c7f37f4fb8%252F%2525E6%252588%2525AA%2525E5%25259C%252596_2022-12-11_20.46.55.png%3Ftable%3Dblock%26id%3Db2a22191-29a5-4258-b02f-248f2c9685e8%26cache%3Dv2&w=1920&q=75)

#### 第二步：使用 .env 來設定環境變數

我在 repo 中有放置 `.env.sample` ，大家可以根據自己的環境設置不一樣的變數

```
DJANGO_SECRET_KEY=secret
DATABASE_URL=sqlite://YOUR_PASSWORD/db.sqlite3
EMAIL_URL=smtp://user:YOUR_PASSWORD@localhost:25
LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=
CHAT_GPT_TOKEN=
```

這邊要注意的是，你的 `.env` 應該要放置於跟 [`manage.py`](http://manage.py/) 相同的路徑底下

這樣我在專案設定的路徑 `ENV_PATH = ".env"`才吃的到環境變數喔！

再來是 google 金鑰憑證的部分，這個金鑰是我朋友的陳年老金鑰，我想說方便才拿它來串 ChatGPT

我已經盡量把需要的地方拆出來了，但礙於申請這個 google API 金鑰可能會有點麻煩

而目前感覺起來應該也不太會有爆流量的問題，所以就先暫時暴露在 github 上給大家方便吧！

如果想要把金鑰替換成自己的，可以參考以下文章申請！

#### 第三步：根據官方文件，你可以選擇使用 HTTP request 或者 python 套件

但這邊我跟官方文件使用的引入方式不太一樣，是使用 python-dotenv 這個套件

但功能基本上大同小異，讀者可以自行斟酌



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F751f7dc1-7c59-4f8f-9a95-1bca07fea73c%252F%2525E6%252588%2525AA%2525E5%25259C%252596_2022-12-11_20.34.30.png%3Ftable%3Dblock%26id%3D8d9a1d3a-5a8e-46b7-90b9-2d072127763a%26cache%3Dv2&w=3840&q=75)

基本上我都寫好了，所以只要環境變數有塞進去 .env 應該就可以跑起來了

#### 第四步：核心程式碼解說（可略過）

/healthlinebot/view.py 的連結：



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F58c97d4b-e894-44b1-9faf-c4e2dc9d902d%252F%2525E6%252588%2525AA%2525E5%25259C%252596_2022-12-11_20.48.56.png%3Ftable%3Dblock%26id%3D5f1a38be-2384-4cbf-983d-8c4d3d74f778%26cache%3Dv2&w=3840&q=75)

我在第十三行引入 `openai` 的官方套件，並且完成 .env 的載入

這個套件很明顯還在實驗階段，版本只出到 0.25.0

下面是官方連結，有興趣可以看看：



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F05696714-ba50-4e1f-b05b-86a0a25d9739%252F%2525E6%252588%2525AA%2525E5%25259C%252596_2022-12-11_20.49.08.png%3Ftable%3Dblock%26id%3D90b27211-0bb7-4945-ac87-9ed903b50803%26cache%3Dv2&w=3840&q=75)

接下來就是整個程式碼最核心的部分了！！

我定義了 `chatGPT` 這個函式，`text` 是使用者回覆的訊息

然後我呼叫了 `openai.Completion.create` 這個函式

必填的參數只有一個，就是一定要指定 model

而我所使用的語言模型是 `text-davinci-003` ，跟大家一般在網頁版所看到的並不一樣

但這部分我沒有多做研究，可能網頁版的模型已經釋出 API 讓大家玩了？

歡迎大家可以研究一下並讓我知道喔！

總之我覺得目前這個已經很厲害了

來簡單解釋一下我現在填進去的參數

1. model: 這個就不解釋了，可以在這裡查看所有的語言模型種類

   1. <https://beta.openai.com/docs/api-reference/models/list>

   

   ![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fprod-files-secure.s3.us-west-2.amazonaws.com%252F0786106d-95fd-4999-b526-8595056ea48c%252Fe976b66d-6df3-4d6d-9eec-a14f77596c94%252FOpenAILogo.png%3Ftable%3Dblock%26id%3Dccb46a5f-e070-4b13-bccd-c000f70cd6c4%26cache%3Dv2&w=1920&q=75)

2. prompt：使用者輸入的訊息，給模型的 input

3. max_tokens：模型回覆的長度

   1. 大部分的模型可以支援到 2048 個 token，就是回覆很長很多的意思！

   2. 詳細定義可以看這裡：<https://beta.openai.com/tokenizer>

4. temperature：溫度，我把它解讀為人性的「溫度」

   1. 這個參數應該是介於 0 \~ 1 之間，預設為 1

   2. 設成 0 的話模型給出的回覆會很無聊，1 的話會很更 creative，我自己是設定中庸的 0.8



![notion image](https://www.backend-b.com/_next/image?url=https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F376448e2-93a1-4227-b3d2-bd1d63a409b9%252F%2525E6%252588%2525AA%2525E5%25259C%252596_2022-12-11_21.07.43.png%3Ftable%3Dblock%26id%3D1445c17c-1223-4a61-be53-705ecb5eee67%26cache%3Dv2&w=3840&q=75)

最後最後，只要使用者不是輸入我們指定的字，我們就可以透過呼叫剛剛定義好的 `chatGPT` 這個函式來用 text-davinci-003 模型來回覆使用者囉！

#### 第五步：部署

我使用了 docker 去做打包，所以部署起來特別的方便

如果你是沒有用過 docker 的讀者，可以參考這篇教學學習一下

也可以用官方的連結快速安裝

最後我是開放 8000 port，如果希望使用別的 port 來開通服務的話可以去改

`docker-compose.yaml` 當中的 `8000:8000` 把左邊的八千改成你想要的 port

```
version: '3.8'

services:
  server:
    container_name: bot
    build:
      context: .
    ports:
      - 8000:8000 // 改左邊的 8000，他代表 host_port，右邊是 container_port 不用動
    restart: always
```

Ngrok 的教學可以參考這篇

架設 Linebot 的教學可以參考這篇

### !!! 注意 !!!

感謝你的注意

Line Webhook URL 的路徑我是設定 **`/healthlinebot/callback`**

Line Webhook URL 的路徑我是設定 **`/healthlinebot/callback`**

Line Webhook URL 的路徑我是設定 **`/healthlinebot/callback`**

很重要，所以我要講三遍，這是一個很容易踩雷的部分

最後輸入 `docker compose up -d` 以及 `Ngrok 8000`

就可以部署囉！

進階：圖文選單設定

我在底下有放我當初設定這個圖文選單的 postman 設定

可以透過 import 進來，然後把參數改成自己的

教學的話可以參考這篇！

恭喜大家！終於完成了一個附加功能有點多的 OpenAI 聊天機器人

還偷渡了一些 docker 進來

如果成功的話歡迎讓我知道你完成了！

也很歡迎點個星星或 fork 過去改寫喔！

教學的話可以參考[這篇](https://ithelp.ithome.com.tw/articles/10294287)



Source: <https://www.backend-b.com/how-to-apply-gpt-onto-your-line-bot>