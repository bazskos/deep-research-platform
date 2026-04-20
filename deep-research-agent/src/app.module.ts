import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from './services/services.module';
import { AgentsModule } from './agents/agents.module';
import { OrchestratorModule } from './orchestrator/orchestrator.module';
import { ResearchModule } from './research/research.module';
import { MemoryModule } from './memory/memory.module';
import { QueueModule } from './queue/queue.module';
import { ResearchJobEntity } from './research/research.entity';
import { MemoryEntity } from './memory/memory.entity';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'admin',
      password: 'admin',
      database: 'deep_research',
      entities: [ResearchJobEntity, MemoryEntity],
      synchronize: true,
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    // -- ÚJ RÉSZ VÉGE --
    ServicesModule,
    AgentsModule,
    OrchestratorModule,
    ResearchModule,
    MemoryModule,
    QueueModule,
  ],
})
export class AppModule {}
