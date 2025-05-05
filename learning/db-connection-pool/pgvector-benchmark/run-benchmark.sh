#!/bin/bash

# 顯示標題
echo "====================================================="
echo "    PGVector Connection Pool Benchmark"
echo "====================================================="

# 檢查是否已安裝相依套件
if [ ! -d "node_modules" ]; then
  echo "正在安裝相依套件..."
  pnpm install
fi

# 安裝成功，開始執行 benchmark
echo "開始執行效能測試..."
echo ""

# 執行 benchmark
pnpm benchmark:all

echo ""
echo "====================================================="
echo "效能測試完成！結果已輸出至 JSON 與 CSV 檔案中"
echo "=====================================================" 