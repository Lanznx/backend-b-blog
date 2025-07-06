# MiniMax Voice Cloning

聲音複製超酷的，如果可以複製出我的聲音的話，就只要寫好腳本，就可以錄好我的 IG Reels。所以最近在看聲音複製這一塊。

目前比較知名的就是 elevenlabs 跟 minimax，我兩個都有稍微用過

elevenlabs：買了應該三百塊左右的方案，丟了一小時我的聲音進去

minimax：我只用了免費版，丟了三十秒進去

我覺得效果是屌虐 elevenlabs 的模型，所以今天想來挖掘一下 minimax 的原理，但我時間有限＋沒啥 AI 底子，所以基本上是透過 ChatGPT 跟我一起來讀這篇論文: [MiniMax-Speech: Intrinsic Zero-Shot Text-to-Speech with a Learnable Speaker Encoder](https://arxiv.org/pdf/2505.07916)

這邊是我的 heptabase 筆記連結，有興趣也可以進去逛逛：[點此前往](https://app.heptabase.com/w/be7836298966b690ce047b07abf835685b78fa20b74a18665be149a0079ec5a6)

## MiniMax 強在哪？

#### **1\. 真零樣本（Intrinsic Zero-Shot）語音克隆**

- 不用語音的**轉錄**（不需聲音對應文字）就能複製聲音（Zero-shot）。

- 只要一小段任意語音就能合成同一個人用任何文字講話，不需要預先對這個人微調模型或蒐集大量語料。

- 給三十秒的聲音，就可以模仿得很像

#### **2\. 可訓練的 Speaker Encoder**

- 說話人編碼器（speaker encoder）和主模型一起端到端訓練，**不是用別人訓練好的說話人驗證模型當作黑盒子**。

- 這邊做得好，所以有詳細記錄我的聲音音色！

#### **3\. 創新的 Flow-VAE 架構**

- 結合 VAE（變分自編碼器）與 Flow model，提升語音特徵表達能力、音質和還原度。

- 讓模型生成的語音不僅自然，還能高度還原個人音色。

- 讓語音訊號本身細節和品質更高，有辦法呈現 Speaker Encoder 記錄下來的聲音細節。

### **這些亮點在哪些指標打敗了 SOTA？**

#### **1\. 客觀指標**

#### **（見論文 Table 1、Table 2、Table 3）**

- **Word Error Rate (WER)**

   **[什麼是 WER（Word Error Rate）?](https://www.backend-b.com/%E4%BB%80%E9%BA%BC%E6%98%AF-werword-error-rate)**

   → 語音合成後由語音辨識模型還原出的文字，錯誤率比 SOTA（如 Seed-TTS、CosyVoice2、ElevenLabs Multilingual v2 等）還低，甚至比部分“真實錄音”還低，顯示模型合成語音清晰度高、可辨識度強。

- **Speaker Similarity (SIM)**

   → 合成語音的說話人向量（speaker embedding）和原始說話人相似度也達到 SOTA 水準，在「只用一小段語音」的 zero-shot 條件下，和現有最佳模型持平甚至更高。

#### **2\. 主觀評測**

- 在公開 TTS Arena 人類聽感排名中（ELO 分數）

   - **MiniMax-Speech（榜上名為 Speech-02-HD）排名第一**，勝過 OpenAI、ElevenLabs、Google、微軟等知名模型。

   - 人類偏好 MiniMax-Speech 的自然度、表達力與音色還原度。

### **MiniMax-Speech 的 TTS** 生成流程

整個生成流程由三大核心組件構成：

1. **Speaker Encoder**（取得說話者音色）

2. **AR Transformer**（從文字、音色生成語音 token）

3. **Flow-VAE Decoder**（從語音 token 還原出聲音）

#### **① Speaker Encoder**

- **輸入**：你提供一段幾秒鐘的參考語音（不需要文字轉錄）

- **輸出**：一個 **固定長度的 speaker embedding（條件向量）**

這個向量捕捉了聲音的 **timbre（音色）**、prosody（說話風格）等與語意無關的特徵。

#### **學習方法**

在訓練時，它透過：

- 每次給定一小段語音當作 speaker reference

- 產出一個 embedding（向量）去代表這段音色

   - 算出音色、聲帶特質、講話慣性的資料

- 將這個 embedding 傳給下游的 AR

基本上就是學習你怎麼發出聲音（音色、風格、⋯⋯）

這邊做得好，所以有詳細記錄我的聲音音色！

#### **② Tokenizer（把文字編碼成 token）**

- 使用 **Byte Pair Encoding (BPE)** 將輸入文字拆成 token（像 GPT 一樣）

[BPE 是什麼?](https://www.backend-b.com/bpe-%E6%98%AF%E4%BB%80%E9%BA%BC)

例如：

```
"你好世界" → ["你", "好", "世", "界"] → [token1, token2, token3, token4]
```

這邊的文字 input 是你另外給的內容，目的在於讓訓練好的語音模型可以輸出你想講的內容。

#### **③ AR Transformer（自回歸模型）**

- **輸入**：

   - 條件序列

      [條件序列](https://www.backend-b.com/%E6%A2%9D%E4%BB%B6%E5%BA%8F%E5%88%97)

      - 文字 token

      - Speaker encoder 給出的 embedding

      - 這兩個作為 global input，每一輪都會丟進去

   - 上一輪的 audio token

- **輸出**

   - 一串 audio token（代表聲音）

這一步是核心生成過程，透過 **自回歸地產生語音 token**，也就是一個一個預測下一個語音單元。

### Auto Regressive 怎麼運作？

```
條件序列: [t1, t2, t3, t4] + z_speaker

初始          StartToken
                ↓
步驟1          y1
                ↓
步驟2        [y1]       ←（餵進去）
                ↓
步驟3       [y1, y2]
                ↓
步驟4       [y1, y2, y3]
      ⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯
                ↓
結束         [y1, y2, ..., yn, <EOS>] <- audio token
```

優勢：

- AR 每生一個 audio token，就可以根據前面已經生成的聲音（包含語速、情緒、語調等）和條件序列（文字、speaker embedding）去「調整接下來要怎麼說」。

- Attention 機制讓每個步驟可以看到所有的文字 token，以及之前所有已經生成的音訊 token，能學出「哪裡該停頓」、「這個字該拉長、重讀、提高聲調」。

   [Attention 複習](https://www.backend-b.com/attention-%E8%A4%87%E7%BF%92)

#### **④ Flow-VAE 解碼器（還原語音波形）**

AR Transformer 的輸出是一串 **離散 audio token**，並不是你可以直接播放的音訊。

所以還需要一個模型將這些 token「解碼」成聲音波形（.wav）：

- 使用 **Flow-VAE** 解碼器：

   - Flow：學習複雜 audio token 分布

   - VAE：學習連續潛在特徵（能還原音質）

優於傳統 vocoder（如 MelGAN、HiFi-GAN）：

- 支援更強的 speaker similarity

- 更低的錯字率、更穩定

**[1\. AR Transformer 產生的 audio token 是什麼？](https://www.backend-b.com/1-ar-transformer-%E7%94%A2%E7%94%9F%E7%9A%84-audio-token-%E6%98%AF%E4%BB%80%E9%BA%BC)**[2\. token 轉成潛在特徵（latent vector）](https://www.backend-b.com/2-token-%E8%BD%89%E6%88%90%E6%BD%9B%E5%9C%A8%E7%89%B9%E5%BE%B5latent-vector)[3\. **Flow-VAE**](https://www.backend-b.com/3-flow-vae)



Source: <https://www.backend-b.com/minimax-voice-cloning>