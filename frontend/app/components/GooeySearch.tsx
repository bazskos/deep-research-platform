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
          height: 90px; /* Megnövelt magasság, hogy elférjen a nagyobb effekt */
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }
        .gooey-background-layer {
          position: absolute;
          top: -10px; left: -10px; right: -10px; bottom: -10px;
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
          width: 180px; height: 90px; /* Nagyobb blobok */
          left: 0; top: 0;
          animation: blob-float 6s infinite alternate ease-in-out;
        }
        .blob-2 {
          width: 160px; height: 90px;
          right: 0; top: 0;
          background: linear-gradient(135deg, #d946ef, #8b5cf6);
          animation: blob-float 8s infinite alternate-reverse ease-in-out;
        }
        .blob-3 {
          width: 260px; height: 90px;
          left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          opacity: 0.9;
        }
        .blob-bridge {
          position: absolute;
          height: 50px; width: 85%;
          left: 7.5%; top: 20px;
          background: #8b5cf6;
          border-radius: 40px;
        }
        .input-overlay {
          position: relative;
          z-index: 10;
          width: 96%;
          height: 60px; /* Kicsit vastagabb sáv */
          background: rgba(15, 16, 20, 0.85); /* SÖTÉT ÜVEG a tökéletes kontrasztért */
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15); /* Finomabb keret */
          border-radius: 30px;
          display: flex;
          align-items: center;
          padding: 0 8px 0 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .search-orb-container:focus-within .input-overlay {
          transform: translateY(-4px);
          background: rgba(15, 16, 20, 0.95);
          border-color: rgba(168, 85, 247, 0.5); /* Lila fényű keret aktív állapotban */
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(168, 85, 247, 0.2);
        }
        .search-orb-container:focus-within .blob-1 {
          transform: scale(1.2) translateX(-25px);
          filter: brightness(1.25);
        }
        .search-orb-container:focus-within .blob-2 {
          transform: scale(1.2) translateX(25px);
          filter: brightness(1.25);
        }
        .focus-indicator {
          position: absolute;
          bottom: 0; left: 50%;
          width: 0%;
          height: 2px;
          background: #d946ef; /* Lila indikátor */
          transform: translateX(-50%);
          transition: width 0.4s ease;
          border-radius: 2px;
          box-shadow: 0 0 15px rgba(217, 70, 239, 0.6);
        }
        .search-orb-container:focus-within .focus-indicator {
          width: 50%;
        }
        .modern-input {
          background: transparent;
          border: none;
          outline: none;
          flex: 1;
          color: white; /* Vakítóan fehér beírt szöveg */
          font-size: 16px;
          font-weight: 600;
          padding-left: 14px;
          letter-spacing: 0.02em;
        }
        .modern-input::placeholder {
          color: rgba(255, 255, 255, 0.7); /* Sokkal világosabb placeholder */
          font-weight: 500;
        }
        .modern-input:disabled {
          opacity: 0.5;
        }
        .submit-btn {
          shrink: 0;
          padding: 10px 22px;
          background: rgba(168, 85, 247, 0.15); /* Halvány lila gomb */
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 24px;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          letter-spacing: 0.03em;
        }
        .submit-btn:hover:not(:disabled) {
          background: rgba(168, 85, 247, 0.3);
          border-color: rgba(168, 85, 247, 0.6);
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
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
            transform: translate(8px, -8px);
          }
          100% {
            border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%;
            transform: translate(-8px, 8px);
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
            <div className="flex items-center justify-center text-white shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
      <div className="flex gap-3 mt-8">
        {Object.values(DepthLevel).map((d) => (
          <button
            key={d}
            onClick={() => setDepth(d)}
            type="button"
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
              depth === d
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                : 'bg-zinc-900/80 text-zinc-400 border border-zinc-700 hover:bg-zinc-800 hover:text-white hover:scale-105 active:scale-95'
            }`}
          >
            {d === DepthLevel.QUICK ? '⚡ Quick' : '🔬 Deep'}
          </button>
        ))}
      </div>
    </div>
  );
}