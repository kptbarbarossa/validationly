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

async function renderPngCard(opts: { ideaTitle: string; score: number; platforms: string[]; dateStr: string; siteUrl: string }): Promise<string> {
  const width = 1200; // OG-friendly
  const height = 630;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // Background gradient
  const g = ctx.createLinearGradient(0, 0, width, height);
  g.addColorStop(0, '#0f172a');
  g.addColorStop(1, '#111827');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);

  // Spotlight circles
  const r1 = ctx.createRadialGradient(250, 200, 50, 250, 200, 380);
  r1.addColorStop(0, 'rgba(99,102,241,0.35)');
  r1.addColorStop(1, 'rgba(99,102,241,0)');
  ctx.fillStyle = r1;
  ctx.beginPath(); ctx.arc(250, 200, 380, 0, Math.PI * 2); ctx.fill();
  const r2 = ctx.createRadialGradient(900, 480, 50, 900, 480, 420);
  r2.addColorStop(0, 'rgba(34,211,238,0.35)');
  r2.addColorStop(1, 'rgba(34,211,238,0)');
  ctx.fillStyle = r2;
  ctx.beginPath(); ctx.arc(900, 480, 420, 0, Math.PI * 2); ctx.fill();

  // Title
  ctx.fillStyle = '#e5e7eb';
  ctx.font = 'bold 44px Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI';
  const title = opts.ideaTitle || 'Your startup idea';
  wrapText(ctx, title, 80, 160, 820, 52).forEach(l => ctx.fillText(l.text, l.x, l.y));

  // Score badge
  const score = Math.max(0, Math.min(100, Math.round(opts.score)));
  const badgeText = `Score ${score}/100`;
  ctx.font = 'bold 32px Inter, ui-sans-serif';
  const bw = ctx.measureText(badgeText).width + 40;
  ctx.fillStyle = 'rgba(56,189,248,0.15)';
  ctx.strokeStyle = 'rgba(56,189,248,0.35)';
  const bx = 80, by = 220, bh = 56;
  ctx.beginPath(); ctx.roundRect?.(bx, by, bw, bh, 14);
  if (!ctx.roundRect) { ctx.rect(bx, by, bw, bh); }
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#93c5fd';
  ctx.fillText(badgeText, bx + 20, by + 38);

  // Platforms
  ctx.font = 'bold 26px Inter, ui-sans-serif';
  ctx.fillStyle = '#a7f3d0';
  const pf = `Top platforms: ${opts.platforms.slice(0, 3).join(', ') || 'X, Reddit, LinkedIn'}`;
  ctx.fillText(pf, 80, 300);

  // Footer
  ctx.font = '22px Inter, ui-sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(`Validated with Validationly • ${opts.dateStr}`, 80, height - 100);
  ctx.fillStyle = '#93c5fd';
  ctx.fillText(opts.siteUrl, 80, height - 60);

  return canvas.toDataURL('image/png');
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

  const handleDownloadPng = async () => {
    try {
      const dataUrl = await renderPngCard({ ideaTitle, score, platforms, dateStr, siteUrl });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'validationly-snippet.png';
      a.click();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-4xl mx-auto mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold">Shareable Result</h3>
          <div className="text-slate-300 text-sm">Share your validation summary as an image or a post</div>
        </div>
        <div className="text-xs text-slate-400">{dateStr}</div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleDownloadPng} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:border-white/20">Download PNG</button>
        <button onClick={handleCopy} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:border-white/20">Copy Text</button>
        <button onClick={handleTweet} className="text-xs px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-600/30 text-blue-200 hover:bg-blue-600/25">Tweet</button>
        <button onClick={handleLinkedIn} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-600/30 text-indigo-200 hover:bg-indigo-600/25">LinkedIn</button>
      </div>
    </div>
  );
};

export default ShareableSnippet;


