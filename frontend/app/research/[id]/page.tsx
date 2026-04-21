'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, FileText, ExternalLink, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getResearch } from '@/lib/api';
import { ResearchJob, ResearchStatus } from '@/types/research';
import ProgressTracker from '@/app/components/ProgressTracker';

export default function ResearchResultPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [research, setResearch] = useState<ResearchJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status mapping for the English badges
  const statusLabels: Record<string, string> = {
    [ResearchStatus.PENDING]: 'Pending',
    [ResearchStatus.PLANNING]: 'Planning',
    [ResearchStatus.RESEARCHING]: 'Researching',
    [ResearchStatus.WRITING]: 'Writing',
    [ResearchStatus.CRITIQUING]: 'Critiquing',
    [ResearchStatus.COMPLETED]: 'Completed',
    [ResearchStatus.FAILED]: 'Failed',
  };

  useEffect(() => {
    if (!id) return;

    let interval: NodeJS.Timeout;

    const fetchResearchData = async () => {
      try {
        const data: ResearchJob = await getResearch(id as string);   
        setResearch(data);
        setIsLoading(false);

        // If the process is finished (Success or Fail), stop polling
        if (data.status === ResearchStatus.COMPLETED || data.status === ResearchStatus.FAILED) {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error fetching research:', err);
        setError('Failed to load research data. Please try again later.');
        setIsLoading(false);
        clearInterval(interval);
      }
    };

    // Initial fetch
    fetchResearchData();

    // Start polling every 2 seconds to update the ProgressTracker in real-time
    interval = setInterval(fetchResearchData, 2000);

    return () => clearInterval(interval);
  }, [id]);

  const downloadMarkdown = () => {
    if (!research?.finalReport) return;
    
    const blob = new Blob([research.finalReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `research-${research.query.substring(0, 20).replace(/[^a-z0-9]/gi, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1014] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Loading research results...</p>
      </div>
    );
  }

  if (error || !research) {
    return (
      <div className="min-h-screen bg-[#0f1014] flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-slate-400 mb-8">{error}</p>
        <button 
          onClick={() => router.push('/')}
          className="flex items-center text-slate-400 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-300 mb-8 group w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to search
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1014] text-slate-200 font-sans pb-20">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-12">
        {/* Header Section */}
        <button 
          onClick={() => router.push('/')}
          className="flex items-center text-slate-400 hover:text-white hover:bg-white/10 px-4 py-2 -ml-4 rounded-xl transition-all duration-300 mb-8 group w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to search
        </button>

        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight pr-12">
          {research.query}
        </h1>

        <div className="flex flex-wrap items-center gap-3 mb-12">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
            research.status === ResearchStatus.FAILED 
              ? 'bg-red-500/10 border-red-500/30 text-red-400' 
              : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
          }`}>
            {statusLabels[research.status]}
          </span>
          <div className="flex items-center text-slate-500 text-xs font-bold uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-ping"></div>
            Live AI Processing
          </div>
        </div>

        {/* The Animated Progress Tracker */}
        <ProgressTracker status={research.status} />

        {/* Report Content */}
        <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative">
            {research.status === ResearchStatus.COMPLETED && research.finalReport ? (
            <div className="glass-panel p-8 md:p-12 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
              
              {/* ACTION BUTTONS (DOWNLOAD/PRINT) */}
              <div className="flex justify-end flex-wrap gap-3 mb-6 print:hidden">
                <button
                  onClick={downloadMarkdown}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-lg backdrop-blur-md shrink-0"
                >
                  <FileText className="w-4 h-4 mr-2" /> MD Download
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-lg backdrop-blur-md shrink-0"
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Save as PDF
                </button>
              </div>

              {/* REPORT CONTENT */}
              <div className="markdown-body">
                <ReactMarkdown>{research.finalReport}</ReactMarkdown>
              </div>
            </div>

          ) : research.status === ResearchStatus.FAILED ? (
            <div className="text-center py-20 bg-red-500/5 rounded-[40px] border border-red-500/10">
              <p className="text-red-400 font-medium">The research failed to generate a final report.</p>
            </div>
          ) : (
            <div className="text-center py-24 bg-white/5 rounded-[40px] border border-white/5 backdrop-blur-sm">
              <FileText className="w-16 h-16 text-slate-700 mx-auto mb-6" />
              <p className="text-slate-500 font-medium text-lg">
                Your detailed report is being generated...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}