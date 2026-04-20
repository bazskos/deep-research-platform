export enum ResearchStatus {
  PENDING = 'pending',
  PLANNING = 'planning',
  RESEARCHING = 'researching',
  WRITING = 'writing',
  CRITIQUING = 'critiquing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum DepthLevel {
  QUICK = 'quick',
  DEEP = 'deep',
}

export interface Source {
  title: string;
  url: string;
  relevanceScore?: number;
}

export interface SubTask {
  id: string;
  topic: string;
  completed: boolean;
}

export interface ResearchResult {
  subTaskId: string;
  topic: string;
  summary: string;
  sources: Source[];
}

export interface ResearchJob {
  id: string;
  query: string;
  depth: DepthLevel;
  status: ResearchStatus;
  subTasks: SubTask[];
  researchResults: ResearchResult[];
  finalReport: string | null;
  criticNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
