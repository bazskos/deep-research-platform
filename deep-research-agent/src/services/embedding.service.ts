import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly client: HfInference;
  private readonly model = 'sentence-transformers/all-MiniLM-L6-v2';

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('HUGGINGFACE_API_KEY');
    this.client = new HfInference(apiKey);
  }

  async embed(text: string): Promise<number[]> {
    this.logger.debug(`Embedding text: ${text.slice(0, 60)}...`);

    const result = await this.client.featureExtraction({
      model: this.model,
      inputs: text,
    });

    // result lehet nested array, kiszedjük az első sort
    if (Array.isArray(result[0])) {
      return result[0] as number[];
    }
    return result as unknown as number[];
  }

  cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return dot / (magA * magB);
  }
}