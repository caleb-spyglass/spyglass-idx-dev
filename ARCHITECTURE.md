# Architecture Overview — Spyglass IDX

> **Last updated:** 2025-02-09  
> **Status:** Production (spyglass-idx.vercel.app)  
> **Owner:** Spyglass Realty Engineering

---

## 1. System Summary

Spyglass IDX is a Next.js 16 real estate search application deployed on Vercel. It provides MLS listing search, community/neighborhood browsing with geo-spatial polygon filtering, AI-powered natural language search, and lead capture integrated with Follow Up Boss CRM. The app also supports WordPress iframe embedding for seamless integration with the main Spyglass Realty website.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | Next.js 16.1.6 | App Router, React 19, Server Components |
| **Language** | TypeScript 5 | Strict mode |
| **Styling** | Tailwind CSS 4 | PostCSS pipeline |
| **Maps** | Leaflet + react-leaflet 5 | OSM tiles, polygon overlays |
| **Hosting** | Vercel | Edge network, serverless functions |
| **MLS Data** | Repliers API | Single source of truth for listings |
| **CRM** | Follow Up Boss | Lead capture and routing |
| **CDN (Images)** | cdn.repliers.io | MLS listing photos |
| **Geo Processing** | @turf/helpers, @turf/simplify | Polygon simplification (build-time) |

---

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USERS / BROWSERS                         │
│  (Desktop, Mobile, WordPress iframe via ?embed=true)            │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     VERCEL EDGE NETWORK                          │
│  ┌─────────────┐  ┌──────────────────┐  ┌───────────────────┐  │
│  │  Static CDN  │  │  SSR / RSC       │  │  API Routes       │  │
│  │  (assets,    │  │  (Server         │  │  (serverless      │  │
│  │   .next)     │  │   Components)    │  │   functions)      │  │
│  └─────────────┘  └──────────────────┘  └─────────┬─────────┘  │
└───────────────────────────────────────────────────┬─────────────┘
                                                    │
                          ┌─────────────────────────┼──────────┐
                          │                         │          │
                          ▼                         ▼          ▼
               ┌─────────────────┐     ┌──────────────┐  ┌────────┐
               │  Repliers API   │     │ Follow Up    │  │ Census │
               │  (MLS Data)     │     │ Boss API     │  │ API    │
               │                 │     │ (CRM)        │  │ (Stats)│
               └─────────────────┘     └──────────────┘  └────────┘
```

---

## 4. Data Flow

### 4.1 Listing Search (Standard)

```
Browser → GET /api/listings?filters → Vercel Serverless
  → Repliers API (GET /listings with query params)
  → Transform RepliersListing → Listing
  → Return SearchResults JSON
```

### 4.2 Polygon/Community Search

```
Browser → POST /api/listings (body: { polygon, filters })
  → Vercel Serverless
  → Repliers API (POST /listings with { map: [[[lng,lat],...]] })
  → Transform → Return
```

### 4.3 NLP / AI Search

```
Browser → POST /api/nlp-search { prompt, nlpId? }
  → Vercel Serverless
  → Step 1: POST Repliers /nlp → get generated search URL + params
  → Step 2: Match community polygon from prompt text (local)
  → Step 3: Fetch listings via Repliers /listings (GET or POST w/ polygon)
  → Return { listings, nlpId, summary, matchedCommunity }
```

### 4.4 Lead Capture

```
Browser → POST /api/leads { name, email, phone, message, formType, ... }
  → Vercel Serverless
  → Follow Up Boss API: POST /people (create/update)
  → Follow Up Boss API: POST /events (log inquiry)
  → Return { success, personId }
```

### 4.5 Community Stats

```
Browser → GET /api/communities/[slug]/stats
  → Vercel Serverless
  → Load polygon from static data
  → Repliers API: POST /listings with polygon (up to 200)
  → Calculate stats (median price, avg DOM, property mix, etc.)
  → Return { stats }
```

---

## 5. Component Architecture

### 5.1 Pages (App Router)

| Route | Component | Data Strategy |
|---|---|---|
| `/` | Home page | Client-side search |
| `/communities` | Communities list | Server Component + client island |
| `/communities/[slug]` | Community detail | SSR with listings fetch |
| `/listing/[mls]` | Listing detail | SSR via `getListing()` |
| `/favorites` | Saved favorites | Client-only (localStorage) |
| `/saved-searches` | Saved searches | Client-only (localStorage) |
| `/agents` | Agent profiles | Static |

### 5.2 Key Client Components

- **`AISearchBar`** — Natural language search input, calls `/api/nlp-search`
- **`FilterBar` / `FilterModal`** — Structured filter controls (price, beds, baths, etc.)
- **`ListingsGrid`** — Responsive listing card grid with pagination
- **`PropertyCard`** — Individual listing card with photo, price, details
- **`LeafletMap` / `MapView`** — Interactive map with listing pins and community polygons
- **`CommunitiesMap`** — Map overlay showing all community polygon boundaries
- **`LeadCaptureForm` / `ContactModal`** — Lead forms → Follow Up Boss
- **`UserMenu`** — localStorage-based auth UI
- **`PhotoGallery`** — Listing photo viewer
- **`SimilarListings`** — Related listings by price range

### 5.3 Data Layer

- **`src/lib/repliers-api.ts`** — Authenticated Repliers API client with caching (`next.revalidate: 60s`)
- **`src/lib/follow-up-boss.ts`** — FUB API client (Basic auth)
- **`src/lib/census-api.ts`** — Census demographic data
- **`src/lib/auth.ts`** — Client-side localStorage auth (no server auth)
- **`src/data/communities-polygons.ts`** — 4,145 community polygon definitions (static)

---

## 6. API Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/listings` | Search listings with query param filters |
| `POST` | `/api/listings` | Search with polygon body |
| `GET` | `/api/listings/[mls]` | Single listing by MLS number |
| `GET` | `/api/listings/similar` | Similar listings by price range |
| `GET` | `/api/communities` | List all communities (filterable) |
| `GET` | `/api/communities/[slug]` | Community detail + listings |
| `GET` | `/api/communities/[slug]/stats` | Community market statistics |
| `POST` | `/api/nlp-search` | AI natural language search |
| `POST` | `/api/leads` | Submit lead to Follow Up Boss |

See **[openapi.yaml](./openapi.yaml)** for full API contract documentation.

---

## 7. Deployment Architecture

### Environment

- **Platform:** Vercel (Hobby/Pro plan)
- **Region:** Auto (closest to user, functions in `iad1` by default)
- **Build:** `next build` → static + serverless output
- **Git Integration:** Push to `main` triggers auto-deploy

### Environment Variables (Server-Side Only)

| Variable | Required | Description |
|---|---|---|
| `REPLIERS_API_KEY` | ✅ | MLS data API key |
| `REPLIERS_API_URL` | ❌ | Override API base (default: `https://api.repliers.io`) |
| `FUB_API_KEY` | ❌ | Follow Up Boss API key (leads degrade gracefully without) |
| `FUB_BASE_URL` | ❌ | FUB API base URL |
| `DATABASE_URL` | ❌ | PostgreSQL (future use) |
| `NEXT_PUBLIC_SITE_URL` | ❌ | Canonical site URL |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | ❌ | Optional Mapbox token |
| `WORDPRESS_SITE_URL` | ❌ | Parent WordPress site URL |

### Caching Strategy

- **Repliers API calls:** `next.revalidate: 60` (ISR-style 60-second cache)
- **Static assets:** Immutable hashed filenames via Vercel CDN
- **Community polygon data:** Bundled at build time (static import)

---

## 8. External Dependencies

| Dependency | Purpose | Failure Impact |
|---|---|---|
| **Repliers API** | All MLS listing data | **Critical** — app cannot show listings |
| **Follow Up Boss** | Lead capture | **Degraded** — leads logged locally, user sees success |
| **Census API** | Community demographics | **Degraded** — stats section empty |
| **Leaflet/OSM tiles** | Map rendering | **Degraded** — map won't render, listings still work |
| **cdn.repliers.io** | Listing photos | **Degraded** — broken images |
| **Vercel** | Hosting & serverless | **Critical** — site is down |

---

## 9. Future Architecture Considerations

- **Database:** PostgreSQL schema exists (`src/db/schema.sql`) for community zones — not yet active
- **Authentication:** Currently localStorage-only; may need server-side auth for saved searches sync
- **Rate Limiting:** No server-side rate limiting on API routes yet (see SECURITY.md)
- **Search Indexing:** Community polygon matching is in-memory; may need index at scale
- **Monitoring:** Structured logging being added (see `src/lib/logger.ts`)
