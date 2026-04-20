import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ResearchPipeline } from '../orchestrator/research.pipeline';
import { ResearchJob } from '../common/types';

@Processor('research-queue')
export class ResearchProcessor extends WorkerHost {
  private readonly logger = new Logger(ResearchProcessor.name);

  constructor(private readonly pipeline: ResearchPipeline) {
    super();
  }

  async process(job: Job<ResearchJob, any, string>): Promise<any> {
    this.logger.log(`[BullMQ Worker] Processing job: ${job.id}`);

    const completedJob = await this.pipeline.execute(job.data);

    this.logger.log(`[BullMQ Worker] Finished job: ${job.id}`);
    return completedJob;
  }
}
