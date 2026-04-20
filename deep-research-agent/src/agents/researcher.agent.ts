import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../services/llm.service';
import { SearchService } from '../services/search.service';
import { ResearchOutput, SubTask, DepthLevel } from '../common/types';

@Injectable()
export class ResearcherAgent {
  private readonly logger = new Logger(ResearcherAgent.name);

  constructor(
    private readonly llmService: LlmService,
    private readonly searchService: SearchService,
  ) {}

  async research(
    subTask: SubTask,
    depth: DepthLevel,
  ): Promise<ResearchOutput> {
    this.logger.log(`Researching subtask: "${subTask.topic}"`);

    const searchDepth = depth === DepthLevel.DEEP ? 'advanced' : 'basic';
    const maxResults = depth === DepthLevel.DEEP ? 8 : 4;

    const { results, rawContent } = await this.searchService.search(
      subTask.topic,
      { maxResults, searchDepth },
    );

    const summary = await this.summarize(subTask.topic, rawContent);

    this.logger.log(`Completed research for: "${subTask.topic}"`);

    return {
      subTaskId: subTask.id,
      topic: subTask.topic,
      summary,
      sources: results,
    };
  }

  private async summarize(topic: string, rawContent: string): Promise<string> {
    const prompt = `You are a research analyst.
Summarize the following search results about "${topic}".

Search results:
${rawContent}

Rules:
- Write a dense, factual summary (200-300 words)
- Focus only on information relevant to the topic
- Use clear, professional language
- Do NOT include source URLs in the summary`;

    return this.llmService.generate(prompt, 0.3);
  }
}