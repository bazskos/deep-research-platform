'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getResearch } from '@/lib/api';
import { ResearchJob, ResearchStatus } from '@/types/research';
import ProgressTracker from '@/app/components/ProgressTracker';
import ReportViewer from '@/app/components/ReportViewer';

const TERMINAL_STATUSES = [ResearchStatus.COMPLETED, ResearchStatus.FAILED];

export default function ResearchPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const [job, setJob] = useState<ResearchJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!id) return;

    let eventSource: EventSource | null = null;

    getResearch(id)
      .then((data) => {
        setJob(data);

        if (TERMINAL_STATUSES.includes(data.status)) return;
        
        setIsStreaming(true);
        eventSource = new EventSource(`http://localhost:3000/research/${id}/stream`);

        eventSource.onmessage = (event) => {
          try {
            const updated: ResearchJob = JSON.parse(event.data);
            setJob(updated);

            if (TERMINAL_STATUSES.includes(updated.status)) {
              eventSource?.close();
              setIsStreaming(false);
            }
          } catch (err) {
            console.error('Stream parsing error:', err);
          }
        };

        eventSource.onerror = () => {
          eventSource?.close();
          setIsStreaming(false);
        };
      })
      .catch(() => {
        setError('Failed to load research job.');
      });

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      setIsStreaming(false);
    };
  }, [id]);

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-transparent">
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="text-zinc-400 hover:text-white text-sm underline transition-colors cursor-pointer"
        >
          ← Back to search
        </button>
      </main>
    );
  }

  // 1. JAVÍTÁS: A kezdeti betöltésnél a saját szép lila animációnkat használjuk, kicsit felnagyítva
  if (!job) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="loader scale-150">
          <svg viewBox="0 0 100 100">
            <circle className="loader-circle circle-1" cx="50" cy="50" r="40" />
            <circle className="loader-circle circle-2" cx="50" cy="50" r="30" />
          </svg>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        
        <div className="mb-10">
          
          {/* 2. JAVÍTÁS: Vissza gomb hozzáadott cursor-pointer-rel */}
          <button
            onClick={() => router.push('/')}
            className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 cursor-pointer"
            title="Back to search"
          >
            <svg 
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Back to search</span>
          </button>

          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            {job.query}
          </h1>
          
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                job.status === ResearchStatus.COMPLETED
                  ? 'bg-green-900/30 text-green-400 border border-green-800/50'
                  : job.status === ResearchStatus.FAILED
                    ? 'bg-red-900/30 text-red-400 border border-red-800/50'
                    : 'bg-zinc-800/50 text-[#A47CF3] border border-[#A47CF3]/30'
              }`}
            >
              {job.status}
            </span>
            
            {/* 3. JAVÍTÁS: A kis pici dupla lila animáció a "Live Processing" szöveg mellett */}
            {isStreaming && (
              <span className="flex items-center gap-2 text-xs font-medium text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                <div className="loader" style={{ width: '14px', height: '14px' }}>
                  <svg viewBox="0 0 100 100">
                    <circle className="loader-circle circle-1" cx="50" cy="50" r="40" />
                    <circle className="loader-circle circle-2" cx="50" cy="50" r="30" />
                  </svg>
                </div>
                Live Processing
              </span>
            )}
          </div>
        </div>

        {job.status !== ResearchStatus.COMPLETED && (
          <div className="mb-12 bg-[#111111] border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <ProgressTracker job={job} />
          </div>
        )}

        {job.status === ResearchStatus.FAILED && (
          <div className="px-5 py-4 bg-red-950/20 border border-red-900/50 rounded-xl">
            <p className="text-sm text-red-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Research failed. Please try a different query.
            </p>
          </div>
        )}

        {job.status === ResearchStatus.COMPLETED && job.finalReport && (
          <div className="bg-[#111111] border border-zinc-800 rounded-3xl p-8 shadow-2xl mt-8">
            <ReportViewer
              report={job.finalReport}
              criticNotes={job.criticNotes}
              results={job.researchResults}
              query={job.query}
            />
          </div>
        )}
      </div>
    </main>
  );
}