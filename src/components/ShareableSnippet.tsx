import React, { useMemo } from 'react';

interface ShareableSnippetProps {
  ideaTitle: string;
  score: number; // 0-100
  platforms: string[]; // top platforms
  dateISO?: string;
  siteUrl?: string; // e.g., https://validationly.com
  bullets?: string[]; // optional summary bullets to include in share text
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

function formatDate(iso?: string): string {
  try {
    const d = iso ? new Date(iso) : new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  } catch {
    return '';
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(/\s+/g);
  let line = '';
  const lines: Array<{ text: string; x: number; y: number }> = [];
  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push({ text: line, x, y });
      line = words[i];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  lines.push({ text: line, x, y });
  return lines;
}

const ShareableSnippet: React.FC<ShareableSnippetProps> = ({ ideaTitle, score, platforms, dateISO, siteUrl = 'https://validationly.com', bullets }) => {
  const dateStr = useMemo(() => formatDate(dateISO), [dateISO]);
  const text = useMemo(() => {
    const top = platforms.slice(0, 2).join(', ');
    const extra = (bullets && bullets.length > 0) ? `\n• ${bullets.slice(0,3).join('\n• ')}` : '';
    const msg = `I validated my idea with Validationly — score ${Math.round(score)}/100. Top platforms: ${top}.${extra}\nTry yours → ${siteUrl}?ref=share-snippet`;
    return msg;
  }, [score, platforms, siteUrl]);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  const handleTweet = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl + '?ref=share-snippet')}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleReddit = () => {
    const title = `Validated idea: ${ideaTitle} (Score ${Math.round(score)}/100)`;
    const body = text;
    const url = `https://www.reddit.com/submit?title=${encodeURIComponent(title)}&text=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-4xl mx-auto mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold">Shareable Result</h3>
          <div className="text-slate-300 text-sm">Share your validation summary</div>
        </div>
        <div className="text-xs text-slate-400">{dateStr}</div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleCopy} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:border-white/20">Copy Text</button>
        <button onClick={handleTweet} className="text-xs px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-600/30 text-blue-200 hover:bg-blue-600/25">Tweet</button>
        <button onClick={handleLinkedIn} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-600/30 text-indigo-200 hover:bg-indigo-600/25">LinkedIn</button>
        <button onClick={handleReddit} className="text-xs px-3 py-1.5 rounded-lg bg-orange-600/20 border border-orange-600/30 text-orange-200 hover:bg-orange-600/25">Reddit</button>
      </div>
    </div>
  );
};

export default ShareableSnippet;


