'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllResearch, deleteResearch } from '@/lib/api';
import ConfirmModal from '@/app/components/ConfirmModal';
import { ResearchJob, DepthLevel } from '@/types/research';
import GooeySearch from '@/app/components/GooeySearch';
import HistoryList from '@/app/components/HistoryList';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [depth, setDepth] = useState<DepthLevel>(DepthLevel.QUICK);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ResearchJob[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getAllResearch();
      setHistory(
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch {
      // Backend not available yet
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, depth }),
      });

      if (!response.ok) throw new Error('Failed to start research');

      const data = await response.json();
      router.push(`/research/${data.id}`);
    } catch {
      alert('An error occurred with the server.');
      setIsLoading(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteTarget(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteResearch(deleteTarget);
      setHistory((prev) => prev.filter((j) => j.id !== deleteTarget));
    } catch {
      // silent fail
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center pt-32 pb-16 px-4">
      <div className="w-full flex flex-col items-center gap-8">
        <div className="text-center space-y-4 mb-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            What shall we{' '}
            <span className="text-[#a855f7]">research?</span>
          </h1>
        </div>

        <GooeySearch
          query={query}
          setQuery={setQuery}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          depth={depth}
          setDepth={setDepth}
        />

        <HistoryList
          history={history}
          onDelete={handleDelete}
        />
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Research"
        message="Are you sure you want to delete this research? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </main>
  );
}