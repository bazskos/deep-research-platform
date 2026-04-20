'use client';

import { ResearchJob, ResearchStatus } from '@/types/research';

interface ProgressTrackerProps {
  job: ResearchJob;
}

const STEPS = [
  { status: ResearchStatus.PLANNING, label: 'Planning', icon: '🧠' },
  { status: ResearchStatus.RESEARCHING, label: 'Researching', icon: '🔎' },
  { status: ResearchStatus.WRITING, label: 'Writing', icon: '🧾' },
  { status: ResearchStatus.CRITIQUING, label: 'Reviewing', icon: '✅' },
];

const STATUS_ORDER = [
  ResearchStatus.PENDING,
  ResearchStatus.PLANNING,
  ResearchStatus.RESEARCHING,
  ResearchStatus.WRITING,
  ResearchStatus.CRITIQUING,
  ResearchStatus.COMPLETED,
];

function getStepState(
  stepStatus: ResearchStatus,
  currentStatus: ResearchStatus,
): 'done' | 'active' | 'pending' {
  const stepIdx = STATUS_ORDER.indexOf(stepStatus);
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  if (currentStatus === ResearchStatus.COMPLETED) return 'done';
  if (currentIdx > stepIdx) return 'done';
  if (currentIdx === stepIdx) return 'active';
  return 'pending';
}

export default function ProgressTracker({ job }: ProgressTrackerProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Steps */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, i) => {
          const state = getStepState(step.status, job.status);
          return (
            <div key={step.status} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                    state === 'done'
                      ? 'bg-green-500 text-white'
                      : state === 'active'
                        ? 'bg-white text-black animate-pulse'
                        : 'bg-zinc-800 text-zinc-600'
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`text-xs font-medium ${
                    state === 'active'
                      ? 'text-white'
                      : state === 'done'
                        ? 'text-green-400'
                        : 'text-zinc-600'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 transition-all ${
                    getStepState(STEPS[i + 1].status, job.status) !== 'pending' ||
                    job.status === ResearchStatus.COMPLETED
                      ? 'bg-green-500'
                      : 'bg-zinc-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Subtasks - JAVÍTOTT RÉSZ */}
      {(job.subTasks?.length ?? 0) > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
            Research subtasks
          </p>
          {job.subTasks?.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                task.completed
                  ? 'border-green-800 bg-green-950/30'
                  : 'border-zinc-800 bg-zinc-900/50'
              }`}
            >
              <span className="text-sm">
                {task.completed ? '✅' : '⏳'}
              </span>
              <span
                className={`text-sm ${
                  task.completed ? 'text-zinc-300' : 'text-zinc-500'
                }`}
              >
                {task.topic}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}