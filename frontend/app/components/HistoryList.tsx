'use client';

import { ResearchJob } from '@/types/research';
import { useRouter } from 'next/navigation';

interface HistoryListProps {
  history: ResearchJob[];
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export default function HistoryList({ history, onDelete }: HistoryListProps) {
  const router = useRouter();

  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 flex flex-col gap-3">
      <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 px-2">
        Recent Research
      </h3>
      
      {history.map((job) => (
        <div 
          key={job.id}
          onClick={() => router.push(`/research/${job.id}`)}
          className="group flex items-center justify-between p-4 bg-[#111111] hover:bg-[#1a1a1a] border border-zinc-800 hover:border-zinc-700 rounded-2xl cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center gap-4 overflow-hidden w-full">
            <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center shrink-0">
              <span className="text-lg">{job.status === 'completed' ? '📝' : '⏳'}</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-zinc-200 font-medium truncate group-hover:text-white transition-colors">
                {job.query}
              </span>
              <span className="text-xs text-zinc-500 mt-1">
                {new Date(job.createdAt).toLocaleDateString()} • {job.status}
              </span>
            </div>
            <button 
              type="button"
              onClick={(e) => onDelete(e, job.id)}
              className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
              title="Delete Research"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}