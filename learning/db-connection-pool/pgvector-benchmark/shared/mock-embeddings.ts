import { EmbeddingsInterface } from "@langchain/core/embeddings";

// 模擬嵌入模型，用於測試
export class MockEmbeddings implements EmbeddingsInterface {
  dimensions: number;

  constructor(dimensions: number = 1536) {
    this.dimensions = dimensions;
  }

  // 嵌入文本
  async embedDocuments(texts: string[]): Promise<number[][]> {
    return texts.map(() => this.generateRandomVector());
  }

  // 嵌入查詢
  async embedQuery(text: string): Promise<number[]> {
    return this.generateRandomVector();
  }

  private generateRandomVector(): number[] {
    return Array.from({ length: this.dimensions }, () => Math.random());
  }
} 