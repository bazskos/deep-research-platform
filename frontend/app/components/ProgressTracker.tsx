'use client';

import React from 'react';
import { BrainCircuit, Search, PenTool, SearchCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { ResearchStatus } from '../../types/research';

interface ProgressTrackerProps {
  status: ResearchStatus;
}

export default function ProgressTracker({ status }: ProgressTrackerProps) {
  const steps = [
    { id: ResearchStatus.PLANNING, label: 'Planning', icon: BrainCircuit, description: 'Breakdown into topics' },
    { id: ResearchStatus.RESEARCHING, label: 'Search', icon: Search, description: 'Colleting data from the web' },
    { id: ResearchStatus.WRITING, label: 'Writing', icon: PenTool, description: 'Writing a report' },
    { id: ResearchStatus.CRITIQUING, label: 'Criticism', icon: SearchCheck, description: 'Fact checking' },
    { id: ResearchStatus.COMPLETED, label: 'Done', icon: CheckCircle2, description: 'Report generated' },
  ];

  const currentIndex = steps.findIndex((s) => s.id === status);
  const isFailed = status === ResearchStatus.FAILED;

  return (
    <div className="w-full max-w-5xl mx-auto my-8">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        {}
        <div 
          className="absolute top-0 bottom-0 w-1/5 bg-indigo-500/10 blur-[60px] transition-all duration-1000 ease-in-out"
          style={{ left: `${(currentIndex / (steps.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
        />

        <div className="relative z-10 flex justify-between items-start">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex || status === ResearchStatus.COMPLETED;
            const isActive = index === currentIndex && !isFailed;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center relative w-full group">
                {}
                {index !== steps.length - 1 && (
                  <div className="absolute top-6 left-[50%] w-full h-[2px] bg-slate-800/50">
                    <div 
                      className={`h-full transition-all duration-700 ease-in-out ${isCompleted ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-transparent w-0'}`}
                      style={{ width: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                )}

                {}
                <div 
                  className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10
                    ${isCompleted 
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                      : isActive 
                        ? 'bg-slate-800 border-indigo-400 text-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.6)] ring-4 ring-indigo-500/20' 
                        : isFailed && index === currentIndex
                          ? 'bg-red-900/50 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                          : 'bg-slate-900/50 border-slate-700 text-slate-500'
                    }
                  `}
                >
                  {isFailed && index === currentIndex ? (
                    <AlertCircle className="w-5 h-5 animate-pulse" />
                  ) : isActive ? (
                    <Icon className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {}
                <div className="mt-4 flex flex-col items-center text-center">
                  <span className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-indigo-300' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest hidden sm:block">
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}