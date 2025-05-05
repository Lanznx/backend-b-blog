import { MockEmbeddings } from "../shared/mock-embeddings";
import { createPGVectorStore as createPGVectorStoreA } from "../infra/pgvector-a";
import { createPGVectorStore as createPGVectorStoreB } from "../infra/pgvector-b";
import { benchmarkConfig, closePGPool } from "../shared/config";
import {
  measureExecutionTime,
  calculateStats,
  formatResults,
  saveResultsAsJson,
  saveResultsAsCsv
} from "../shared/utils";

// 測試 A 組：每次建立新連接池
async function runGroupABenchmark() {
  console.log("\n🔬 開始 A 組 Benchmark (每次初始化新連接池)");
  console.log("---------------------------------------------------");

  const embeddingModel = new MockEmbeddings();
  const durations: number[] = [];
  const allResults: { group: string; iteration: number; duration: number }[] = [];

  // 預熱階段
  console.log("\n🔥 A組預熱階段:");
  for (let i = 1; i <= benchmarkConfig.warmupIterations; i++) {
    await measureExecutionTime(
      () => createPGVectorStoreA(`${benchmarkConfig.tableName}_a_warmup_${i}`, embeddingModel),
      `[A組-預熱] 第${i}次`
    );
  }

  // 實際測試階段
  console.log("\n📊 A組測試階段:");
  for (let i = 1; i <= benchmarkConfig.iterations; i++) {
    const { duration } = await measureExecutionTime(
      () => createPGVectorStoreA(`${benchmarkConfig.tableName}_a_${i}`, embeddingModel),
      `[A組] 第${i}次`
    );

    durations.push(duration);
    allResults.push({ group: "A", iteration: i, duration });
  }

  const stats = calculateStats(durations);
  console.log(formatResults("A組 (每次初始化新連接池)", durations, stats));

  return { durations, stats, allResults };
}

// 測試 B 組：重用初始化後的連接池
async function runGroupBBenchmark() {
  console.log("\n🔬 開始 B 組 Benchmark (重用初始化後的連接池)");
  console.log("---------------------------------------------------");

  const embeddingModel = new MockEmbeddings();
  const durations: number[] = [];
  const allResults: { group: string; iteration: number; duration: number }[] = [];

  // 預熱階段
  console.log("\n🔥 B組預熱階段:");
  for (let i = 1; i <= benchmarkConfig.warmupIterations; i++) {
    await measureExecutionTime(
      () => createPGVectorStoreB(`${benchmarkConfig.tableName}_b_warmup_${i}`, embeddingModel),
      `[B組-預熱] 第${i}次`
    );
  }

  // 實際測試階段
  console.log("\n📊 B組測試階段:");
  for (let i = 1; i <= benchmarkConfig.iterations; i++) {
    const { duration } = await measureExecutionTime(
      () => createPGVectorStoreB(`${benchmarkConfig.tableName}_b_${i}`, embeddingModel),
      `[B組] 第${i}次`
    );

    durations.push(duration);
    allResults.push({ group: "B", iteration: i, duration });
  }

  const stats = calculateStats(durations);
  console.log(formatResults("B組 (重用初始化後的連接池)", durations, stats));

  return { durations, stats, allResults };
}

// 顯示比較結果
function displayComparison(resultA: { stats: any }, resultB: { stats: any }) {
  const statsA = resultA.stats;
  const statsB = resultB.stats;

  console.log("\n📊 A組與B組效能比較");
  console.log("---------------------------------------------------");
  console.log(`平均耗時：A組 ${statsA.avg.toFixed(5)} ms vs B組 ${statsB.avg.toFixed(5)} ms (差異倍數: ${(statsA.avg / statsB.avg).toFixed(2)}x)`);
  console.log(`中位數：A組 ${statsA.median.toFixed(5)} ms vs B組 ${statsB.median.toFixed(5)} ms (差異倍數: ${(statsA.median / statsB.median).toFixed(2)}x)`);
  console.log(`最小值：A組 ${statsA.min.toFixed(5)} ms vs B組 ${statsB.min.toFixed(5)} ms (差異倍數: ${(statsA.min / statsB.min).toFixed(2)}x)`);
  console.log(`最大值：A組 ${statsA.max.toFixed(5)} ms vs B組 ${statsB.max.toFixed(5)} ms (差異倍數: ${(statsA.max / statsB.max).toFixed(2)}x)`);
  console.log(`P95：A組 ${statsA.p95.toFixed(5)} ms vs B組 ${statsB.p95.toFixed(5)} ms (差異倍數: ${(statsA.p95 / statsB.p95).toFixed(2)}x)`);
  console.log(`P99：A組 ${statsA.p99.toFixed(5)} ms vs B組 ${statsB.p99.toFixed(5)} ms (差異倍數: ${(statsA.p99 / statsB.p99).toFixed(2)}x)`);
}

// 執行綜合benchmark
(async () => {
  try {
    // 先運行 B 組測試 (因為初始化一次後重複使用)
    const resultB = await runGroupBBenchmark();

    // 再運行 A 組測試
    const resultA = await runGroupABenchmark();

    // 顯示比較結果
    displayComparison(resultA, resultB);

    // 合併結果
    const allResults = [...resultA.allResults, ...resultB.allResults];

    // 保存結果
    saveResultsAsCsv(allResults, "benchmark-comparison.csv");
    saveResultsAsJson({
      timestamp: new Date().toISOString(),
      config: benchmarkConfig,
      groupA: {
        description: "每次初始化新連接池",
        durations: resultA.durations,
        stats: resultA.stats
      },
      groupB: {
        description: "重用初始化後的連接池",
        durations: resultB.durations,
        stats: resultB.stats
      },
      comparison: {
        avgSpeedup: resultA.stats.avg / resultB.stats.avg,
        medianSpeedup: resultA.stats.median / resultB.stats.median,
        p95Speedup: resultA.stats.p95 / resultB.stats.p95
      }
    }, "benchmark-comparison.json");

    console.log("\n💾 所有測試結果已保存");
  } catch (error) {
    console.error("Benchmark 執行失敗:", error);
  } finally {
    await closePGPool();
  }
})(); 