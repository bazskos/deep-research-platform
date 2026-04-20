import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../services/llm.service';
import { CriticOutput } from '../common/types';

@Injectable()
export class CriticAgent {
  private readonly logger = new Logger(CriticAgent.name);

  constructor(private readonly llmService: LlmService) {}

  async critique(query: string, report: string): Promise<CriticOutput> {
    this.logger.log('Critiquing generated report');

    const prompt = this.buildPrompt(query, report);
    const raw = await this.llmService.generate(prompt, 0.3);
    const output = this.parseOutput(raw);

    this.logger.log(`Critique done. Passed: ${output.passed}`);
    return output;
  }

  private buildPrompt(query: string, report: string): string {
    return `You are a strict research quality reviewer.
Evaluate the following research report against the original question.

Original question: "${query}"

Report:
${report}

Evaluate for:
1. Does it fully answer the original question?
2. Are there logical gaps or contradictions?
3. Is the structure clear and complete?
4. Are conclusions well supported?

Return ONLY a JSON object, no explanation, no markdown:
{
  "passed": true or false,
  "notes": "overall assessment in 1-2 sentences",
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;
  }

  private parseOutput(raw: string): CriticOutput {
    const cleaned = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleaned);
  }
}