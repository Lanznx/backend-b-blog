import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// 確保全局只有一個連接池實例
const globalForPg = globalThis as unknown as {
  pgPool: Pool | undefined;
};

export const reusablePool =
  globalForPg.pgPool ?? createPgPoolFromDatabaseUrl("postgresql://postgres:postgres@localhost:5540/postgres");

// 非生產環境下保存連接池實例
if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = reusablePool;
  console.log("✅ Using global reusablePool");
}

function createPgPoolFromDatabaseUrl(databaseUrl: string): Pool {
  try {
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    let url: URL;
    try {
      url = new URL(databaseUrl);
    } catch (error) {
      throw new Error(`Invalid DATABASE_URL: ${databaseUrl}, error: ${error}`);
    }

    const ssl = process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined;

    return new Pool({
      host: url.hostname,
      port: Number(url.port) || 5432,
      user: url.username,
      password: url.password,
      database: url.pathname.replace("/", ""),
      ssl,
      max: 20, // 最大連接數
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  } catch (error) {
    throw new Error(`Failed to create PG pool: ${error}`);
  }
}

// 設定測試參數
export const benchmarkConfig = {
  iterations: 10,      // 執行次數，從20降為10以避免連接池過載
  warmupIterations: 2, // 預熱次數（不計入結果）
  tableName: "benchmark_vector_store", // 用於測試的表名
};

// 關閉連接池
export async function closePGPool(): Promise<void> {
  if (globalForPg.pgPool) {
    await globalForPg.pgPool.end();
    console.log("✅ PG Pool closed");
  }
}

process.on("SIGINT", async () => {
  await closePGPool();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closePGPool();
  process.exit(0);
}); 