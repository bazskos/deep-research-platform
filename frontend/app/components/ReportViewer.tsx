// frontend/components/ReportViewer.tsx

'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { ResearchResult } from '@/types/research';
import SourceCard from './SourceCard';

interface ReportViewerProps {
  report: string;
  criticNotes: string | null;
  results: ResearchResult[];
  query: string;
}

export default function ReportViewer({
  report,
  criticNotes,
  results,
  query,
}: ReportViewerProps) {
  const [html, setHtml] = useState('');
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  useEffect(() => {
    const parsed = marked(report);
    if (typeof parsed === 'string') {
      setHtml(parsed);
    } else {
      parsed.then(setHtml);
    }
  }, [report]);

  const allSources = results.flatMap((r) => r.sources);
  const uniqueSources = allSources.filter(
    (s, i, arr) => arr.findIndex((x) => x.url === s.url) === i,
  );

  const handleMarkdownDownload = () => {
    const sourceSection = uniqueSources.length > 0
      ? `\n\n## Sources\n\n${uniqueSources
          .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0))
          .map((s, i) => `${i + 1}. [${s.title}](${s.url})`)
          .join('\n')}`
      : '';

    const criticSection = criticNotes
      ? `\n\n## Quality Review\n\n${criticNotes}`
      : '';

    const fullMarkdown = `# ${query}\n\n${report}${criticSection}${sourceSection}`;
    const blob = new Blob([fullMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${query.slice(0, 50).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

const handlePdfDownload = async () => {
    setIsPdfLoading(true);
    try {
      const { jsPDF } = await import('jspdf');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let y = margin;

      const checkNewPage = (needed = 10) => {
        if (y + needed > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
      };

      const addHeading = (text: string, size: number) => {
        checkNewPage(size * 0.6 + 6);
        pdf.setFontSize(size);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(15, 15, 15);
        const lines = pdf.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          pdf.text(line, margin, y);
          y += size * 0.45;
        });
        y += 4;
      };

      const addParagraph = (text: string) => {
        const clean = text
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/`(.*?)`/g, '$1')
          .trim();
        if (!clean) return;
        checkNewPage(12);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(50, 50, 50);
        const lines = pdf.splitTextToSize(clean, maxWidth);
        lines.forEach((line: string) => {
          checkNewPage(6);
          pdf.text(line, margin, y);
          y += 5.5;
        });
        y += 2;
      };

      const addBullet = (text: string) => {
        const clean = text
          .replace(/^[-*]\s+/, '')
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .trim();
        checkNewPage(8);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(50, 50, 50);
        pdf.text('•', margin, y);
        const lines = pdf.splitTextToSize(clean, maxWidth - 6);
        lines.forEach((line: string) => {
          checkNewPage(6);
          pdf.text(line, margin + 6, y);
          y += 5.5;
        });
        y += 1;
      };

      const addLink = (title: string, url: string, index: number) => {
        checkNewPage(8);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(37, 99, 235);
        const label = `${index + 1}. ${title}`;
        const lines = pdf.splitTextToSize(label, maxWidth);
        pdf.text(lines[0], margin, y);
        pdf.link(margin, y - 4, maxWidth, 6, { url });
        y += 5.5;
      };

      const addDivider = () => {
        checkNewPage(8);
        pdf.setDrawColor(220, 220, 220);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 6;
      };

      addHeading(query, 20);
      addDivider();

      const lines = report.split('\n');
      for (const line of lines) {
        if (line.startsWith('# ')) {
          addHeading(line.replace(/^#\s+/, ''), 16);
        } else if (line.startsWith('## ')) {
          addHeading(line.replace(/^##\s+/, ''), 13);
        } else if (line.startsWith('### ')) {
          addHeading(line.replace(/^###\s+/, ''), 11);
        } else if (line.startsWith('#### ')) {
          addHeading(line.replace(/^####\s+/, ''), 10);
        } else if (line.match(/^[-*]\s+/)) {
          addBullet(line);
        } else if (line.trim() === '' || line.trim() === '---') {
          y += 3;
        } else {
          addParagraph(line);
        }
      }

      if (uniqueSources.length > 0) {
        y += 4;
        addDivider();
        addHeading('Sources', 13);
        const sorted = [...uniqueSources].sort(
          (a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0),
        );
        sorted.forEach((s, i) => addLink(s.title, s.url, i));
      }

      if (criticNotes) {
        y += 4;
        addDivider();
        addHeading('Quality Review', 13);
        addParagraph(criticNotes);
      }

      // Footer minden oldalra
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Generated by Deep Research Agent', margin, pageHeight - 10);
        pdf.text(`${i} / ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      const filename = `${query.slice(0, 50).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      pdf.save(filename);
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Export gombok */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleMarkdownDownload}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-700 rounded-xl hover:border-zinc-500 hover:text-white transition-all"
        >
          <span>↓</span>
          Markdown
        </button>
        <button
          onClick={handlePdfDownload}
          disabled={isPdfLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-700 rounded-xl hover:border-zinc-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>↓</span>
          {isPdfLoading ? 'Generating...' : 'PDF'}
        </button>
      </div>

{/* Report */}
      <div
        id="report-content"
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Critic notes */}
      {criticNotes && (
        <div className="px-5 py-4 bg-blue-950/30 border border-blue-800/50 rounded-xl">
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-2">
            Quality Review
          </p>
          <p className="text-sm text-zinc-300 whitespace-pre-line">
            {criticNotes}
          </p>
        </div>
      )}

      {/* Sources */}
      {uniqueSources.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
            Sources ({uniqueSources.length})
          </p>
          <div className="grid grid-cols-1 gap-2">
            {uniqueSources
              .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0))
              .map((source, i) => (
                <SourceCard key={source.url} source={source} index={i} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
