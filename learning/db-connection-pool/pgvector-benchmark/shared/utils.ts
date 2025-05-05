import fs from 'node:fs';
import path from 'node:path';

// 效能計時器函數
export async function measureExecutionTime<T>(
  fn: () => Promise<T>,
  label: string
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;

  console.log(`${label}: ${duration.toFixed(5)} ms`);
  return { result, duration };
}

// 計算統計數據
export function calculateStats(durations: number[]): {
  min: number;
  max: number;
  avg: number;
  median: number;
  p95: number;
  p99: number;
} {
  const sortedDurations = [...durations].sort((a, b) => a - b);

  const min = sortedDurations[0];
  const max = sortedDurations[sortedDurations.length - 1];
  const avg = sortedDurations.reduce((sum, val) => sum + val, 0) / sortedDurations.length;

  const medianIndex = Math.floor(sortedDurations.length / 2);
  const median = sortedDurations.length % 2 === 0
    ? (sortedDurations[medianIndex - 1] + sortedDurations[medianIndex]) / 2
    : sortedDurations[medianIndex];

  const p95Index = Math.ceil(sortedDurations.length * 0.95) - 1;
  const p99Index = Math.ceil(sortedDurations.length * 0.99) - 1;

  const p95 = sortedDurations[p95Index];
  const p99 = sortedDurations[p99Index];

  return { min, max, avg, median, p95, p99 };
}

// 格式化結果輸出
export function formatResults(
  groupName: string,
  durations: number[],
  stats: { min: number; max: number; avg: number; median: number; p95: number; p99: number }
): string {
  return `
=== ${groupName} ===
總執行次數: ${durations.length}
最小耗時: ${stats.min.toFixed(5)} ms
最大耗時: ${stats.max.toFixed(5)} ms
平均耗時: ${stats.avg.toFixed(5)} ms
中位數耗時: ${stats.median.toFixed(5)} ms
P95 耗時: ${stats.p95.toFixed(5)} ms
P99 耗時: ${stats.p99.toFixed(5)} ms
`;
}

// 將結果保存為JSON文件
export function saveResultsAsJson(
  results: Record<string, any>,
  filename: string = 'benchmark-report.json'
): void {
  const fullPath = path.resolve(process.cwd(), filename);
  fs.writeFileSync(fullPath, JSON.stringify(results, null, 2));
  console.log(`Results saved to ${fullPath}`);
}

// 將結果保存為CSV文件
export function saveResultsAsCsv(
  durations: { group: string; iteration: number; duration: number }[],
  filename: string = 'benchmark-report.csv'
): void {
  const fullPath = path.resolve(process.cwd(), filename);
  const header = 'group,iteration,duration_ms\n';
  const rows = durations.map(d => `${d.group},${d.iteration},${d.duration.toFixed(5)}`).join('\n');

  fs.writeFileSync(fullPath, header + rows);
  console.log(`CSV results saved to ${fullPath}`);
} 