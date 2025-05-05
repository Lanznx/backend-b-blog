import { MockEmbeddings } from "../shared/mock-embeddings";
import { createPGVectorStore } from "../infra/pgvector-b";
import { benchmarkConfig, closePGPool } from "../shared/config";
import {
  measureExecutionTime,
  calculateStats,
  formatResults,
  saveResultsAsJson,
  saveResultsAsCsv
} from "../shared/utils";

/**
 * B 組 Benchmark - 測試重用初始化後連接池的 PGVectorStore 效能
 */
async function runGroupBBenchmark() {
  console.log("\n🔬 開始 B 組 Benchmark (重用初始化後的連接池)");
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
        `[B組-預熱] 第${i}次`
      );
    }

    // 實際測試階段
    console.log("\n📊 測試階段:");
    for (let i = 1; i <= benchmarkConfig.iterations; i++) {
      const { duration } = await measureExecutionTime(
        () => createPGVectorStore(`${benchmarkConfig.tableName}_${i}`, embeddingModel),
        `[B組] 第${i}次`
      );

      durations.push(duration);
      allResults.push({ group: "B", iteration: i, duration });
    }

    // 計算統計數據
    const stats = calculateStats(durations);

    // 顯示結果
    console.log(formatResults("B組 (重用初始化後的連接池)", durations, stats));

    // 保存結果
    saveResultsAsJson({
      group: "B",
      description: "重用初始化後的連接池",
      iterations: benchmarkConfig.iterations,
      durations,
      stats
    }, "benchmark-result-b.json");

    return { durations, stats, allResults };
  } catch (error) {
    console.error("B組 Benchmark 測試失敗:", error);
    throw error;
  }
}

// 執行 benchmark 並關閉連接池
(async () => {
  try {
    const { allResults } = await runGroupBBenchmark();
    saveResultsAsCsv(allResults, "benchmark-result-b.csv");
  } catch (error) {
    console.error("Benchmark 執行失敗:", error);
  } finally {
    await closePGPool();
  }
})(); 