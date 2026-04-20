import { Module } from '@nestjs/common';
import { ResearchPipeline } from './research.pipeline';
import { AgentsModule } from '../agents/agents.module';
import { MemoryModule } from '../memory/memory.module';

@Module({
  imports: [AgentsModule, MemoryModule],
  providers: [ResearchPipeline],
  exports: [ResearchPipeline],
})
export class OrchestratorModule {}
