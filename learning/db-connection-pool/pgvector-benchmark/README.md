# PGVector Connection Pool Benchmark

此專案用於比較兩種不同 PostgreSQL Connection Pool 使用方式在 `createPGVectorStore` 函數上的效能差異。

## 實驗內容

### A 組：每次建立新的連線池
- `createPGVectorStore` 每次呼叫都初始化 `PGVectorStore.initialize(...)`
- 等同於每次都觸發一輪 TCP 連線 + TLS + 驗證
- 預期耗時 > 10ms

### B 組：重複使用初始化後的連線池
- 使用 singleton PGVectorStoreArgs 實例
- 只初始化一次，後續用 `new PGVectorStore(...)`
- 預期耗時 < 0.1ms

## 實驗參數

- 每組執行10次測試 (預設值，可調整)
- 每組執行2次預熱測試 (不納入結果計算)
- 時間精度：顯示到小數點後5位，以更清晰地展示效能差異

## 安裝與設定

1. 安裝依賴

```bash
npm install
# 或使用 pnpm
pnpm install
```

2. 設定環境變數

```bash
# 複製環境變數範本
cp .env.example .env

# 編輯 .env 檔案，設定你的 PostgreSQL 連接資訊
```

## 執行測試

### 執行 A 組測試 (每次重新初始化連接池)

```bash
npm run benchmark:a
# 或使用 pnpm
pnpm benchmark:a
```

### 執行 B 組測試 (重用已初始化的連接池)

```bash
npm run benchmark:b
# 或使用 pnpm
pnpm benchmark:b
```

### 執行兩組測試並比較結果

```bash
npm run benchmark:all
# 或使用 pnpm
pnpm benchmark:all
```

## 測試結果

執行測試後，結果將以以下格式輸出：

1. 控制台輸出：顯示每次執行的耗時以及統計數據
2. JSON 檔案：`benchmark-result-a.json`, `benchmark-result-b.json`, `benchmark-comparison.json`
3. CSV 檔案：`benchmark-result-a.csv`, `benchmark-result-b.csv`, `benchmark-comparison.csv`

CSV 和 JSON 檔案可用於繪製圖表或進行更深入的分析。

## 專案結構

```
pgvector-benchmark/
├── benchmarks/         # 測試腳本
│   ├── benchmark-a.ts  # A 組測試腳本
│   ├── benchmark-b.ts  # B 組測試腳本
│   └── benchmark-all.ts # 綜合比較測試腳本
├── infra/              # 實現邏輯
│   ├── pgvector-a.ts   # A 組初始化邏輯
│   └── pgvector-b.ts   # B 組重用邏輯
├── shared/             # 共用設定與工具
│   ├── config.ts       # 共用的 reusablePool 定義
│   ├── mock-embeddings.ts # 模擬嵌入模型
│   └── utils.ts        # benchmark 工具函數
├── .env.example        # 環境變數範例
├── package.json
├── tsconfig.json
└── README.md
```