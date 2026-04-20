import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Deep Research Agent',
  description: 'AI-powered multi-agent research system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} bg-black text-white min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}