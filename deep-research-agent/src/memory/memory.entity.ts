import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('research_memories')
export class MemoryEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  jobId: string;

  @Column('text')
  query: string;

  @Column('text')
  summary: string;

  // EZ AZ ÚJ VARÁZSLAT: Dedikált vector típus
  @Column({ type: 'vector', length: 384 })
  embedding: number[];

  @CreateDateColumn()
  createdAt: Date;
}
