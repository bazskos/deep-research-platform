'use client';

import React from 'react';
import { DepthLevel } from '@/types/research';

interface GooeySearchProps {
  query: string;
  setQuery: (val: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  depth: DepthLevel;
  setDepth: (val: DepthLevel) => void;
}

export default function GooeySearch({
  query,
  setQuery,
  isLoading,
  onSubmit,
  depth,
  setDepth,
}: GooeySearchProps) {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <style>{`
        .search-orb-container {
          position: relative;
          width: 100%;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }
        .gooey-background-layer {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          filter: url("#enhanced-goo");
          z-index: 1;
        }
        .blob {
          position: absolute;
          background: linear-gradient(135deg, #6366f1, #d946ef);
          border-radius: 50%;
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .blob-1 {
          width: 140px; height: 72px;
          left: 0; top: 0;
          animation: blob-float 6s infinite alternate ease-in-out;
        }
        .blob-2 {
          width: 120px; height: 72px;
          right: 0; top: 0;
          background: linear-gradient(135deg, #d946ef, #8b5cf6);
          animation: blob-float 8s infinite alternate-reverse ease-in-out;
        }
        .blob-3 {
          width: 200px; height: 72px;
          left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          opacity: 0.9;
        }
        .blob-bridge {
          position: absolute;
          height: 40px; width: 80%;
          left: 10%; top: 16px;
          background: #8b5cf6;
          border-radius: 40px;
        }
        .input-overlay {
          position: relative;
          z-index: 10;
          width: 94%;
          height: 52px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 26px;
          display: flex;
          align-items: center;
          padding: 0 8px 0 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .search-orb-container:focus-within .input-overlay {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
        }
        .search-orb-container:focus-within .blob-1 {
          transform: scale(1.15) translateX(-20px);
          filter: brightness(1.2);
        }
        .search-orb-container:focus-within .blob-2 {
          transform: scale(1.15) translateX(20px);
          filter: brightness(1.2);
        }
        .focus-indicator {
          position: absolute;
          bottom: 0; left: 50%;
          width: 0%;
          height: 2px;
          background: white;
          transform: translateX(-50%);
          transition: width 0.4s ease;
          border-radius: 2px;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        }
        .search-orb-container:focus-within .focus-indicator {
          width: 40%;
        }
        .modern-input {
          background: transparent;
          border: none;
          outline: none;
          flex: 1;
          color: white;
          font-size: 15px;
          font-weight: 500;
          padding-left: 12px;
          letter-spacing: 0.02em;
        }
        .modern-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 400;
        }
        .modern-input:disabled {
          opacity: 0.5;
        }
        .submit-btn {
          shrink: 0;
          padding: 8px 18px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          letter-spacing: 0.03em;
        }
        .submit-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.4);
        }
        .submit-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        @keyframes blob-float {
          0% {
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
            transform: translate(0, 0);
          }
          50% {
            border-radius: 60% 40% 50% 50% / 30% 60% 40% 70%;
            transform: translate(5px, -5px);
          }
          100% {
            border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%;
            transform: translate(-5px, 5px);
          }
        }
      `}</style>

      <form onSubmit={onSubmit} className="w-full">
        <div className="search-orb-container">
          {/* Gooey blobs */}
          <div className="gooey-background-layer">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
            <div className="blob-bridge" />
          </div>

          {/* Input overlay */}
          <div className="input-overlay">
            <div className="flex items-center justify-center opacity-80 text-white shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to research?"
              disabled={isLoading}
              className="modern-input"
            />

            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="submit-btn"
            >
              {isLoading ? 'Starting...' : 'Research →'}
            </button>

            <div className="focus-indicator" />
          </div>

          {/* SVG filter */}
          <svg
            style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="enhanced-goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                  result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>
        </div>
      </form>

      {/* Depth selector */}
      <div className="flex gap-3 mt-6">
        {Object.values(DepthLevel).map((d) => (
          <button
            key={d}
            onClick={() => setDepth(d)}
            type="button"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              depth === d
                ? 'bg-white text-black shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100'
            }`}
          >
            {d === DepthLevel.QUICK ? '⚡ Quick' : '🔬 Deep'}
          </button>
        ))}
      </div>
    </div>
  );
}