'use client';

import { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel, onConfirm]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-sm bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-800/50 flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </div>

        {/* Text */}
        <h3 className="text-white font-bold text-center text-xl mb-2">
          {title}
        </h3>
        <p className="text-zinc-400 text-sm text-center mb-8 font-medium">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer flex-1 px-4 py-3 rounded-xl text-sm font-bold text-zinc-300 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:text-white hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            Delete
          </button>
        </div>

        {/* Hint */}
        <p className="text-zinc-500 text-xs text-center mt-4 font-medium">
          Press <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-400">Enter</kbd> to confirm or <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-400">Esc</kbd> to cancel
        </p>
      </div>
    </div>
  );
}