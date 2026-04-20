import { Module } from '@nestjs/common';
import { PlannerAgent } from './planner.agent';
import { ResearcherAgent } from './researcher.agent';
import { WriterAgent } from './writer.agent';
import { CriticAgent } from './critic.agent';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [ServicesModule],
  providers: [PlannerAgent, ResearcherAgent, WriterAgent, CriticAgent],
  exports: [PlannerAgent, ResearcherAgent, WriterAgent, CriticAgent],
})
export class AgentsModule {}