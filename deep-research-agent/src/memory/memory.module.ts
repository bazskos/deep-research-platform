import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryEntity } from './memory.entity';
import { MemoryService } from './memory.service';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemoryEntity]),
    ServicesModule,
  ],
  providers: [MemoryService],
  exports: [MemoryService],
})
export class MemoryModule {}
