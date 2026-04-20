import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Observable, Subject } from 'rxjs';
import { ResearchService } from './research.service';
import { StartResearchDto } from './dto/start-research.dto';
import type { ResearchJob } from '../common/types';
import { DepthLevel } from '../common/types';

@Controller('research')
export class ResearchController {
  private readonly updates$ = new Subject<ResearchJob>();

  constructor(private readonly researchService: ResearchService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async startResearch(@Body() dto: StartResearchDto): Promise<ResearchJob> {
    const depth = dto.depth ?? DepthLevel.QUICK;
    return this.researchService.startResearch(dto.query, depth);
  }

  @Get()
  async getAllJobs(): Promise<ResearchJob[]> {
    return this.researchService.getAllJobs();
  }

  @Get(':id')
  async getJob(@Param('id') id: string): Promise<ResearchJob> {
    return this.researchService.getJob(id);
  }

  @Sse(':id/stream')
  streamJob(@Param('id') id: string): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      this.researchService
        .getJob(id)
        .then((current) => {
          subscriber.next({ data: current } as MessageEvent);
        })
        .catch((error) => {
          subscriber.error(error);
        });

      const sub = this.updates$.subscribe((job) => {
        if (job.id === id) {
          subscriber.next({ data: job } as MessageEvent);
        }
      });

      return () => sub.unsubscribe();
    });
  }

  @OnEvent('research.updated')
  handleUpdate(job: ResearchJob): void {
    this.updates$.next(job);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteJob(@Param('id') id: string): Promise<void> {
    await this.researchService.deleteJob(id);
  }
}
