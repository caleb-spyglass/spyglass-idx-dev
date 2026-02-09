# Changelog

All notable changes to the Spyglass IDX project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.2.0] — 2025-02-09

### Added — Enterprise Architecture Compliance

Aligned with [Enterprise Architecture Guidelines v1.0](./docs/spyglass_enterprise_arch.pdf), February 2026.

#### Documentation
- **ARCHITECTURE.md** — C4-style diagrams (Context, Container, Deployment), tech stack, data flows, API paved road compliance matrix, observability baseline, SLOs
- **SECURITY.md** — Data classification table, STRIDE threat model, AI/LLM security controls, production security checklist, incident response matrix
- **RUNBOOK.md** — SLOs, structured incident playbooks (INC-1 through INC-6), deployment checklist, backup/restore plan, scaling thresholds
- **ADR/** — 5 Architecture Decision Records with Context, Alternatives, Decision, Consequences, and Rollback Plan sections:
  - ADR-001: Next.js + Vercel
  - ADR-002: Repliers API as single MLS data source
  - ADR-003: localStorage for user auth/favorites
  - ADR-004: POST with map param for polygon searches
  - ADR-005: Community polygon data sources and merge strategy
- **openapi.yaml** — Full OpenAPI 3.1 contract for all 9 API endpoints
- **CHANGELOG.md** — This file
- **README.md** — Rewritten with quick start, project structure, documentation index

#### Resilience (§8 — "Fail safely")
- **`src/lib/fetch-with-retry.ts`** — Resilient HTTP fetch wrapper with configurable timeouts (AbortController) and exponential-backoff retries
- **`src/lib/repliers-api.ts`** — Now uses `fetchWithRetry` (8 s timeout, 2 retries) for all Repliers API calls
- **`src/lib/follow-up-boss.ts`** — Now uses `fetchWithRetry` (8 s timeout, 1 retry) for all FUB API calls
- **`src/app/api/nlp-search/route.ts`** — NLP call: 12 s timeout, 1 retry; listings fetch: 8 s timeout, 2 retries

#### Security (§7 — "Security is a feature")
- **`src/lib/nlp-guard.ts`** — NLP prompt firewall with input validation (3–500 chars), 19 injection detection patterns, output sanitization (`sanitizeNLPSummary`)
- **`src/lib/rate-limit.ts`** — In-memory token-bucket rate limiter per IP; wired into `/api/nlp-search` (10/min) and `/api/leads` (5/min)
- Rate-limited responses include `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining` headers

#### Observability (§Observability Baseline)
- **`src/lib/logger.ts`** — Structured JSON logging with request IDs, correlation IDs (propagated via `X-Correlation-Id` header), and automatic `duration_ms` on `log.done()`
- All API routes (`/api/listings`, `/api/leads`, `/api/nlp-search`) updated with structured logging
- `X-Request-Id` and `X-Correlation-Id` response headers on all API routes
- Error messages sanitized in production (no stack traces or upstream error bodies)

### Changed
- `repliers-api.ts` — Switched from raw `fetch()` to `fetchWithRetry()` with timeout + retry
- `follow-up-boss.ts` — Switched from raw `fetch()` to `fetchWithRetry()` with timeout + retry
- `nlp-search/route.ts` — Added prompt firewall, rate limiting, structured logging, output sanitization, timeouts + retries on all external calls
- `listings/route.ts` — Added structured logging with request IDs and duration metrics
- `leads/route.ts` — Added structured logging, rate limiting; removed error detail leakage in production responses

---

## [0.1.0] — 2025-02-03

### Added — Initial Release
- Next.js 16 application with App Router
- Repliers API integration for MLS listing search
- Community/neighborhood browsing with 4,145 polygon boundaries
- AI-powered natural language search via Repliers NLP endpoint
- Follow Up Boss CRM integration for lead capture
- Leaflet maps with polygon overlays
- localStorage-based user auth, favorites, and saved searches
- WordPress embed mode (`?embed=true`)
- Community pages with SSR, market stats, nearby communities
- Listing detail pages with photo gallery and similar listings
- Deployed on Vercel with auto-deploy from `main` branch
