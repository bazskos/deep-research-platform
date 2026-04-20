import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ResearchJob } from '../common/types';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('research-queue') private readonly researchQueue: Queue,
  ) {}

  async add(id: string, data: ResearchJob): Promise<void> {
    await this.researchQueue.add('process-research', data, {
      jobId: id,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });

    this.logger.log(`Job added to BullMQ: ${id}`);
  }

  async getStats() {
    return await this.researchQueue.getJobCounts();
  }
}
