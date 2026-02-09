# ADR-002: Repliers API as Single MLS Data Source

**Status:** Accepted  
**Date:** 2025-02-03  
**Deciders:** Spyglass Realty Engineering  
**Governance:** [Enterprise Architecture Guidelines v1.0](../docs/spyglass_enterprise_arch.pdf), February 2026

## Context

Real estate IDX applications need access to MLS (Multiple Listing Service) data. Options for accessing Austin-area MLS data include:

1. **Direct RETS/RESO feed** — Raw MLS data feed. Requires server infrastructure to ingest, store, and index hundreds of thousands of listings. Compliance burden (photo expiration, status sync, data accuracy rules).
2. **Repliers API** — Managed API that handles MLS compliance, data normalization, photo CDN, and search. Includes NLP endpoint for AI-powered search.
3. **IDX Broker / other IDX providers** — Turnkey solutions but with rigid UIs, limited customization, and WordPress-centric architecture.
4. **Hybrid (multiple sources)** — Combine feeds for broader coverage. Increases complexity significantly.

### Requirements

- Austin metro area MLS coverage (ACTRIS/ABOR)
- Real-time or near-real-time data freshness
- Polygon-based geographic search
- Photo CDN
- Minimal operational overhead
- AI/NLP search capability (desired)

## Decision

Use **Repliers API as the single source of truth** for all MLS listing data.

All listing data flows through `src/lib/repliers-api.ts`, which:
- Makes authenticated requests with server-side API key
- Transforms Repliers' response format to our internal `Listing` type
- Handles polygon search via POST with `map` body parameter
- Caches responses with `next.revalidate: 60` (60-second ISR)

The NLP search feature uses Repliers' `/nlp` endpoint, which interprets natural language prompts and returns structured search parameters.

## Consequences

### Positive

- **Zero data infrastructure:** No database, no RETS sync, no photo storage
- **MLS compliance handled:** Repliers manages data accuracy, photo rights, and status updates
- **Photo CDN included:** `cdn.repliers.io` serves optimized listing images
- **NLP/AI built-in:** Natural language search without building our own LLM pipeline
- **Fast development:** API-first means we focus on UX, not data plumbing
- **Geographic search:** Native polygon/bounding box support

### Negative

- **Single point of failure:** If Repliers is down, no listings display at all
- **API cost:** Per-request pricing means cost scales with traffic
- **Data format dependency:** Repliers' response schema is our data contract — breaking changes require immediate updates
- **No offline/local data:** Can't search or display listings without API access
- **Limited customization:** Search behavior constrained by Repliers' capabilities

### Mitigations

- **Caching:** 60-second `revalidate` reduces API calls significantly
- **Graceful degradation:** Show cached/stale data when possible
- **Response transformation:** Our `Listing` type insulates UI from Repliers schema changes
- **Monitoring:** Log API errors and response times for early detection
- **Fallback:** Consider adding a cache layer (Redis/KV) if Repliers uptime is a concern

## Rollback Plan

If Repliers becomes unavailable, too expensive, or insufficient:
1. **Short-term:** Add Redis/KV cache layer to serve stale data during outages (hours to implement)
2. **Medium-term:** Switch to alternative managed MLS API (e.g., Spark API, Bridge Interactive)
3. **Long-term:** Set up direct RETS/RESO feed with local database (weeks of work — requires data infrastructure)
4. Our `Listing` type and `transformListing()` function insulate the UI from the data source — only `repliers-api.ts` needs to change
