import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { EmbeddingsInterface } from "@langchain/core/embeddings";

import { reusablePool } from "../shared/config";

/**
 * A 組實現 - 每次建立新的連接池
 * 每次呼叫 createPGVectorStore 都會初始化 PGVectorStore.initialize(...)
 * 等同於每次都觸發一輪 TCP 連線 + TLS + 驗證
 */
export async function createPGVectorStore(
  tableName: string,
  embeddingModel: EmbeddingsInterface
): Promise<PGVectorStore> {
  // A 組：每次都重新初始化 PGVectorStore
  return await PGVectorStore.initialize(embeddingModel, {
    pool: reusablePool,
    tableName,
    columns: {
      idColumnName: "id",
      vectorColumnName: "vector",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
  });
} 