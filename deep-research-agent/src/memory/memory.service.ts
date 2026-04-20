import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmbeddingService } from '../services/embedding.service';
import { MemoryEntity } from './memory.entity';
import { v4 as uuidv4 } from 'uuid';

export interface MemorySearchResult {
  query: string;
  summary: string;
  similarity: number;
}

@Injectable()
export class MemoryService implements OnModuleInit {
  private readonly logger = new Logger(MemoryService.name);
  private readonly similarityThreshold = 0.7;
  private readonly maxResults = 3;

  constructor(
    @InjectRepository(MemoryEntity)
    private readonly repo: Repository<MemoryEntity>,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async onModuleInit() {
    // 1. Garantáljuk, hogy a pgvector kiterjesztés be van kapcsolva az adatbázisban!
    await this.repo.query('CREATE EXTENSION IF NOT EXISTS vector;');
    this.logger.log('PostgreSQL pgvector extension ready.');
  }

  async save(jobId: string, query: string, summary: string): Promise<void> {
    this.logger.log(`Saving memory for job: ${jobId}`);

    const embedding = await this.embeddingService.embed(query);

    await this.repo.save({
      id: uuidv4(),
      jobId,
      query,
      summary,
      embedding: JSON.stringify(embedding) as any,
    });

    this.logger.log(`Memory saved for: "${query.slice(0, 60)}"`);
  }

  async search(query: string): Promise<MemorySearchResult[]> {
    this.logger.log(`Searching memory for: "${query.slice(0, 60)}"`);

    const queryEmbedding = await this.embeddingService.embed(query);
    const embeddingString = JSON.stringify(queryEmbedding);

    const results = await this.repo.query(
      `SELECT query, summary, 1 - (embedding <=> $1) AS similarity
       FROM research_memories
       WHERE 1 - (embedding <=> $1) >= $2
       ORDER BY embedding <=> $1 ASC
       LIMIT $3`,
      [embeddingString, this.similarityThreshold, this.maxResults],
    );

    this.logger.log(`Found ${results.length} relevant memories`);

    return results.map((r) => ({
      query: r.query,
      summary: r.summary,
      similarity: parseFloat(r.similarity),
    }));
  }
}
