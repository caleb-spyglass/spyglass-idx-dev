# Architecture — Spyglass IDX

> **Last updated:** 2025-02-09  
> **Status:** Production (spyglass-idx.vercel.app)  
> **Owner:** Spyglass Realty Engineering  
> **Governance:** Conforms to [Enterprise Architecture Guidelines v1.0](./docs/spyglass_enterprise_arch.pdf), February 2026

---

## 1. System Summary

Spyglass IDX is a Next.js 16 real estate search application deployed on Vercel. It provides MLS listing search, community/neighborhood browsing with geo-spatial polygon filtering, AI-powered natural language search, and lead capture integrated with Follow Up Boss CRM. The app supports WordPress iframe embedding for seamless integration with the main Spyglass Realty website.

### Architecture Principles Applied

Per Enterprise Architecture Guidelines v1.0:

| # | Principle | How Applied |
|---|---|---|
| 1 | API-first boundaries | All data via versioned API routes; OpenAPI contract in `openapi.yaml` |
| 2 | Least privilege | API keys server-side only; no admin endpoints exposed; FUB scoped to lead creation |
| 3 | Everything is observable | Structured JSON logs with request IDs + correlation IDs; duration metrics |
| 4 | Automate the boring parts | Push-to-deploy via Vercel Git integration; zero manual infra |
| 5 | Stateless compute | Vercel serverless functions; no in-process state between requests |
| 6 | Standardize before you scale | Single MLS data source; unified polygon format; shared fetch-with-retry |
| 7 | Security is a feature | Threat model in SECURITY.md; NLP prompt firewall; rate limiting |
| 8 | Fail safely | All external calls have timeouts (8–12 s) + retries with exponential back-off |
| 9 | Cost-aware design | 60 s ISR cache; polygon data bundled at build (no runtime DB queries) |
| 10 | AI is a system dependency | NLP treated as probabilistic; input/output validation; graceful 406 handling |

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | Next.js 16.1.6 | App Router, React 19, Server Components |
| **Language** | TypeScript 5 | Strict mode |
| **Styling** | Tailwind CSS 4 | PostCSS pipeline |
| **Maps** | Leaflet + react-leaflet 5 | OSM tiles, polygon overlays |
| **Hosting** | Vercel | Edge CDN, serverless functions (per Vercel Platform Guidance: frontend, SSR/ISR, Edge) |
| **MLS Data** | Repliers API | Single source of truth for listings + NLP |
| **CRM** | Follow Up Boss | Lead capture and routing |
| **CDN (Images)** | cdn.repliers.io | MLS listing photos |
| **Geo Processing** | @turf/helpers, @turf/simplify | Polygon simplification (build-time only) |

---

## 3. C4 Model Diagrams

### 3.1 Context Diagram — Who Uses It, External Systems

Shows the system boundary, users, and all external dependencies.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SYSTEM CONTEXT                                    │
│                                                                              │
│  ┌──────────────┐          ┌────────────────────────────┐                   │
│  │  Home Buyers  │─────────▶│                            │                   │
│  │  & Renters    │  HTTPS   │      Spyglass IDX          │                   │
│  └──────────────┘          │     (Next.js on Vercel)     │                   │
│                             │                            │                   │
│  ┌──────────────┐          │  • Search MLS listings      │                   │
│  │  Spyglass     │─────────▶│  • Browse communities      │                   │
│  │  Agents       │  HTTPS   │  • AI natural-language      │                   │
│  └──────────────┘          │    search                   │                   │
│                             │  • Submit inquiries         │                   │
│  ┌──────────────┐  iframe  │  • Save favorites           │                   │
│  │  WordPress    │─────────▶│    (client-side)            │                   │
│  │  (Main Site)  │ ?embed   │                            │                   │
│  └──────────────┘          └─────┬──────┬──────┬────────┘                   │
│                                   │      │      │                            │
│                          ┌────────┘      │      └───────────┐                │
│                          ▼               ▼                  ▼                │
│                 ┌────────────────┐ ┌───────────┐   ┌────────────────┐       │
│                 │  Repliers API  │ │Follow Up   │   │  US Census     │       │
│                 │  (MLS Data +   │ │Boss API    │   │  Bureau API    │       │
│                 │   NLP Search)  │ │(CRM/Leads) │   │  (Demographics)│       │
│                 └────────────────┘ └───────────┘   └────────────────┘       │
│                                                                              │
│                 ┌────────────────┐                                           │
│                 │ cdn.repliers.io│                                           │
│                 │ (Listing Photos)│                                          │
│                 └────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Actors:**
- **Home Buyers & Renters** — Search listings, view communities, submit inquiries
- **Spyglass Agents** — Share listings/community links with clients
- **WordPress Main Site** — Embeds IDX pages via `<iframe>` with `?embed=true`

**External Systems (all have timeouts + retries per §8):**

| System | Protocol | Purpose | Timeout | Retries | Failure Impact |
|---|---|---|---|---|---|
| Repliers API | HTTPS | MLS listings, NLP search | 8 s (12 s NLP) | 2 (1 NLP) | **Critical** — no listings |
| Follow Up Boss | HTTPS | Lead capture | 8 s | 1 | **Degraded** — leads logged locally |
| Census Bureau | HTTPS | Demographics | 8 s | 2 | **Degraded** — stats empty |
| cdn.repliers.io | HTTPS | Listing photos | Browser | N/A | **Degraded** — broken images |
| OSM Tile Servers | HTTPS | Map tiles | Browser | N/A | **Degraded** — map blank |

---

### 3.2 Container Diagram — Frontend / Backend / Storage

```
┌─────────────────────────────────────────────────────────────────┐
│                       VERCEL PLATFORM                            │
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
│  │   STATIC CDN         │  │   SERVERLESS FUNCTIONS            │ │
│  │                      │  │                                    │ │
│  │  • HTML/CSS/JS       │  │  ┌─────────────────────┐         │ │
│  │  • Leaflet tiles     │  │  │  API Route Handlers  │         │ │
│  │  • Optimized images  │  │  │  /api/listings       │         │ │
│  │  • Font files        │  │  │  /api/communities    │         │ │
│  │                      │  │  │  /api/nlp-search     │         │ │
│  └──────────────────────┘  │  │  /api/leads          │         │ │
│                             │  │  /api/listings/[mls] │         │ │
│  ┌──────────────────────┐  │  │  /api/listings/sim.  │         │ │
│  │   REACT CLIENT       │  │  └─────────┬───────────┘         │ │
│  │   (Browser)          │  │            │                      │ │
│  │                      │  │  ┌─────────┴───────────┐         │ │
│  │  • AISearchBar       │  │  │  Shared Libraries    │         │ │
│  │  • FilterBar         │  │  │  • repliers-api.ts   │         │ │
│  │  • ListingsGrid      │  │  │  • follow-up-boss.ts │         │ │
│  │  • LeafletMap        │  │  │  • logger.ts         │         │ │
│  │  • LeadCaptureForm   │  │  │  • nlp-guard.ts      │         │ │
│  │  • UserMenu          │  │  │  • rate-limit.ts     │         │ │
│  │                      │  │  │  • fetch-with-retry  │         │ │
│  │  ┌───────────────┐   │  │  └──────────────────────┘         │ │
│  │  │ localStorage  │   │  │                                    │ │
│  │  │ • user profile│   │  │  ┌──────────────────────┐         │ │
│  │  │ • favorites   │   │  │  │  SSR / RSC Pages     │         │ │
│  │  │ • saved search│   │  │  │  • /communities/[s]  │         │ │
│  │  │ • dismissed   │   │  │  │  • /listing/[mls]    │         │ │
│  │  └───────────────┘   │  │  └──────────────────────┘         │ │
│  └──────────────────────┘  └──────────────────────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ BUILD-TIME DATA (bundled into serverless functions)          ││
│  │ • communities-polygons.ts — 4,145 community polygons        ││
│  │ • community-descriptions.ts — SEO content                   ││
│  │ • community-card-data.ts — Display metadata                 ││
│  └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

**Key design decisions:**
- **No database** — All MLS data is proxied from Repliers at request time (cached 60 s via ISR)
- **No server-side user storage** — All user state lives in browser localStorage
- **Static polygon data** — 4,145 community boundaries compiled into the JS bundle at build time
- **Stateless compute** — Serverless functions hold no state between invocations (Principle §5)

---

### 3.3 Deployment Diagram — Vercel Resources by Environment

```
┌──────────────────────────────────────────────────────────────────┐
│                        ENVIRONMENTS                               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  PRODUCTION  (spyglass-idx.vercel.app)                      │ │
│  │  Branch: main                                                │ │
│  │  Region: iad1 (auto)                                         │ │
│  │                                                              │ │
│  │  Env vars: REPLIERS_API_KEY, FUB_API_KEY, etc.              │ │
│  │  Functions: Node.js 20 runtime, 10 s max duration            │ │
│  │  Edge CDN: Global, immutable asset hashes                    │ │
│  │  Deploy trigger: git push origin main                        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  PREVIEW  (spyglass-idx-<hash>.vercel.app)                  │ │
│  │  Branch: any non-main branch / PR                            │ │
│  │  Region: iad1                                                │ │
│  │                                                              │ │
│  │  Env vars: Same as production (or overridden per env)        │ │
│  │  Deploy trigger: git push origin <branch>                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  LOCAL DEV  (localhost:3000)                                  │ │
│  │  Env: .env.local                                              │ │
│  │  Runtime: Turbopack dev server                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

Vercel Platform Guidance compliance:
  ✅ Use for: Frontend hosting, SSR/ISR, Edge functions
  ✅ Avoided: Long-running jobs, heavy compute
  ⚠️  Community stats (up to 200 listings) is the heaviest function — monitor duration
```

---

## 4. Data Flow

### 4.1 Listing Search (Standard)

```
Browser → GET /api/listings?filters
  → [Rate limiter: 60/min per IP]
  → Vercel Serverless
  → repliers-api.ts → fetchWithRetry(Repliers /listings, 8s timeout, 2 retries)
  → Transform RepliersListing → Listing
  → Return SearchResults JSON + X-Request-Id header
```

### 4.2 Polygon / Community Search

```
Browser → POST /api/listings { polygon, ...filters }
  → Vercel Serverless
  → repliers-api.ts → fetchWithRetry(POST Repliers /listings + { map: [ring] })
  → Transform → Return
```

### 4.3 NLP / AI Search

```
Browser → POST /api/nlp-search { prompt, nlpId? }
  → [Rate limiter: 10/min per IP]
  → [NLP prompt firewall: length check, injection detection]
  → Vercel Serverless
  → Step 1: fetchWithRetry(POST Repliers /nlp, 12s timeout) → search params
  → Step 2: findCommunityFromPrompt() → polygon match (local, in-memory)
  → Step 3: fetchWithRetry(Repliers /listings, 8s timeout) → listings
  → [Output: sanitizeNLPSummary() — treat LLM output as untrusted]
  → Return { listings, nlpId, summary, matchedCommunity } + X-Request-Id
```

### 4.4 Lead Capture

```
Browser → POST /api/leads { name, email, phone, message, formType }
  → [Rate limiter: 5/min per IP]
  → [Input validation: name + email required, email regex]
  → Vercel Serverless
  → follow-up-boss.ts → fetchWithRetry(POST FUB /people, 8s timeout, 1 retry)
  → follow-up-boss.ts → fetchWithRetry(POST FUB /events)
  → Return { success: true } (always — errors never exposed to user)
```

---

## 5. API Routes

| Method | Endpoint | Description | Rate Limit |
|---|---|---|---|
| `GET` | `/api/listings` | Search with query param filters | 60/min |
| `POST` | `/api/listings` | Search with polygon body | 60/min |
| `GET` | `/api/listings/[mls]` | Single listing by MLS# | 60/min |
| `GET` | `/api/listings/similar` | Similar listings ±25% price | 60/min |
| `GET` | `/api/communities` | List communities (filterable) | 30/min |
| `GET` | `/api/communities/[slug]` | Community detail + listings | 30/min |
| `GET` | `/api/communities/[slug]/stats` | Market statistics | 30/min |
| `POST` | `/api/nlp-search` | AI natural-language search | 10/min |
| `POST` | `/api/leads` | Submit lead to FUB CRM | 5/min |

Full contract: **[openapi.yaml](./openapi.yaml)**

### API Paved Road Compliance

Per Enterprise Architecture Guidelines v1.0, §API Paved Road Standards:

| Standard | Status | Notes |
|---|---|---|
| Consistent resource naming | ✅ | `/api/{resource}`, `/api/{resource}/{id}` |
| Pagination conventions | ✅ | `?page=N&pageSize=N`, response includes `total`, `hasMore` |
| Filtering & sorting | ✅ | Query params: `minPrice`, `maxPrice`, `sort=date-desc` |
| Idempotency keys (POST) | ⚠️ | FUB dedupes by email; NLP is inherently idempotent (same prompt = same result) |
| OpenAPI for REST | ✅ | `openapi.yaml` |
| Timeouts everywhere | ✅ | 8–12 s per external call via `fetchWithRetry` |
| Retries with backoff | ✅ | Exponential backoff (500 ms base, max 2 retries) |
| Rate limiting | ✅ | Token-bucket per IP (see table above) |

---

## 6. Component Architecture

### 6.1 Pages (App Router)

| Route | Component | Data Strategy |
|---|---|---|
| `/` | Home page | Client-side search |
| `/communities` | Communities list | Server Component + client island |
| `/communities/[slug]` | Community detail | SSR with listings fetch |
| `/listing/[mls]` | Listing detail | SSR via `getListing()` |
| `/favorites` | Saved favorites | Client-only (localStorage) |
| `/saved-searches` | Saved searches | Client-only (localStorage) |
| `/agents` | Agent profiles | Static |

### 6.2 Data Layer

| Module | Purpose | Resilience |
|---|---|---|
| `repliers-api.ts` | MLS data client | 8 s timeout, 2 retries, 60 s ISR cache |
| `follow-up-boss.ts` | CRM lead client | 8 s timeout, 1 retry, graceful degradation |
| `census-api.ts` | Demographics | 8 s timeout, 2 retries |
| `logger.ts` | Structured logging | Request + correlation IDs, duration metrics |
| `nlp-guard.ts` | NLP prompt firewall | Input validation, injection patterns, output sanitization |
| `rate-limit.ts` | Rate limiting | Token-bucket per IP per route |
| `fetch-with-retry.ts` | Resilient HTTP | AbortController timeout + exponential backoff |
| `auth.ts` | Client-side auth | localStorage only (no server state) |
| `communities-polygons.ts` | 4,145 polygons | Static build-time data |

---

## 7. Observability

Per Enterprise Architecture Guidelines v1.0, §Observability Baseline:

### Structured Logging

All API routes emit structured JSON logs via `src/lib/logger.ts`:

```json
{
  "level": "info",
  "timestamp": "2025-02-09T12:00:00.000Z",
  "requestId": "req_abc123def456",
  "correlationId": "req_abc123def456",
  "route": "/api/listings",
  "method": "GET",
  "message": "Listings search completed",
  "duration_ms": 245,
  "resultCount": 24,
  "total": 1482
}
```

### Key Metrics Emitted

| Metric | Source | Usage |
|---|---|---|
| `duration_ms` | Every `log.done()` call | Latency P50/P95/P99 |
| `level: "error"` | Error-path logs | Error rate |
| `resultCount` / `total` | Search completions | Throughput |
| `clientIp` + rate-limit logs | Rate limiter | Saturation / abuse detection |

### SLOs (Targets)

| Metric | Target | Measurement |
|---|---|---|
| Listing search latency (P95) | < 2 s | `duration_ms` on `/api/listings` |
| NLP search latency (P95) | < 5 s | `duration_ms` on `/api/nlp-search` |
| API error rate | < 1% | `level: "error"` / total requests |
| Availability | 99.5% | Vercel status + synthetic checks |

### Response Headers

Every API response includes:
- `X-Request-Id` — unique per request
- `X-Correlation-Id` — propagated from upstream or = requestId

---

## 8. Caching Strategy

| Data | Cache | TTL | Location |
|---|---|---|---|
| Repliers API responses | Next.js ISR (`next.revalidate`) | 60 s | Vercel edge |
| Static assets | Immutable hash | Indefinite | Vercel CDN |
| Community polygons | Build-time bundle | Until next deploy | JS bundle |
| Listing photos | Browser + CDN | cdn.repliers.io headers | Browser |

---

## 9. Future Architecture Considerations

- **Database:** PostgreSQL schema exists (`src/db/schema.sql`) — activate for durable community data and server-side user state
- **Authentication:** Currently localStorage-only; may need server auth for cross-device sync (see ADR-003)
- **Full observability:** Add Sentry for error tracking, Vercel Analytics for metrics dashboard
- **CI/CD:** Add `npm audit`, build, lint to GitHub Actions (Principle §4)
- **Test suite:** Add API route integration tests, NLP regression tests
