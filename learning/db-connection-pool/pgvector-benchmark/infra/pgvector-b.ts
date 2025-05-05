import { PGVectorStore, PGVectorStoreArgs } from "@langchain/community/vectorstores/pgvector";
import { EmbeddingsInterface } from "@langchain/core/embeddings";

import { reusablePool } from "../shared/config";

// 保存初始化的配置
let initializedConfig: PGVectorStoreArgs;

/**
 * B 組實現 - 重複使用初始化後的連接池
 * 只在第一次呼叫時初始化，後續呼叫重用已初始化的實例
 */
export async function createPGVectorStore(
  tableName: string,
  embeddingModel: EmbeddingsInterface
): Promise<PGVectorStore> {
  if (!initializedConfig) {
    console.log("🚀 B組: 首次初始化 PGVectorStore");

    // 只在第一次呼叫時初始化配置
    initializedConfig = {
      pool: reusablePool,
      tableName: "vector_store",
      collectionTableName: "vector_store_collection",
      collectionName: tableName,
      columns: {
        idColumnName: "id",
        vectorColumnName: "vector",
        contentColumnName: "content",
        metadataColumnName: "metadata",
      },
    };

    // 第一次呼叫時需要初始化
    return await PGVectorStore.initialize(embeddingModel, initializedConfig);
  }

  // 後續呼叫直接使用 new 建立實例，不再初始化連接池
  console.log("🔄 B組: 重用已初始化的 PGVectorStore 配置");
  return new PGVectorStore(embeddingModel, initializedConfig);
} 