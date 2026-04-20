import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ResearchStatus, DepthLevel } from '../common/types';

@Entity('research_jobs')
export class ResearchJobEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  query: string;

  @Column({ type: 'varchar', default: DepthLevel.QUICK })
  depth: DepthLevel;

  @Column({ type: 'varchar', default: ResearchStatus.PENDING })
  status: ResearchStatus;

  @Column({ type: 'text', default: '[]' })
  subTasksJson: string;

  @Column({ type: 'text', default: '[]' })
  researchResultsJson: string;

  @Column({ type: 'text', nullable: true })
  finalReport: string | null;

  @Column({ type: 'text', nullable: true })
  criticNotes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
