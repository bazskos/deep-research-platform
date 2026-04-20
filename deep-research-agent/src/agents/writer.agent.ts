import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../services/llm.service';
import { ResearchResult, WriterOutput } from '../common/types';

@Injectable()
export class WriterAgent {
  private readonly logger = new Logger(WriterAgent.name);

  constructor(private readonly llmService: LlmService) {}

  async write(
    query: string,
    results: ResearchResult[],
  ): Promise<WriterOutput> {
    this.logger.log(`Writing final report for: "${query}"`);

    const prompt = this.buildPrompt(query, results);
    const report = await this.llmService.generate(prompt, 0.7);

    this.logger.log('Report generated successfully');
    return { report };
  }

  private buildPrompt(query: string, results: ResearchResult[]): string {
    const researchSections = results
      .map((r) => `### ${r.topic}\n${r.summary}`)
      .join('\n\n');

    return `You are an expert research writer.
Write a comprehensive, well-structured research report based on the following research data.

Original question: "${query}"

Research data:
${researchSections}

Report structure:
1. Executive Summary (2-3 sentences)
2. Introduction
3. Main Findings (one section per research topic)
4. Conclusion & Key Takeaways

Rules:
- Use clear markdown formatting with headers
- Be analytical, not just descriptive
- Connect findings across topics where relevant
- Professional but accessible tone`;
  }
}