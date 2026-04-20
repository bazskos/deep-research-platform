import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { SearchService } from './search.service';
import { EmbeddingService } from './embedding.service';

@Module({
  providers: [LlmService, SearchService, EmbeddingService],
  exports: [LlmService, SearchService, EmbeddingService],
})
export class ServicesModule {}
