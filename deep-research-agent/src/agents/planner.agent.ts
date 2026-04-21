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

    // Using the LLM to generate the plan
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

    return `You are a Senior Research Planning AI.
Your job is to break down the user's research query into ${count} specific, deep research subtasks.
${memorySection}
Research question: "${query}"

STRICT RULES:
1. Define the priority of the tasks (priority: 1 is the highest/most fundamental, 5 is the lowest). Foundation topics should get priority 1.
2. Define dependencies (dependsOn). If understanding task B requires the results of task A, put task A's ID into task B's dependsOn array.
3. Output EXCLUSIVELY a valid JSON array of objects. Do NOT include markdown formatting like \`\`\`json.

Expected JSON structure:
[
  {
    "id": "task_1",
    "topic": "Clarifying core concepts and definitions",
    "priority": 1,
    "dependsOn": []
  },
  {
    "id": "task_2",
    "topic": "Deeper implications and technical analysis",
    "priority": 2,
    "dependsOn": ["task_1"]
  }
]`;
  }

  private parseSubTasks(raw: string): SubTask[] {
    try {
      // Clean up potential markdown formatting from the LLM response
      const cleaned = raw
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const parsedData = JSON.parse(cleaned);
      const topics = Array.isArray(parsedData) ? parsedData : [parsedData];

      return topics.map((item: any) => ({
        id: item.id || `task_${uuidv4().substring(0, 8)}`,
        topic:
          item.topic || (typeof item === 'string' ? item : 'Unknown topic'),
        completed: false,
        priority: item.priority || 3,
        dependsOn: Array.isArray(item.dependsOn) ? item.dependsOn : [],
      }));
    } catch (error) {
      this.logger.error(
        `Failed to parse JSON from Planner AI. Raw output: ${raw}`,
        error,
      );

      // Safe fallback in case of complete JSON failure
      return [
        {
          id: `task_${uuidv4().substring(0, 8)}`,
          topic: 'General overview of the topic',
          completed: false,
          priority: 1,
          dependsOn: [],
        },
      ];
    }
  }
}
