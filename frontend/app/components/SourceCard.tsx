import { Source } from '@/types/research';

interface SourceCardProps {
  source: Source;
  index: number;
}

export default function SourceCard({ source }: SourceCardProps) {
  const domain = new URL(source.url).hostname.replace('www.', '');
  const score = source.relevanceScore
    ? Math.round(source.relevanceScore * 100)
    : null;

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-zinc-200 font-medium truncate group-hover:text-white transition-colors">
            {source.title}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">{domain}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {score && (
            <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">
              {score}%
            </span>
          )}
          <span className="text-zinc-600 text-xs">↗</span>
        </div>
      </div>
    </a>
  );
}