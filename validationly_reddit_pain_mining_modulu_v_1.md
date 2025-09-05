# Validationly – Reddit Pain Mining Modülü (v1)

> **Not:** Bu sayfa güncellendi. Aşağıda, Reddit pain mining’i **ayrı bir modül** olarak değil, Validationly’nin **ana doğrulama (validate) motoruna entegre bir sinyal sağlayıcısı** olarak kullanacağın mimari, skorlama formülü ve API sözleşmesi yer alıyor (bkz. Bölüm 23+).

# Validationly – Reddit Pain Mining Modülü (v1)

Bu doküman, **Reddit temelli pain mining** akışını Validationly.com’da uçtan uca kurman için gerekli **mimari, DB şeması, kod örnekleri, cron stratejisi ve prompt** şablonlarını içerir. Hedef: “Gold Mining Framework”ün **tam otomatik** bir sürümünü kurmak.

---

## 0) Özet Akış
1. **İçerik Toplama (Ingestion)**  
   - Kaynak: Reddit (subreddit, arama terimi, zaman aralığı).  
   - Yöntem: Resmi Reddit API (`praw`) + gerektiğinde Pushshift fallback (opsiyonel).  
   - Kayıt: Ham post + yorumlar Supabase’e yazılır.
2. **Ön-İşleme**  
   - Normalizasyon, dil tespiti, temel temizlik, URL/emoji/mention temizleme.  
   - Deduplication (MinHash/SimHash)
3. **Analiz**  
   - Pain point çıkarımı (LLM), konu modelleme (TF-IDF + KMeans/HDBSCAN), duygu analizi.  
   - Cluster -> Insight -> Öneri (idea) üretimi.  
4. **Skorlama & Validasyon**  
   - Sıklık, momentum (zaman ağırlığı), etkileşim (upvote/comment), rekabet (basit SERP sayımı), arama hacmi (isteğe bağlı).  
5. **Çıktı**  
   - “Idea Cards” (title, value prop, ICP, pain, alt features, risk),  
   - “Landing Copy” (hero, subheader, CTA, proof points),  
   - Export (CSV/JSON) + UI listeleme.

---

## 1) Supabase Şeması

```sql
-- reddit kaynaklı ham içerikler
create table if not exists reddit_posts (
  id uuid primary key default gen_random_uuid(),
  reddit_id text unique not null,
  subreddit text not null,
  title text not null,
  selftext text,
  author text,
  url text,
  score int,
  num_comments int,
  created_utc timestamptz not null,
  fetched_at timestamptz not null default now(),
  lang text,
  raw jsonb
);

create table if not exists reddit_comments (
  id uuid primary key default gen_random_uuid(),
  reddit_id text unique not null,
  post_reddit_id text not null references reddit_posts(reddit_id) on delete cascade,
  body text,
  author text,
  score int,
  created_utc timestamptz not null,
  fetched_at timestamptz not null default now(),
  lang text,
  raw jsonb
);

-- normalize edilmiş dokümanlar (post + yorum birleşik)
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('reddit')),
  source_id text not null unique, -- reddit_id
  subreddit text,
  title text,
  content text not null,
  created_utc timestamptz not null,
  score int,
  num_comments int,
  lang text,
  hash_lexical text, -- dedup için
  inserted_at timestamptz not null default now()
);

-- LLM analiz çıktıları
create table if not exists insights (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  pain_points jsonb,        -- [{pain, severity, who, quote}]
  sentiment text,           -- positive/neutral/negative
  clusters text[],          -- ['grading','lesson-planning']
  summary text,
  ideas jsonb,              -- [{title, value_prop, features, risks, icp}]
  created_at timestamptz not null default now()
);

-- Skorlama ve trendler
create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  freq_score float,
  momentum_score float,
  engagement_score float,
  competition_score float,
  total_score float,
  created_at timestamptz not null default now()
);
```

> Not: `hash_lexical` için MinHash/SimHash çıktısı saklayacağız.

---

## 2) Ingestion – Python (Reddit API + Supabase)

`/ingestion/reddit_ingest.py`

```python
import os, time, hashlib
from datetime import datetime, timezone
from typing import List, Dict
import praw
import psycopg
from psycopg.rows import dict_row

REDDIT_CLIENT_ID = os.getenv('REDDIT_CLIENT_ID')
REDDIT_SECRET = os.getenv('REDDIT_SECRET')
REDDIT_USER_AGENT = os.getenv('REDDIT_USER_AGENT', 'validationly-bot/1.0')
SUPABASE_CONN = os.getenv('SUPABASE_PG_CONN')  # e.g. postgres://user:pass@host:6543/db

# basit lexical hash (alternatif: datasketch MinHash)
def lexical_hash(text: str) -> str:
    norm = ' '.join((text or '').lower().split())[:8000]
    return hashlib.sha1(norm.encode('utf-8')).hexdigest()


def upsert_post(conn, p):
    with conn.cursor() as cur:
        cur.execute(
            """
            insert into reddit_posts (reddit_id, subreddit, title, selftext, author, url, score, num_comments, created_utc, raw)
            values (%s,%s,%s,%s,%s,%s,%s,%s,to_timestamp(%s),%s)
            on conflict (reddit_id) do update set
              score = excluded.score,
              num_comments = excluded.num_comments
            returning reddit_id
            """,
            (
                p.id,
                p.subreddit.display_name,
                p.title,
                getattr(p, 'selftext', None),
                str(p.author) if p.author else None,
                p.url,
                p.score,
                p.num_comments,
                int(p.created_utc),
                {
                    'over_18': getattr(p, 'over_18', None),
                    'permalink': getattr(p, 'permalink', None),
                }
            )
        )
        return cur.fetchone()[0]


def upsert_comment(conn, c, post_id):
    with conn.cursor() as cur:
        cur.execute(
            """
            insert into reddit_comments (reddit_id, post_reddit_id, body, author, score, created_utc, raw)
            values (%s,%s,%s,%s,%s,to_timestamp(%s),%s)
            on conflict (reddit_id) do update set score = excluded.score
            returning reddit_id
            """,
            (
                c.id,
                post_id,
                getattr(c, 'body', None),
                str(c.author) if c.author else None,
                c.score,
                int(c.created_utc),
                {}
            )
        )
        return cur.fetchone()[0]


def build_document(conn, post, comments_text: List[str]):
    content = (post.selftext or '') + "\n\n" + "\n".join(comments_text)
    h = lexical_hash(post.title + "\n" + content)
    with conn.cursor() as cur:
        cur.execute(
            """
            insert into documents (source, source_id, subreddit, title, content, created_utc, score, num_comments, hash_lexical)
            values ('reddit', %s, %s, %s, %s, to_timestamp(%s), %s, %s, %s)
            on conflict (source_id) do update set score = excluded.score, num_comments = excluded.num_comments
            returning id
            """,
            (
                post.id,
                post.subreddit.display_name,
                post.title,
                content[:50000],
                int(post.created_utc),
                post.score,
                post.num_comments,
                h
            )
        )
        return cur.fetchone()[0]


def ingest(subreddit: str, query: str = None, limit: int = 50, time_filter: str = 'month'):
    reddit = praw.Reddit(
        client_id=REDDIT_CLIENT_ID,
        client_secret=REDDIT_SECRET,
        user_agent=REDDIT_USER_AGENT,
    )

    conn = psycopg.connect(SUPABASE_CONN, row_factory=dict_row)

    try:
        if query:
            results = reddit.subreddit(subreddit).search(query=query, limit=limit, time_filter=time_filter)
        else:
            results = reddit.subreddit(subreddit).top(time_filter=time_filter, limit=limit)

        for p in results:
            post_id = upsert_post(conn, p)
            p.comments.replace_more(limit=0)
            comments_text = []
            for c in p.comments.list()[:200]:
                try:
                    upsert_comment(conn, c, p.id)
                    if c.body:
                        comments_text.append(c.body)
                except Exception:
                    continue
            build_document(conn, p, comments_text)
            conn.commit()
            time.sleep(0.5)  # API rate limit friendly
    finally:
        conn.close()

if __name__ == '__main__':
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('--subreddit', required=True)
    ap.add_argument('--query', default=None)
    ap.add_argument('--limit', type=int, default=50)
    ap.add_argument('--time_filter', default='month', choices=['day','week','month','year','all'])
    args = ap.parse_args()
    ingest(args.subreddit, args.query, args.limit, args.time_filter)
```

ENV değişkenleri: `REDDIT_CLIENT_ID`, `REDDIT_SECRET`, `REDDIT_USER_AGENT`, `SUPABASE_PG_CONN`.

---

## 3) Analiz – Python (LLM + Kümelendirme)

`/analysis/pain_mining.py`

```python
import os, json, math
from typing import List, Dict
import psycopg
from psycopg.rows import dict_row
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
SUPABASE_CONN = os.getenv('SUPABASE_PG_CONN')

PROMPT = """
You are a product researcher. Given a Reddit-derived document, extract:
1) Top pain points (list of objects: pain, who, severity 1-5, supporting_quote)
2) A concise summary (<= 80 words)
3) 3 business ideas (title, value_prop, key_features[3-5], risks[1-3], icp)
Return strict JSON with keys: pain_points, summary, ideas.
"""

# Minimal LLM client (OpenAI responses API). Alternatif: Anthropic/Claude
import requests

def call_llm(text: str) -> Dict:
    payload = {
        "model": "gpt-4o-mini",  # maliyet/dengeli
        "messages": [
            {"role": "system", "content": PROMPT},
            {"role": "user", "content": text[:12000]},
        ],
        "temperature": 0.2,
        "response_format": {"type": "json_object"}
    }
    r = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"},
        json=payload,
        timeout=60,
    )
    r.raise_for_status()
    return json.loads(r.json()["choices"][0]["message"]["content"])  # type: ignore


def fetch_documents(conn, limit=200):
    with conn.cursor() as cur:
        cur.execute("""
            select id, title, content, created_utc, score, num_comments from documents
            order by created_utc desc
            limit %s
        """, (limit,))
        return cur.fetchall()


def store_insight(conn, doc_id, data: Dict):
    with conn.cursor() as cur:
        cur.execute(
            """
            insert into insights (document_id, pain_points, summary, ideas)
            values (%s, %s, %s, %s)
            returning id
            """,
            (doc_id, json.dumps(data.get('pain_points', [])), data.get('summary',''), json.dumps(data.get('ideas', [])))
        )


def vector_cluster(texts: List[str], k: int = 12) -> List[int]:
    vec = TfidfVectorizer(max_df=0.6, min_df=3, ngram_range=(1,2))
    X = vec.fit_transform(texts)
    k = min(k, max(2, X.shape[0] // 20))
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    labels = km.fit_predict(X)
    return labels.tolist()


def run():
    conn = psycopg.connect(SUPABASE_CONN, row_factory=dict_row)
    try:
        docs = fetch_documents(conn, limit=300)
        texts = [ (d['title'] or '') + '\n' + (d['content'] or '') for d in docs ]
        labels = vector_cluster(texts, k=12)
        for d, lbl in zip(docs, labels):
            llm_out = call_llm((d['title'] or '') + "\n\n" + (d['content'] or ''))
            # cluster label'i string olarak ekle
            llm_out['clusters'] = [f"cluster_{lbl}"]
            store_insight(conn, d['id'], llm_out)
            conn.commit()
    finally:
        conn.close()

if __name__ == '__main__':
    run()
```

---

## 4) Skorlama (Basit Heuristik)

`/analysis/scoring.py`

```python
import math, psycopg, os
from psycopg.rows import dict_row

SUPABASE_CONN = os.getenv('SUPABASE_PG_CONN')

# parametreler
W_FREQ = 0.4
W_MOMENTUM = 0.2
W_ENG = 0.3
W_COMP = 0.1  # düşük rekabet = yüksek puan


def run():
    conn = psycopg.connect(SUPABASE_CONN, row_factory=dict_row)
    try:
        with conn.cursor() as cur:
            cur.execute("""
                with d as (
                  select d.id, d.created_utc, d.score, d.num_comments
                  from documents d
                  where d.created_utc > now() - interval '90 days'
                )
                select * from d
            """)
            rows = cur.fetchall()
        # min-max normalize helper
        if not rows: return
        s = [r['score'] or 0 for r in rows]
        c = [r['num_comments'] or 0 for r in rows]
        smin, smax = min(s), max(s)
        cmin, cmax = min(c), max(c)
        def norm(v, vmin, vmax):
            return 0 if vmax==vmin else (v - vmin) / (vmax - vmin)
        for r in rows:
            eng = 0.6*norm(r['score'] or 0, smin,smax) + 0.4*norm(r['num_comments'] or 0, cmin,cmax)
            # momentum: güncel içerik boost
            age_days = max(1, ( (conn.execute("select extract(epoch from (now()-%s))", (r['created_utc'],)).fetchone()[0]) / 86400 ))
            momentum = 1 / math.log2(age_days+1)
            freq = 1.0  # basit: her doküman 1; istersen cluster bazlı yoğunlukla güncelle
            comp = 0.5  # placeholder (SERP/PH rakip sayısı ile güncelle)
            total = W_FREQ*freq + W_MOMENTUM*momentum + W_ENG*eng + W_COMP*(1-comp)
            with conn.cursor() as cur:
                cur.execute("""
                    insert into scores (document_id, freq_score, momentum_score, engagement_score, competition_score, total_score)
                    values (%s,%s,%s,%s,%s,%s)
                """, (r['id'], freq, momentum, eng, comp, total))
            conn.commit()
    finally:
        conn.close()

if __name__ == '__main__':
    run()
```

> `comp` (competition_score) için ileride: basit bir Google Custom Search sayımı veya Product Hunt/Reddit rakip post sayımı ile doldurulabilir.

---

## 5) Next.js API Routes (App Router)

`/app/api/reddit/ingest/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { subreddit, query, limit, time_filter } = body
  // Bu route, ingestion işini background job'a kuyruklayabilir (e.g. Inngest / Queue)
  // Şimdilik doğrudan bir CLI çağrısı veya serverless job tetiklemesi varsayalım
  try {
    // örn: Railway/Render worker endpoint’inize webhook atın
    return NextResponse.json({ ok: true, queued: { subreddit, query, limit, time_filter } })
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e.message }, { status: 500 })
  }
}
```

`/app/api/ideas/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cluster = searchParams.get('cluster')
  const q = searchParams.get('q')

  let query = supabase
    .from('insights')
    .select('id, document_id, summary, pain_points, ideas, created_at, documents(title, subreddit)')
    .order('created_at', { ascending: false })
    .limit(100)
    .returns<any[]>()

  if (cluster) {
    query = query.contains('clusters', [cluster]) as any
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 })

  // basit arama filtresi (title/summary)
  const filtered = q ? data.filter(d => (d.summary || '').toLowerCase().includes(q.toLowerCase())) : data

  return NextResponse.json({ ok:true, items: filtered })
}
```

---

## 6) Prompt Şablonları

**Pain Mining (LLM system):**
```
You are a senior product researcher. Extract pain points with who-feels-it, severity (1-5), and support quotes.
Return strict JSON.
```

**User content (LLM user):**
```
TITLE: {{title}}
CONTENT:
{{content}}
```

**Idea Generator (LLM system):**
```
Act as a SaaS strategist. From the pain points, produce 3 concise business ideas with: title, one-sentence value_prop, 3-5 key_features, risks, ICP. JSON only.
```

**Landing Copy (LLM system):**
```
You are a conversion copywriter. Create hero headline, subheader, CTA, 3 bullets (benefits), social-proof snippet. JSON only.
```

---

## 7) Cron & Orkestrasyon
- **Ingestion**: Saatlik (hedef subreddit listesi + arama terimleri).
- **Analiz**: 15 dk’da bir yeni dokümanlar için.
- **Skorlama**: Günlük; son 90 güne bak.
- **Queue**: Inngest/Temporal/Cloud Task (opsiyon). Basit MVP’de: GitHub Actions + cron job + Railway worker.

---

## 8) Rate Limit ve Uyum
- Reddit API: user-agent belirt, istekleri yavaşlat (sleep).  
- İçerik saklama: Reddit TOS’a uy, mümkünse **post permalink** ve kısa alıntı sakla; tam gövdeleri dahili raporlama için tut, uygulama dışı yayınlama yapma.  
- LLM maliyeti: `gpt-4o-mini` veya Anthropic Haiku kullan; max token ve konteks kırpma uygula.

---

## 9) UI – Idea Cards (öneri)
- Grid liste: Title, Pain snapshot, ICP, Score, Subreddit, Date  
- Sağ panel: Summary, Quotes, Features, Risks, CTA Copy  
- Filtreler: Subreddit, Cluster, Tarih aralığı, Min Score, Dil

---

## 10) Kurulum Notları
- Python paketleri: `praw psycopg[binary] scikit-learn requests`  
- ENV: `REDDIT_CLIENT_ID`, `REDDIT_SECRET`, `REDDIT_USER_AGENT`, `SUPABASE_PG_CONN`, `OPENAI_API_KEY`  
- Supabase: RLS başlangıçta kapalı; sonra servis role ile server-side erişim.  
- Docker: ingestion/analysis worker için ayrı image önerilir.

---

## 11) Yol Haritası (Hızlı)
- v1: Top 5 subreddit + haftalık top + pain mining + idea cards  
- v1.1: Cluster düzeyinde trend grafikleri  
- v1.2: Competition score için SERP sayımı  
- v1.3: Otomatik Landing Copy üretimi + A/B test export  
- v2: Multi-source (Twitter, PH, Hacker News) + Otomatik share

---

## 12) Hızlı Test Komutları
```bash
# Ingestion
python ingestion/reddit_ingest.py --subreddit teachers --time_filter week --limit 30

# Analysis
python analysis/pain_mining.py

# Scoring
python analysis/scoring.py
```

---

## 13) Notlar
- İstersen `datasketch` ile MinHash kullanıp daha iyi dedup yapabiliriz.  
- Pushshift fallback ekleyebiliriz (geçmişe dönük daha kapsamlı tarama).  
- Çok dilli destek (langdetect + ayrı LLM promptları).



---

## 14) Supabase RLS & Politika (Üretime Hazır Ayarlar)

> **Hedef:** Ham Reddit verileri yalnızca **service role** ile yazılsın/okunsun; uygulama tarafı sadece Next.js API üzerinden sonuçları alsın.

```sql
-- RLS aç
alter table reddit_posts enable row level security;
alter table reddit_comments enable row level security;
alter table documents enable row level security;
alter table insights enable row level security;
alter table scores enable row level security;

-- Yalnızca service_role yazabilsin (insert/update)
create policy "posts_write_service" on reddit_posts
  for insert to public using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "posts_update_service" on reddit_posts
  for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "comments_write_service" on reddit_comments
  for insert to public using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "comments_update_service" on reddit_comments
  for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Doküman & analiz tabloları: yalnızca service_role okuyup yazsın
create policy "documents_all_service" on documents
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "insights_all_service" on insights
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "scores_all_service" on scores
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- İsteğe bağlı: read-only bir VIEW üzerinden son kullanıcıya okuma izni (Next.js API yerine doğrudan Supabase kullanmak istersen)
create view ideas_public as
select i.id as insight_id,
       d.id as document_id,
       d.title,
       d.subreddit,
       d.created_utc,
       d.score as reddit_score,
       d.num_comments,
       i.pain_points,
       i.summary,
       i.ideas,
       (
         select s.total_score from scores s
         where s.document_id = d.id
         order by s.created_at desc
         limit 1
       ) as total_score
from insights i
join documents d on d.id = i.document_id;

-- VIEW'i yalnızca okunur yap (taban tablolar için public select politikası **oluşturmuyoruz**)
revoke all on table reddit_posts from anon, authenticated;
revoke all on table reddit_comments from anon, authenticated;
revoke all on table documents from anon, authenticated;
revoke all on table insights from anon, authenticated;
revoke all on table scores from anon, authenticated;

-- ideas_public view'u REST'e açmak istersen (Supabase):
-- grant select on ideas_public to anon, authenticated;
```

> Not: Üretimde **Next.js API** server-side `service_role` ile okuyup sanitize ederek frontend’e dönmek en güvenlisi.

---

## 15) Indexler & Performans

```sql
create index if not exists idx_posts_created on reddit_posts(created_utc desc);
create index if not exists idx_docs_created on documents(created_utc desc);
create index if not exists idx_docs_hash on documents(hash_lexical);
create index if not exists idx_insights_doc on insights(document_id);
create index if not exists idx_scores_doc_time on scores(document_id, created_at desc);
```

---

## 16) Dockerfiles & Docker Compose (Worker’lar)

`/docker/ingestion.Dockerfile`
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY ingestion/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY ingestion /app/ingestion
CMD ["python", "ingestion/reddit_ingest.py", "--subreddit", "teachers", "--time_filter", "week", "--limit", "30"]
```

`/docker/analysis.Dockerfile`
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY analysis/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY analysis /app/analysis
CMD ["python", "analysis/pain_mining.py"]
```

`/ingestion/requirements.txt`
```
praw
psycopg[binary]
requests
langdetect
```

`/analysis/requirements.txt`
```
psycopg[binary]
requests
scikit-learn
```

`/docker/docker-compose.yml`
```yaml
version: "3.9"
services:
  ingestion_worker:
    build:
      context: ../
      dockerfile: docker/ingestion.Dockerfile
    environment:
      - REDDIT_CLIENT_ID=${REDDIT_CLIENT_ID}
      - REDDIT_SECRET=${REDDIT_SECRET}
      - REDDIT_USER_AGENT=${REDDIT_USER_AGENT}
      - SUPABASE_PG_CONN=${SUPABASE_PG_CONN}
    restart: unless-stopped

  analysis_worker:
    build:
      context: ../
    dockerfile: docker/analysis.Dockerfile
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - SUPABASE_PG_CONN=${SUPABASE_PG_CONN}
    depends_on:
      - ingestion_worker
    restart: unless-stopped
```

---

## 17) Pushshift Fallback (Opsiyonel)

`/ingestion/pushshift_fallback.py`
```python
import requests, time

BASE = "https://api.pushshift.io/reddit/search/submission"

def search_subreddit(subreddit: str, q: str=None, size: int=50, before: int=None, after: int=None):
    params = {"subreddit": subreddit, "size": size}
    if q: params["q"] = q
    if before: params["before"] = before
    if after: params["after"] = after
    r = requests.get(BASE, params=params, timeout=30)
    r.raise_for_status()
    return r.json().get('data', [])
```
> Not: Pushshift topluluk servisi olduğundan **kararsız** olabilir. Sadece geçmişi geniş taramak istediğinde kullan.

---

## 18) MinHash Dedup (Basit Jaccard)

`/ingestion/dedup.py`
```python
from datasketch import MinHash

def text_minhash(text: str, num_perm: int = 128) -> MinHash:
    m = MinHash(num_perm=num_perm)
    for token in (text or '').lower().split():
        m.update(token.encode('utf-8'))
    return m

def jaccard_sim(a: MinHash, b: MinHash) -> float:
    return a.jaccard(b)
```

`reddit_ingest.py` içinde (document oluşturulmadan **önce**):
```python
from ingestion.dedup import text_minhash, jaccard_sim

# ... docs = son 100 dokümanı çek
cur.execute("select content from documents where subreddit=%s order by created_utc desc limit 100", (p.subreddit.display_name,))
recent = [r['content'] for r in cur.fetchall()]
new_mh = text_minhash((p.selftext or '') + "
" + "
".join(comments_text))
if any(jaccard_sim(new_mh, text_minhash(x)) > 0.85 for x in recent):
    continue  # duplicate say, kaydetme
```

---

## 19) Next.js UI – Idea Cards (shadcn/ui)

`/components/IdeaCards.tsx`
```tsx
'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Item {
  id: string
  document_id: string
  summary: string
  pain_points: any[]
  ideas: any[]
  created_at: string
  documents?: { title?: string | null, subreddit?: string | null }
}

export default function IdeaCards({ q="", cluster="" }: { q?: string, cluster?: string }) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const url = `/api/ideas${q||cluster?`?${new URLSearchParams({ q, cluster }).toString()}`:''}`
    fetch(url).then(r=>r.json()).then(d=>{ setItems(d.items||[]); setLoading(false) })
  }, [q, cluster])

  if (loading) return <div className="text-sm text-muted-foreground">Loading ideas…</div>
  if (!items.length) return <div className="text-sm">No ideas yet.</div>

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((it) => (
        <Card key={it.id} className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="line-clamp-2">{it.documents?.title || 'Untitled'}</CardTitle>
            <div className="flex gap-2 items-center">
              {it.documents?.subreddit && <Badge variant="secondary">r/{it.documents.subreddit}</Badge>}
              <Badge>{new Date(it.created_at).toLocaleDateString()}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm line-clamp-3">{it.summary}</p>
            <div>
              <div className="text-xs mb-1 font-medium">Pain points</div>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {(it.pain_points||[]).slice(0,3).map((p:any, i:number)=> (
                  <li key={i} className="line-clamp-1">{p.pain} — <span className="opacity-70">sev:{p.severity}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs mb-1 font-medium">Ideas</div>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {(it.ideas||[]).slice(0,2).map((x:any, i:number)=> (
                  <li key={i} className="line-clamp-1">{x.title}: <span className="opacity-70">{x.value_prop}</span></li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Details</Button>
              <Button size="sm">Generate Landing Copy</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

`/app/page.tsx` (örnek kullanım)
```tsx
import IdeaCards from "@/components/IdeaCards"
export default function Page(){
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Validationly – Ideas</h1>
      <IdeaCards />
    </main>
  )
}
```

---

## 20) .env Örnekleri (Yerel Geliştirme)
```
# Next.js
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# Workers
SUPABASE_PG_CONN=postgres://postgres:postgres@db.xxxx.supabase.co:5432/postgres
REDDIT_CLIENT_ID=...
REDDIT_SECRET=...
REDDIT_USER_AGENT=validationly-bot/1.0
OPENAI_API_KEY=sk-...
```

---

## 21) Quickstart – 7 Adımda Çalıştır
1) **Supabase şema + RLS**: Yukarıdaki SQL’i `sql` sekmesinde/CLI ile çalıştır.  
2) **ENV** dosyalarını doldur.  
3) **Docker**: `docker compose -f docker/docker-compose.yml up --build -d`  
4) **İlk ingestion**: Compose içindeki ingestion worker otomatik koşar; alternatif: CLI komutları (bkz. §12).  
5) **Analiz**: analysis worker otomatik; LLM kredini kontrol et.  
6) **Next.js**: `pnpm dev` veya `pnpm build && pnpm start`  
7) **UI**: `/` sayfasında Idea Cards akacak; `/api/ideas` ile filtreleyebilirsin.

---

## 22) Yol Haritası (Bu sayfaya ek)
- 🔐 Public read için **RPC** (SECURITY DEFINER) fonksiyonuyla güvenli okumayı ekle.  
- 📈 Cluster bazlı trend grafikleri (Recharts).  
- 🧪 A/B landing copy generator + export.  
- 🧹 Gelişmiş dedup: LSH index + banding.  
- 🔎 Competition score: SERP & ProductHunt sayımı.



---

## 23) Entegrasyon: “Validation Engine” İçinde Reddit Sinyali

### 23.1 Mimari Genel Bakış
Validationly’nin **Validation Engine**’i; bir fikir/niş girdisi için çoklu sinyal sağlayıcıları (providers) çalıştırır ve birleşik bir **Validation Score** üretir.

- **Input**: idea_text, keywords[], target_segments[], locale
- **Providers (örnek)**: RedditPain, WebSERP, SearchTrends, SocialBuzz (X), CompetitorDensity, WaitlistConversion, FounderFit (opsiyonel)
- **Orkestrasyon**: Job Queue (Inngest/Temporal) → her provider paralel çalışır → `signals` tablosuna yazar → `validation_runs` toplanır → `validation_scores` hesaplanır.
- **Output**: Unified report + score + öneri/pivot.

### 23.2 Birleşik Veri Modeli (Yeni Tablolar)
```sql
create table if not exists validation_runs (
  id uuid primary key default gen_random_uuid(),
  idea text not null,
  keywords text[],
  target_segments text[],
  locale text default 'en',
  created_at timestamptz default now(),
  status text default 'running' -- running|done|failed
);

create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references validation_runs(id) on delete cascade,
  provider text not null, -- 'reddit_pain' | 'serp' | 'trends' | ...
  payload jsonb not null, -- provider spesifik ham/özet veri
  strength float,         -- 0..1 (provider internal)
  freshness float,        -- 0..1 (zaman ağırlığı)
  confidence float,       -- 0..1 (sağlayıcı güveni)
  created_at timestamptz default now()
);

create table if not exists validation_scores (
  id uuid primary key default gen_random_uuid(),
  run_id uuid unique references validation_runs(id) on delete cascade,
  score float not null,
  breakdown jsonb not null, -- provider bazında katkı ve notlar
  created_at timestamptz default now()
);
```

> Mevcut `documents/insights/scores` tabloları Reddit kaynaklı içeriği depolamaya devam eder; **signals** tablosu bu veriden türetilmiş özetleri Validation Engine’e taşır.

### 23.3 Reddit → Signal Map
- `payload`: { top_pains[], clusters[], quotes[], aggregate_engagement, example_threads[] }
- `strength`: normalize edilmiş **pain yoğunluğu** (frekans + engagement + momentum)
- `freshness`: son 30–90 gün ağırlığı (exponential decay)
- `confidence`: veri miktarı + dedup kalitesi + subreddit alaka metriği

---

## 24) Birleşik Skorlama Formülü

Toplam skor: 
```
ValidationScore = Σ_i  w_i * ProviderScore_i
```

Önerilen sağlayıcı ağırlıkları (v1):
- `w_reddit_pain = 0.32`
- `w_serp_competitor = 0.22` (rakip yoğunluğu: azsa skor ↑)
- `w_search_trends = 0.18`
- `w_social_buzz = 0.12`
- `w_waitlist_conv = 0.16` (erken landing dönüşümü varsa yüksek ağırlık)

**RedditPain ProviderScore** (0..1):
```
P = 0.5*strength + 0.3*freshness + 0.2*confidence
```

**Normalization notları**
- Strength: 0..1; cluster başına frekans z-score → logistic dönüşüm
- Freshness: t gün önce → exp(-t/τ), τ=30 öneri
- Confidence: min(samples/threshold,1) × source_quality

**Breakdown örneği**
```json
{
  "reddit_pain": {"score": 0.68, "notes": "r/teachers ve r/edtech'te son 30 günde artış"},
  "serp_competitor": {"score": 0.41, "notes": "5 ciddi rakip, 2 feature gap"},
  "search_trends": {"score": 0.55, "notes": "+18% 3 ay momentum"},
  "social_buzz": {"score": 0.33},
  "waitlist_conv": {"score": 0.12, "notes": "erken testte düşük CTR"}
}
```

---

## 25) Provider Sözleşmesi (Interface)

```ts
export type ValidationInput = {
  idea: string
  keywords?: string[]
  targetSegments?: string[]
  locale?: string
  runId: string
}

export type Signal = {
  provider: 'reddit_pain' | 'serp' | 'trends' | 'social' | 'waitlist'
  payload: any
  strength: number   // 0..1
  freshness: number  // 0..1
  confidence: number // 0..1
}

export interface Provider {
  name: Signal['provider']
  run(input: ValidationInput): Promise<Signal>
}
```

**RedditPainProvider.run** akışı:
1) `documents/insights/scores`’dan input keywords/segments ile **alaka filtreleme**
2) pain yoğunluğu + momentum + engagement → `strength`
3) yaş → `freshness`, veri seti güveni → `confidence`
4) `signals` tablosuna yaz

---

## 26) Orkestrasyon & API Sözleşmesi

### 26.1 REST (App Router)
**POST `/api/validate`** → yeni bir run başlatır ve kuyruğa ekler
```http
Body: { idea: string, keywords?: string[], target_segments?: string[], locale?: string }
Response: { run_id: string, status: 'queued' }
```

**GET `/api/validate/:run_id`** → durum + skor
```json
{
  "run_id": "...",
  "status": "done|running|failed",
  "score": 0.64,
  "breakdown": { ... },
  "insights": { "reddit": {...}, "serp": {...}, "trends": {...} }
}
```

### 26.2 Queue İşleri (Inngest iskeleti)

`/inngest/client.ts`
```ts
import { Inngest } from "inngest"
export const inngest = new Inngest({ name: "Validationly" })
```

`/inngest/functions/validate.ts`
```ts
import { inngest } from "../client"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

type Payload = { runId: string, idea: string, keywords: string[], target_segments: string[], locale: string }

export const validateFn = inngest.createFunction(
  { id: "validate-run" },
  { event: "validate/run" },
  async ({ event, step }) => {
    const { runId, idea, keywords, target_segments, locale } = event.data as Payload

    // 1) Reddit provider (stub): mevcut insights'tan sinyal çıkar
    const reddit = await step.run("reddit_pain", async () => {
      // TODO: gerçek hesaplama: son 90 gün, keywords/segments filtre
      // örnek dummy skor
      return { provider: 'reddit_pain', strength: 0.55, freshness: 0.62, confidence: 0.78, payload: { top_pains: [], examples: [] } }
    })

    // 2) SERP provider (stub)
    const serp = await step.run("serp_competitor", async () => ({ provider: 'serp', score: 0.4, payload: { competitors: [] } }))

    // 3) Trends provider (stub)
    const trends = await step.run("trends", async () => ({ provider: 'trends', score: 0.5, payload: { delta_90d: 0.1 } }))

    // Signals'a yaz
    const signals = [reddit, serp, trends]
    for (const s of signals) {
      await supabase.from('signals').insert({
        run_id: runId,
        provider: s.provider,
        payload: s.payload,
        strength: 'strength' in s ? s.strength : null,
        freshness: 'freshness' in s ? s.freshness : null,
        confidence: 'confidence' in s ? s.confidence : null,
      })
    }

    // Aggregation
    const w = { reddit: 0.32, serp: 0.22, trends: 0.18 }
    const redditScore = 0.5*(reddit.strength ?? 0) + 0.3*(reddit.freshness ?? 0) + 0.2*(reddit.confidence ?? 0)
    const total = (w.reddit*redditScore) + (w.serp*(serp.score ?? 0)) + (w.trends*(trends.score ?? 0))
    await supabase.from('validation_scores').upsert({ run_id: runId, score: total, breakdown: {
      reddit_pain: { score: redditScore }, serp: { score: serp.score }, trends: { score: trends.score }
    } })

    await supabase.from('validation_runs').update({ status: 'done' }).eq('id', runId)

    return { ok: true, score: total }
  }
)
```

`/app/api/inngest/route.ts` (Inngest handler)
```ts
import { serve } from "inngest/next"
import { validateFn } from "@/inngest/functions/validate"

export const { GET, POST, PUT } = serve("Validationly Inngest", [validateFn])
```

`/app/api/validate/route.ts` (POST enqueue)
```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest){
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const body = await req.json()
  const runId = crypto.randomUUID()
  const { idea, keywords = [], target_segments = [], locale = 'en' } = body
  const { error } = await supabase.from('validation_runs').insert({ id: runId, idea, keywords, target_segments, locale, status: 'running' })
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 })

  // Inngest event gönder
  await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/inngest", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'validate/run', data: { runId, idea, keywords, target_segments, locale } })
  })

  return NextResponse.json({ ok: true, run_id: runId, status: 'queued' })
}
```

`/app/api/validate/[id]/route.ts` (GET status)
```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(_: NextRequest, { params }: { params: { id: string } }){
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const runId = params.id

  const { data: run } = await supabase.from('validation_runs').select('*').eq('id', runId).single()
  const { data: score } = await supabase.from('validation_scores').select('*').eq('run_id', runId).single()

  // örnek Reddit/Trends/SERP özeti
  const { data: sigs } = await supabase.from('signals').select('*').eq('run_id', runId)
  const insights: any = { }
  for (const s of (sigs||[])) insights[s.provider] = s.payload

  return NextResponse.json({ run_id: runId, status: run?.status || 'running', score: score?.score ?? null, breakdown: score?.breakdown ?? {}, insights })
}
```

### 26.3 Frontend: Status Polling

`/components/ValidationRunner.tsx`
```tsx
'use client'
import { useEffect, useState } from 'react'

export default function ValidationRunner({ runId }: { runId: string }){
  const [data, setData] = useState<any>(null)
  useEffect(() => {
    let t = setInterval(async () => {
      const r = await fetch(`/api/validate/${runId}`).then(r=>r.json())
      setData(r)
      if (r.status === 'done' || r.status === 'failed') clearInterval(t)
    }, 1500)
    return () => clearInterval(t)
  }, [runId])

  if (!data) return <div>Starting…</div>
  return (
    <div className="space-y-3">
      <div className="text-sm">Status: <b>{data.status}</b></div>
      {data.score!=null && <div className="text-2xl font-semibold">Validation Score: {Math.round(data.score*100)}</div>}
      <pre className="text-xs bg-muted p-3 rounded">{JSON.stringify(data.breakdown, null, 2)}</pre>
    </div>
  )
}
```

`/app/validate/page.tsx`
```tsx
'use client'
import { useState } from 'react'
import ValidationRunner from '@/components/ValidationRunner'

export default function Page(){
  const [runId, setRunId] = useState<string | null>(null)
  const [idea, setIdea] = useState("")
  const start = async () => {
    const r = await fetch('/api/validate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ idea }) })
    const d = await r.json(); setRunId(d.run_id)
  }
  return (
    <main className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Validate an Idea</h1>
      <div className="flex gap-2">
        <input value={idea} onChange={e=>setIdea(e.target.value)} className="border rounded px-3 py-2 flex-1" placeholder="Your idea…"/>
        <button onClick={start} className="px-4 py-2 rounded bg-black text-white">Validate</button>
      </div>
      {runId && <ValidationRunner runId={runId} />}
    </main>
  )
}
```

> **Notlar**
> - `NEXT_PUBLIC_BASE_URL` çevresel değişkeni Inngest endpoint’in tam URL’si için kullanıldı.
> - Provider’lar şu an stub; Reddit/Trends/SERP gerçek hesaplamaları eklendiğinde `signals` ve `breakdown` otomatik dolacak.

---

## 27) UI Entegrasyonu (Ana Akış)

- **Idea Intake** (mevcut form): Kullanıcı `Validate`’e bastığında `POST /api/validate`.
- **Run Paneli**: `run_id` ile canlı durum (spinner → partial chips: Reddit ✅, SERP ⏳ …).
- **Results View**: Unified **Validation Score** + Provider breakdown kartları + önerilen “Next actions”.
- **Drill‑down**: Reddit kartında top pains + alıntılar + örnek thread linkleri.

Component eskizi:
```tsx
<ValidationRun runId="...">
  <ScoreGauge value={score} />
  <ProviderList>
    <ProviderCard name="Reddit Pain" score={p.reddit_pain.score} details={...} />
    <ProviderCard name="SERP" score={...} />
    ...
  </ProviderList>
</ValidationRun>
```

---

## 28) Migration Plan
1) Yeni tablolar (`validation_runs`, `signals`, `validation_scores`).
2) Reddit analizinden `signals` yazma (backfill: son 90 gün).
3) API & queue işlerinin eklenmesi.
4) UI’de “Validate” akışını yeni endpoint’e yönlendirme.
5) Eski bağımsız sayfayı **Provider Drill‑Down** görünümüne dönüştürme.

---

## 29) Feature Flags & Deneyler
- `ff_reddit_weight`: 0.2–0.4 arası A/B
- `ff_trends_enabled`: ülke bazlı aç/kapat
- `ff_waitlist_weight`: gerçek dönüşüm gelince ağırlığı arttır

---

## 30) Güvenlik & Uyumluluk
- Reddit içeriği: permalink + kısa alıntı; hassas içerik maskeleme.
- PII: Waitlist verisinde IP/email hash; yalnızca aggregate metrikler UI’da.
- Rate limits: Provider başına concurrency; cache TTL (6–24h) ile tekrarlı çağrılar.

---

## 31) Örnek Kod: `/app/api/validate/route.ts`
```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest){
  const body = await req.json()
  const runId = crypto.randomUUID()
  const { idea, keywords = [], target_segments = [], locale = 'en' } = body
  const { error } = await supabase.from('validation_runs').insert({ id: runId, idea, keywords, target_segments, locale, status: 'running' })
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 })

  // TODO: enqueue background job (Inngest/Queue) with runId

  return NextResponse.json({ ok: true, run_id: runId, status: 'queued' })
}
```

**Aggregator (pseudo)**
```ts
function aggregate(signals){
  const w = { reddit: 0.32, serp: 0.22, trends: 0.18, social: 0.12, waitlist: 0.16 }
  const s = {
    reddit: 0.5*signals.reddit.strength + 0.3*signals.reddit.freshness + 0.2*signals.reddit.confidence,
    serp: signals.serp.score,
    trends: signals.trends.score,
    social: signals.social.score,
    waitlist: signals.waitlist.score
  }
  const total = Object.keys(w).reduce((acc,k)=> acc + (w[k]* (s[k]??0)), 0)
  return { total, breakdown: s }
}
```

---

## 32) Sonraki Adımlar
- Provider interface’ini repo’da `/providers` altında çıkar. ✅ (bkz. §33–35)
- RedditPain’i mevcut ingestion/insights’tan okuyan hafif adaptörle sinyale dönüştür. ✅ (bkz. §33)
- SERP ve Trends provider’larını ekle (Custom Search & pytrends). ✅ (bkz. §34)
- Aggregator’ı bağla, UI’de tek “Validation Score” göster. ✅ (bkz. §26.2 güncelleme)

---

## 33) **RedditPain Provider – Gerçek Adaptör** (v1.0)

### 33.1 Hesaplama İlkeleri
- **Alaka (relevance)**: `keywords[]` metinleri `documents.title` + `insights.summary` + `insights.pain_points[].pain` içinde `ILIKE`/`tsvector` ile aranır.
- **Strength (0..1)**: frekans (eşleşen doküman sayısı) + etkileşim (reddit score & comments) + momentum (son 30–90 gün decay) birleşimi.
- **Freshness (0..1)**: zaman ağırlığı `exp(-age_days/τ)`; τ=30 öneri.
- **Confidence (0..1)**: örnek sayısı, subreddit kalite katsayısı (elde yoksa 0.8 default), dedup oranı (yakın kopya oranı düşükse ↑).

### 33.2 SQL Yardımcıları (materialized view + index)
```sql
-- Arama için full-text index (opsiyonel ama önerilir)
create extension if not exists pg_trgm;
alter table documents add column if not exists tsv_title tsvector;
alter table insights add column if not exists tsv_summary tsvector;
update documents set tsv_title = to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(subreddit,''));
update insights set tsv_summary = to_tsvector('simple', coalesce(summary,''));
create index if not exists idx_docs_tsv on documents using gin(tsv_title);
create index if not exists idx_insights_tsv on insights using gin(tsv_summary);

-- Son 90 günlük özet (hız için)
create materialized view if not exists mv_reddit_recent as
select d.id as document_id,
       d.subreddit,
       d.title,
       d.created_utc,
       coalesce(d.score,0) as reddit_score,
       coalesce(d.num_comments,0) as reddit_comments,
       i.summary,
       i.pain_points
from documents d
join insights i on i.document_id = d.id
where d.created_utc > now() - interval '90 days';
create index if not exists idx_mv_recent_time on mv_reddit_recent(created_utc desc);
-- refresh job: günlük veya provider çağrısından önce CONCURRENTLY
```

### 33.3 Provider Kod (Node, App Router runtime)
`/providers/redditPain.ts`
```ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const TAU_DAYS = 30
const decay = (ageDays:number) => Math.exp(-ageDays/TAU_DAYS)

export async function runRedditPain(runId: string, idea: string, keywords: string[] = [], targetSegments: string[] = []){
  // 1) Veriyi çek (son 90 gün, anahtar kelime eşleşmesi)
  const { data: rows, error } = await supabase.rpc('reddit_pain_fetch', {
    p_keywords: keywords.length ? keywords : null,
    p_segments: targetSegments.length ? targetSegments : null
  })
  if (error) throw new Error(error.message)

  // 2) Metrikler
  const now = Date.now()
  let count = 0, engSum = 0, freshSum = 0
  const examples:any[] = []
  for (const r of rows as any[]) {
    const ageDays = Math.max(1, (now - new Date(r.created_utc).getTime())/86400000)
    const f = decay(ageDays)
    freshSum += f
    const engagement = 0.6*(r.reddit_score||0) + 0.4*(r.reddit_comments||0)
    engSum += engagement
    count += 1
    if (examples.length < 5) examples.push({ title: r.title, subreddit: r.subreddit, created_utc: r.created_utc })
  }

  // normalize basitçe
  const N = Math.max(1, count)
  const strength = Math.min(1, 0.4*(Math.log1p(count)/Math.log(50)) + 0.6*(Math.log1p(engSum)/Math.log(1000)))
  const freshness = Math.min(1, freshSum / N)
  const confidence = Math.min(1, Math.max(0.4, Math.log1p(count)/Math.log(20)))

  const payload = {
    top_pains: (rows||[]).slice(0,10).flatMap((r:any)=> (r.pain_points||[])).slice(0,8),
    examples,
    aggregate_engagement: engSum
  }

  // 3) Signals tablosuna yaz
  await supabase.from('signals').insert({
    run_id: runId,
    provider: 'reddit_pain',
    payload,
    strength,
    freshness,
    confidence
  })

  return { provider: 'reddit_pain', strength, freshness, confidence, payload }
}
```

**Supabase RPC (Postgres function)**
```sql
create or replace function reddit_pain_fetch(p_keywords text[], p_segments text[])
returns table(
  document_id uuid,
  subreddit text,
  title text,
  created_utc timestamptz,
  reddit_score int,
  reddit_comments int,
  summary text,
  pain_points jsonb
) language sql as $$
  select m.document_id, m.subreddit, m.title, m.created_utc, m.reddit_score, m.reddit_comments, m.summary, m.pain_points
  from mv_reddit_recent m
  where (
     p_keywords is null
     or exists (
       select 1 where (
         m.title ilike any (select '%'||k||'%' from unnest(p_keywords) k)
         or m.summary ilike any (select '%'||k||'%' from unnest(p_keywords) k)
       )
     )
  )
  and (
     p_segments is null
     or m.summary ilike any (select '%'||s||'%' from unnest(p_segments) s)
  )
  order by m.created_utc desc
  limit 200;
$$;
```

> Not: Daha gelişmiş alaka için `tsvector @@ to_tsquery` veya embedding araması eklenebilir.

### 33.4 Inngest Entegrasyonu (validateFn güncellemesi)
`/inngest/functions/validate.ts` içinde stub yerine:
```ts
import { runRedditPain } from '@/providers/redditPain'
// ...
const reddit = await step.run("reddit_pain", async () => {
  return await runRedditPain(runId, idea, keywords, target_segments)
})
```

---

## 34) **SERP & Trends Providers – Çalışan İskelet** (v1)

### 34.1 SERP (Google Programmable Search)
`/providers/serp.ts`
```ts
export async function runSerp(runId: string, keywords: string[]){
  const q = (keywords && keywords.length) ? keywords.join(' ') : ''
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(q)}&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CSE_ID}`
  const r = await fetch(url)
  if (!r.ok) throw new Error('SERP fetch failed')
  const data = await r.json()
  const competitors = (data.items||[]).map((it:any)=> ({ title: it.title, link: it.link }))
  // basit yoğunluk → daha çok rakip = daha düşük skor
  const density = Math.min(1, (competitors.length)/10)
  const score = 1 - density
  return { provider: 'serp', score, payload: { competitors } }
}
```

### 34.2 Trends (pytrends mikro-servis veya basit fallback)
- **Seçenek A (önerilen)**: Küçük bir Python Cloud Run worker: `/trends?q=...&geo=TR` → `interest_over_time` döner.
- **Seçenek B (fallback)**: Semrush/SerpAPI/Glances benzeri API.

`/providers/trends.ts` (A için HTTP çağrısı varsayalım)
```ts
export async function runTrends(runId: string, keywords: string[]){
  const q = keywords[0] || ''
  const r = await fetch(`${process.env.TRENDS_BASE_URL}/trend?q=${encodeURIComponent(q)}&geo=TR`)
  if (!r.ok) return { provider: 'trends', score: 0.5, payload: { delta_90d: 0 } } // graceful degrade
  const data = await r.json()
  const delta = data.delta_90d // -1..+1
  const score = Math.max(0, Math.min(1, (delta+1)/2))
  return { provider: 'trends', score, payload: { delta_90d: delta } }
}
```

**Trends Python Worker (örnek)**
```python
from flask import Flask, request, jsonify
from pytrends.request import TrendReq
app = Flask(__name__)
@app.get('/trend')
def trend():
    kw = request.args.get('q','')
    geo = request.args.get('geo','TR')
    pytrends = TrendReq(hl='tr-TR', tz=180)
    pytrends.build_payload([kw], timeframe='today 3-m', geo=geo)
    df = pytrends.interest_over_time()
    if df.empty:
        return jsonify({ 'delta_90d': 0 })
    s = df[kw].dropna()
    if len(s) < 2:
        return jsonify({ 'delta_90d': 0 })
    delta = (float(s.iloc[-1]) - float(s.iloc[0])) / max(1.0, float(s.iloc[0]) if s.iloc[0] else 1.0)
    return jsonify({ 'delta_90d': max(-1,min(1,delta)) })
```

### 34.3 validateFn’e ekleme
```ts
import { runSerp } from '@/providers/serp'
import { runTrends } from '@/providers/trends'
// ...
const serp = await step.run("serp_competitor", async () => await runSerp(runId, keywords))
const trends = await step.run("trends", async () => await runTrends(runId, keywords))
```

---

## 35) ENV & Yetki Güncellemeleri
```
GOOGLE_API_KEY=...
GOOGLE_CSE_ID=...
TRENDS_BASE_URL=https://your-cloud-run-url
```
Supabase RLS: `signals` ve `validation_runs/scores` zaten service_role ile yazılıyor (bkz. §14). Ek değişiklik yok.

---

## 36) E2E Hızlı Testler
```bash
# 1) MV refresh (ilk kurulumdan sonra)
psql $SUPABASE_PG_CONN -c "refresh materialized view concurrently mv_reddit_recent;"

# 2) Run başlat
curl -s -X POST http://localhost:3000/api/validate \
  -H 'Content-Type: application/json' \
  -d '{"idea":"AI ile öğretmenlere planlama aracı","keywords":["teacher planning","lesson plan","edtech"]}'
# => { run_id: "...", status: "queued" }

# 3) Durumu izle
watch -n 2 curl -s http://localhost:3000/api/validate/<RUN_ID>
```

---

## 37) Kısa Özet
- **RedditPain**: Gerçek veriden signal üretiyor; strength/freshness/confidence hesaplıyor ve `signals`’a yazıyor.
- **SERP & Trends**: Çalışır iskelet; API anahtarlarını girince prod‑ready.
- **validateFn**: Üç provider’ı paralel çalıştırıp `validation_scores`’a yazıyor.

