import { MockEmbeddings } from "../shared/mock-embeddings";
import { createPGVectorStore } from "../infra/pgvector-a";
import { benchmarkConfig, closePGPool } from "../shared/config";
import {
  measureExecutionTime,
  calculateStats,
  formatResults,
  saveResultsAsJson,
  saveResultsAsCsv
} from "../shared/utils";

/**
 * A 組 Benchmark - 測試每次重新初始化連接池的 PGVectorStore 效能
 */
async function runGroupABenchmark() {
  console.log("\n🔬 開始 A 組 Benchmark (每次初始化新連接池)");
  console.log("---------------------------------------------------");

  // 使用模擬嵌入模型
  const embeddingModel = new MockEmbeddings();
  const durations: number[] = [];
  const allResults: { group: string; iteration: number; duration: number }[] = [];

  try {
    // 預熱階段 - 不納入結果計算
    console.log("\n🔥 預熱階段:");
    for (let i = 1; i <= benchmarkConfig.warmupIterations; i++) {
      const { duration } = await measureExecutionTime(
        () => createPGVectorStore(`${benchmarkConfig.tableName}_warmup_${i}`, embeddingModel),
        `[A組-預熱] 第${i}次`
      );
    }

    // 實際測試階段
    console.log("\n📊 測試階段:");
    for (let i = 1; i <= benchmarkConfig.iterations; i++) {
      const { duration } = await measureExecutionTime(
        () => createPGVectorStore(`${benchmarkConfig.tableName}_${i}`, embeddingModel),
        `[A組] 第${i}次`
      );

      durations.push(duration);
      allResults.push({ group: "A", iteration: i, duration });
    }

    // 計算統計數據
    const stats = calculateStats(durations);

    // 顯示結果
    console.log(formatResults("A組 (每次初始化新連接池)", durations, stats));

    // 保存結果
    saveResultsAsJson({
      group: "A",
      description: "每次初始化新連接池",
      iterations: benchmarkConfig.iterations,
      durations,
      stats
    }, "benchmark-result-a.json");

    return { durations, stats, allResults };
  } catch (error) {
    console.error("A組 Benchmark 測試失敗:", error);
    throw error;
  }
}

// 執行 benchmark 並關閉連接池
(async () => {
  try {
    const { allResults } = await runGroupABenchmark();
    saveResultsAsCsv(allResults, "benchmark-result-a.csv");
  } catch (error) {
    console.error("Benchmark 執行失敗:", error);
  } finally {
    await closePGPool();
  }
})(); 