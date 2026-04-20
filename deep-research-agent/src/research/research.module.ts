import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { ResearchProcessor } from './research.processor'; // <-- ÚJ IMPORT
import { OrchestratorModule } from '../orchestrator/orchestrator.module';
import { ResearchJobEntity } from './research.entity';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    OrchestratorModule,
    TypeOrmModule.forFeature([ResearchJobEntity]),
    QueueModule,
  ],
  controllers: [ResearchController],
  providers: [ResearchService, ResearchProcessor],
})
export class ResearchModule {}
