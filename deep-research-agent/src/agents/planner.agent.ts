import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../services/llm.service';
import { PlannerOutput, SubTask, DepthLevel } from '../common/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlannerAgent {
  private readonly logger = new Logger(PlannerAgent.name);

  constructor(private readonly llmService: LlmService) {}

  async plan(
    query: string,
    depth: DepthLevel,
    memoryContext?: string,
  ): Promise<PlannerOutput> {
    this.logger.log(`Planning research for: "${query}" | depth: ${depth}`);

    const subTaskCount = depth === DepthLevel.QUICK ? 3 : 6;
    const prompt = this.buildPrompt(query, subTaskCount, memoryContext);
    const raw = await this.llmService.generate(prompt, 0.5);
    const subTasks = this.parseSubTasks(raw);

    this.logger.log(`Created ${subTasks.length} subtasks`);
    return { subTasks };
  }

  private buildPrompt(
    query: string,
    count: number,
    memoryContext?: string,
  ): string {
    const memorySection = memoryContext
      ? `\nRelevant previous research (use this to avoid duplication and go deeper):\n${memoryContext}\n`
      : '';

    return `You are a research planning expert.
Your job is to break down a complex research question into ${count} focused subtopics.
${memorySection}
Research question: "${query}"

Rules:
- Each subtopic must be specific and researchable
- Subtopics must cover different aspects of the main question
- No overlapping between subtopics
- If previous research is provided, focus on new angles not yet covered
- Return ONLY a JSON array, no explanation, no markdown

Expected format:
["subtopic 1", "subtopic 2", "subtopic 3"]`;
  }

  private parseSubTasks(raw: string): SubTask[] {
    const cleaned = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const topics: string[] = JSON.parse(cleaned);

    return topics.map((topic) => ({
      id: uuidv4(),
      topic,
      completed: false,
    }));
  }
}
