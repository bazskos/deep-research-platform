import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlannerAgent } from '../agents/planner.agent';
import { ResearcherAgent } from '../agents/researcher.agent';
import { WriterAgent } from '../agents/writer.agent';
import { CriticAgent } from '../agents/critic.agent';
import { MemoryService } from '../memory/memory.service';
import {
  ResearchJob,
  ResearchStatus,
  ResearchResult,
  DepthLevel,
} from '../common/types';

@Injectable()
export class ResearchPipeline {
  private readonly logger = new Logger(ResearchPipeline.name);

  constructor(
    private readonly plannerAgent: PlannerAgent,
    private readonly researcherAgent: ResearcherAgent,
    private readonly writerAgent: WriterAgent,
    private readonly criticAgent: CriticAgent,
    private readonly memoryService: MemoryService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(job: ResearchJob): Promise<ResearchJob> {
    this.logger.log(`Starting pipeline for job: ${job.id}`);

    try {
      job = await this.runPlanning(job);
      job = await this.runResearch(job);
      job = await this.runWriting(job);
      job = await this.runCritique(job);
      await this.saveMemory(job);

      job.status = ResearchStatus.COMPLETED;
      job.updatedAt = new Date();
      this.emit(job);

      this.logger.log(`Pipeline completed for job: ${job.id}`);
      return job;
    } catch (error) {
      this.logger.error(`Pipeline failed for job: ${job.id}`, error);
      job.status = ResearchStatus.FAILED;
      job.updatedAt = new Date();
      this.emit(job);
      throw error;
    }
  }

  private async runPlanning(job: ResearchJob): Promise<ResearchJob> {
    this.logger.log(`[${job.id}] Phase 1: Planning`);
    job.status = ResearchStatus.PLANNING;
    job.updatedAt = new Date();
    this.emit(job);

    // Memory keresés
    const memories = await this.memoryService.search(job.query);
    const memoryContext =
      memories.length > 0
        ? memories
            .map((m) => `Previous research on "${m.query}":\n${m.summary}`)
            .join('\n\n')
        : undefined;

    if (memoryContext) {
      this.logger.log(`[${job.id}] Found ${memories.length} relevant memories`);
    }

    const { subTasks } = await this.plannerAgent.plan(
      job.query,
      job.depth,
      memoryContext,
    );
    job.subTasks = subTasks;

    return job;
  }

  private async runResearch(job: ResearchJob): Promise<ResearchJob> {
    this.logger.log(
      `[${job.id}] Phase 2: Researching ${job.subTasks.length} subtasks`,
    );
    job.status = ResearchStatus.RESEARCHING;
    job.updatedAt = new Date();
    this.emit(job);

    const results: ResearchResult[] = [];
    const CONCURRENCY_LIMIT = 3; // Egyszerre maximum 3 szálon fut a kutatás
    let currentTaskIndex = 0;

    const worker = async () => {
      while (currentTaskIndex < job.subTasks.length) {
        const index = currentTaskIndex++;
        const subTask = job.subTasks[index];

        try {
          const result = await this.researcherAgent.research(
            subTask,
            job.depth,
          );

          subTask.completed = true;
          job.updatedAt = new Date();
          results.push(result);

          this.emit(job);
        } catch (error) {
          this.logger.error(
            `[${job.id}] Failed to research subtask: "${subTask.topic}"`,
            error,
          );

          results.push({
            subTaskId: subTask.id,
            topic: subTask.topic,
            summary: 'Research failed for this topic due to an API error.',
            sources: [],
          });
        }
      }
    };

    const activeWorkers = Array(
      Math.min(CONCURRENCY_LIMIT, job.subTasks.length),
    )
      .fill(null)
      .map(() => worker());

    await Promise.all(activeWorkers);

    job.researchResults = results;
    return job;
  }

  private async runWriting(job: ResearchJob): Promise<ResearchJob> {
    this.logger.log(`[${job.id}] Phase 3: Writing report`);
    job.status = ResearchStatus.WRITING;
    job.updatedAt = new Date();
    this.emit(job);

    const { report } = await this.writerAgent.write(
      job.query,
      job.researchResults,
    );
    job.finalReport = report;
    return job;
  }

  private async runCritique(job: ResearchJob): Promise<ResearchJob> {
    this.logger.log(`[${job.id}] Phase 4: Critiquing`);
    job.status = ResearchStatus.CRITIQUING;
    job.updatedAt = new Date();
    this.emit(job);

    const critique = await this.criticAgent.critique(
      job.query,
      job.finalReport!,
    );
    job.criticNotes = `${critique.notes}\n\nSuggestions:\n${critique.suggestions.map((s) => `- ${s}`).join('\n')}`;
    return job;
  }

  private async saveMemory(job: ResearchJob): Promise<void> {
    this.logger.log(`[${job.id}] Saving to memory`);
    const summary = job.researchResults
      .map((r) => `${r.topic}: ${r.summary.slice(0, 200)}`)
      .join('\n');

    await this.memoryService.save(job.id, job.query, summary);
  }

  private emit(job: ResearchJob): void {
    this.eventEmitter.emit('research.updated', job);
  }
}
