Below is a minimal, runnable starter you can paste into a fresh folder. It includes:
- Chrome MV3 extension (popup + content script + background)
- Next.js (App Router) API backend with `/api/rewrite` proxying to OpenAI
- Mock auth (JWT) + simple free-tier quota
- Env examples + run instructions

> ⚠️ Notes
> - This is a learning starter; tighten security & error handling before production.
> - We **don’t store** CV/Job text by default (only usage metrics). Adjust as needed.
> - Replace any placeholder domains and secrets.

---

# 1) Folder Structure
```
job-tailor/
  backend/
    app/
      api/
        rewrite/route.ts
        auth/issue-token/route.ts
      layout.tsx
      page.tsx
    lib/
      auth.ts
      usage.ts
      db.ts
    package.json
    next.config.mjs
    tsconfig.json
    .env.local.example
    README.md
  extension/
    manifest.json
    background.js
    content/
      grab.js
    popup/
      index.html
      popup.js
    options/
      index.html
      options.js
    assets/
      icon16.png
      icon48.png
      icon128.png
    package.json (optional if bundling)
  README.md
```

---

# 2) Backend (Next.js 14, App Router)

## `backend/package.json`
```json
{
  "name": "job-tailor-backend",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "jsonwebtoken": "^9.0.2",
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "zod": "^3.23.8"
  }
}
```

## `backend/next.config.mjs`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { typedRoutes: true },
};
export default nextConfig;
```

## `backend/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es2020"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "baseUrl": "."
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## `backend/.env.local.example`
```
OPENAI_API_KEY=sk-your-openai-key
JWT_SECRET=dev-super-secret
ORIGIN_EXTENSION_ID=__YOUR_EXTENSION_ID__
FREE_DAILY_REWRITES=3
```

## `backend/app/layout.tsx`
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
```

## `backend/app/page.tsx`
```tsx
export default function Page(){
  return <main style={{padding:20}}>
    <h1>Job Tailor Backend</h1>
    <p>API endpoints: <code>/api/auth/issue-token</code>, <code>/api/rewrite</code></p>
  </main>;
}
```

## `backend/lib/db.ts`
```ts
// Minimal in-memory usage store for MVP. Replace with a real DB later.

export type Usage = { userId: string; dateISO: string; count: number; tokensIn: number; tokensOut: number };
const usage: Usage[] = [];

export const db = {
  addUsage(u: Usage){ usage.push(u); },
  getTodayCount(userId: string){
    const today = new Date().toDateString();
    return usage.filter(x => x.userId===userId && new Date(x.dateISO).toDateString()===today)
                .reduce((a,b)=>a+b.count, 0);
  }
};
```

## `backend/lib/auth.ts`
```ts
import jwt from 'jsonwebtoken';

export type UserPayload = { id: string; email: string; plan: 'free'|'pro' };

export function signToken(user: UserPayload){
  return jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '30d' });
}

export function verifyAuth(authorization: string | null){
  if (!authorization?.startsWith('Bearer ')) return { ok:false as const };
  const token = authorization.split(' ')[1];
  try{
    const user = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    return { ok:true as const, user };
  }catch{
    return { ok:false as const };
  }
}
```

## `backend/lib/usage.ts`
```ts
import { db } from './db';

export function checkQuota(userId: string, plan: 'free'|'pro'){
  if (plan==='pro') return true;
  const freeLimit = Number(process.env.FREE_DAILY_REWRITES ?? '3');
  const todayCount = db.getTodayCount(userId);
  return todayCount < freeLimit;
}

export function recordUsage(userId: string, tokensIn: number, tokensOut: number){
  db.addUsage({ userId, dateISO: new Date().toISOString(), count: 1, tokensIn, tokensOut });
}
```

## `backend/app/api/auth/issue-token/route.ts`
```ts
import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

// Issues a demo token for a given email (no password, MVP). Lock down for production.
export async function POST(req: NextRequest){
  const { email } = await req.json();
  if (!email || typeof email !== 'string')
    return NextResponse.json({ error: 'email_required' }, { status: 400 });

  const token = signToken({ id: email.toLowerCase(), email, plan: 'free' });
  return NextResponse.json({ token });
}
```

## `backend/app/api/rewrite/route.ts`
```ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth';
import { checkQuota, recordUsage } from '@/lib/usage';

const Schema = z.object({
  jobDesc: z.string().min(50),
  cvText: z.string().min(50),
  tone: z.enum(['formal','casual','impact']).default('formal')
});

export async function POST(req: NextRequest){
  const auth = verifyAuth(req.headers.get('authorization'));
  if (!auth.ok) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  const { jobDesc, cvText, tone } = Schema.parse(body);

  if (!checkQuota(auth.user.id, auth.user.plan))
    return NextResponse.json({ error: 'quota_exceeded' }, { status: 402 });

  const messages = [
    { role: 'system', content: 'You are an expert resume editor. Keep factual accuracy. Output only revised CV text.' },
    { role: 'user', content: `TONE=${tone}\nJOB_DESCRIPTION:\n${jobDesc}\n\nCURRENT_CV:\n${cvText}` }
  ];

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY!}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: 'gpt-4o-mini', temperature: 0.3, messages })
  });

  if (!r.ok){
    const detail = await r.text();
    return NextResponse.json({ error: 'llm_failed', detail }, { status: 500 });
  }
  const data = await r.json();
  const revised = data.choices?.[0]?.message?.content ?? '';

  // naive token estimate
  const inTokens = Math.ceil((jobDesc.length + cvText.length)/4);
  const outTokens = Math.ceil(revised.length/4);
  recordUsage(auth.user.id, inTokens, outTokens);

  return NextResponse.json({ revised });
}
```

---

# 3) Chrome Extension (MV3)

## `extension/manifest.json`
```json
{
  "manifest_version": 3,
  "name": "Job Tailor",
  "version": "0.1.0",
  "action": { "default_title": "Job Tailor", "default_popup": "popup/index.html" },
  "options_page": "options/index.html",
  "background": { "service_worker": "background.js" },
  "permissions": ["storage", "activeTab", "scripting", "clipboardWrite"],
  "host_permissions": ["https://YOUR_BACKEND_DOMAIN/*"],
  "content_scripts": [
    {
      "matches": ["*://*.linkedin.com/*", "*://*.indeed.com/*", "*://*.kariyer.net/*"],
      "js": ["content/grab.js"],
      "run_at": "document_idle"
    }
  ]
}
```

## `extension/background.js`
```js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Job Tailor installed');
});

// Optional: receive messages from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'JD_CAPTURED') {
    chrome.storage.local.set({ lastJD: msg.payload });
    sendResponse({ ok: true });
  }
});
```

## `extension/content/grab.js`
```js
(function(){
  function getJD(){
    // Try common selectors; extend per-site as needed
    const selectors = [
      '.jobs-description', // LinkedIn
      '#jobDescriptionText', // Indeed
      '.job-detail .job-description', // kariyer.net (example)
      'article', 'main'
    ];
    for (const s of selectors){
      const el = document.querySelector(s);
      if (el && el.innerText && el.innerText.length > 120) return el.innerText.trim();
    }
    return null;
  }
  function capture(){
    const jd = getJD();
    if (jd){
      chrome.runtime.sendMessage({ type: 'JD_CAPTURED', payload: jd });
    }
  }
  document.addEventListener('DOMContentLoaded', capture);
  setTimeout(capture, 1500);
})();
```

## `extension/popup/index.html`
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body{font-family:system-ui;margin:0;padding:12px;width:360px}
    textarea{width:100%;min-height:100px}
    .row{display:flex;gap:8px;margin-top:8px}
    button{padding:8px 10px;border-radius:8px;border:1px solid #ddd;cursor:pointer}
    .small{font-size:12px;color:#666}
  </style>
</head>
<body>
  <h3>Job Tailor</h3>
  <div class="small">Login with your email to get a token.</div>
  <div class="row">
    <input id="email" placeholder="you@example.com" style="flex:1" />
    <button id="login">Get Token</button>
  </div>

  <h4 style="margin-top:12px">Job Description</h4>
  <textarea id="jd" placeholder="Paste or auto-captured from tab..."></textarea>

  <h4>CV (Text)</h4>
  <textarea id="cv" placeholder="Paste your CV text here..."></textarea>

  <div class="row">
    <select id="tone">
      <option value="formal">Formal</option>
      <option value="casual">Casual</option>
      <option value="impact">Impact</option>
    </select>
    <button id="rewrite" style="flex:1">Rewrite Now</button>
  </div>

  <h4>Revised CV</h4>
  <textarea id="out" readonly></textarea>

  <div class="row">
    <button id="copy">Copy</button>
  </div>

  <script src="popup.js"></script>
</body>
</html>
```

## `extension/popup/popup.js`
```js
const API = 'https://YOUR_BACKEND_DOMAIN';

async function getToken(email){
  const r = await fetch(`${API}/api/auth/issue-token`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error||'token_failed');
  await chrome.storage.sync.set({ token: j.token, email });
  return j.token;
}

async function rewrite(jobDesc, cvText, tone){
  const { token } = await chrome.storage.sync.get(['token']);
  if (!token) throw new Error('not_logged_in');
  const r = await fetch(`${API}/api/rewrite`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` },
    body: JSON.stringify({ jobDesc, cvText, tone })
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error||'rewrite_failed');
  return j.revised;
}

async function loadAutoJD(){
  const s = await chrome.storage.local.get(['lastJD']);
  if (s.lastJD) document.getElementById('jd').value = s.lastJD;
}

window.addEventListener('DOMContentLoaded', async () => {
  loadAutoJD();
  document.getElementById('login').onclick = async () => {
    const email = document.getElementById('email').value.trim();
    try{ await getToken(email); alert('Token saved.'); }catch(e){ alert(e.message); }
  };
  document.getElementById('rewrite').onclick = async () => {
    const jd = document.getElementById('jd').value.trim();
    const cv = document.getElementById('cv').value.trim();
    const tone = document.getElementById('tone').value;
    try{
      document.getElementById('out').value = 'Working...';
      const out = await rewrite(jd, cv, tone);
      document.getElementById('out').value = out;
    }catch(e){
      document.getElementById('out').value = '';
      alert(e.message);
    }
  };
  document.getElementById('copy').onclick = async () => {
    const v = document.getElementById('out').value;
    await navigator.clipboard.writeText(v);
    alert('Copied!');
  };
});
```

## `extension/options/index.html`
```html
<!doctype html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
<body style="font-family:system-ui;padding:16px;">
  <h3>Job Tailor – Options</h3>
  <p>No options yet. Token is issued in popup.</p>
  <script src="options.js"></script>
</body>
</html>
```

## `extension/options/options.js`
```js
// Reserved for future settings
```

---

# 4) Run Instructions

## Backend
```bash
cd job-tailor/backend
cp .env.local.example .env.local
# edit .env.local with your keys and domain
npm i
npm run dev
# server at http://localhost:3000
```

## Extension (unpacked)
1. Chrome → `chrome://extensions`
2. Developer Mode → **ON**
3. Load unpacked → select `job-tailor/extension`
4. Click extension icon → enter email → Get Token
5. Open a LinkedIn/Indeed job page → popup should auto-fill Job Description if captured
6. Paste your CV text → **Rewrite Now**

> If CORS blocks requests locally: add `http://localhost:3000/*` to `host_permissions` and set proper CORS headers (or use a tunnel/domain). For production, deploy backend (e.g., Vercel) and update `API` URL in `popup.js`.

---

# 5) Hardening Checklist (next steps)
- Replace in-memory usage with a real DB (Supabase / Prisma Postgres)
- Stripe subscriptions → set `plan='pro'`
- Rate limiting (per user/IP) & request body size limit
- Hash+cache identical requests (jobDesc+cvText) for 5–10min
- Add `/api/export/docx` for server-side exports if needed
- Improve content selectors per job site & add clipboard fallback

---

İyi kodlamalar! Hazır olduğunda bu starter’ı genişletip Pro plana Stripe ekleyebiliriz. If you want, I can also provide a Prisma/Postgres schema + Stripe webhook skeleton next.

