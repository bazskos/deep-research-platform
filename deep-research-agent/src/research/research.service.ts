import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import type { ResearchJob } from '../common/types';
import { ResearchStatus, DepthLevel } from '../common/types';
import { ResearchJobEntity } from './research.entity';
import { QueueService } from '../queue/queue.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResearchService {
  private readonly logger = new Logger(ResearchService.name);

  constructor(
    @InjectRepository(ResearchJobEntity)
    private readonly repo: Repository<ResearchJobEntity>,
    private readonly queueService: QueueService,
  ) {}

  async startResearch(query: string, depth: DepthLevel): Promise<ResearchJob> {
    const entity = this.repo.create({
      id: uuidv4(),
      query,
      depth,
      status: ResearchStatus.PENDING,
      subTasksJson: '[]',
      researchResultsJson: '[]',
      finalReport: null,
      criticNotes: null,
    });

    await this.repo.save(entity);
    const job = this.toJob(entity);
    this.logger.log(`Created job: ${job.id}`);

    // Delegate background processing to BullMQ
    await this.queueService.add(job.id, job);

    return job;
  }

  async getJob(id: string): Promise<ResearchJob> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Research job not found: ${id}`);
    return this.toJob(entity);
  }

  async getAllJobs(): Promise<ResearchJob[]> {
    const entities = await this.repo.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => this.toJob(e));
  }

  async getQueueStats() {
    return this.queueService.getStats();
  }

  // Syncs job state to DB via events emitted by the pipeline/processor
  @OnEvent('research.updated')
  async handleResearchUpdated(job: ResearchJob): Promise<void> {
    await this.saveJob(job);
    this.logger.debug(`Job ${job.id} updated — status: ${job.status}`);
  }

  private async saveJob(job: ResearchJob): Promise<void> {
    await this.repo.save({
      id: job.id,
      query: job.query,
      depth: job.depth,
      status: job.status,
      subTasksJson: JSON.stringify(job.subTasks),
      researchResultsJson: JSON.stringify(job.researchResults),
      finalReport: job.finalReport,
      criticNotes: job.criticNotes,
    });
  }

  private toJob(entity: ResearchJobEntity): ResearchJob {
    return {
      id: entity.id,
      query: entity.query,
      depth: entity.depth,
      status: entity.status,
      subTasks: JSON.parse(entity.subTasksJson),
      researchResults: JSON.parse(entity.researchResultsJson),
      finalReport: entity.finalReport,
      criticNotes: entity.criticNotes,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async deleteJob(id: string): Promise<void> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Research job not found: ${id}`);
    await this.repo.remove(entity);
    this.logger.log(`Deleted job: ${id}`);
  }
}
