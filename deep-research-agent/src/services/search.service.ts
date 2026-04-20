import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tavily } from '@tavily/core';
import { Source } from '../common/types';

interface TavilySearchOptions {
  maxResults?: number;
  searchDepth?: 'basic' | 'advanced';
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly client: ReturnType<typeof tavily>;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('TAVILY_API_KEY');
    this.client = tavily({ apiKey });
  }

  async search(query: string, options: TavilySearchOptions = {}): Promise<{
    results: Source[];
    rawContent: string;
  }> {
    const { maxResults = 5, searchDepth = 'basic' } = options;

    this.logger.debug(`Searching for: "${query}"`);

    const response = await this.client.search(query, {
      maxResults,
      searchDepth,
      includeAnswer: true,
    });

    const results: Source[] = response.results.map((r) => ({
      title: r.title,
      url: r.url,
      relevanceScore: r.score,
    }));

    const rawContent = response.results
      .map((r) => `## ${r.title}\n${r.content}`)
      .join('\n\n');

    this.logger.debug(`Found ${results.length} results`);

    return { results, rawContent };
  }
}