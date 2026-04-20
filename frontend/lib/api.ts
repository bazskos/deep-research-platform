import axios from 'axios';
import { DepthLevel, ResearchJob } from '@/types/research';

const client = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

export async function startResearch(
  query: string,
  depth: DepthLevel,
): Promise<ResearchJob> {
  const { data } = await client.post<ResearchJob>('/research', { query, depth });
  return data;
}

export async function getResearch(id: string): Promise<ResearchJob> {
  const { data } = await client.get<ResearchJob>(`/research/${id}`);
  return data;
}

export async function getAllResearch(): Promise<ResearchJob[]> {
  const { data } = await client.get<ResearchJob[]>('/research');
  return data;
}

export async function deleteResearch(id: string): Promise<void> {
  await client.delete(`/research/${id}`);
}