# ADR-004: POST with Map Param for Polygon Searches

**Status:** Accepted  
**Date:** 2025-02-04  
**Deciders:** Spyglass Realty Engineering  
**Governance:** [Enterprise Architecture Guidelines v1.0](../docs/spyglass_enterprise_arch.pdf), February 2026

## Context

Community-based listing search requires filtering listings within geographic polygon boundaries. With 4,145 communities, polygons can have 50–500+ coordinate pairs each.

### The Problem

HTTP GET requests have practical URL length limits (~2,000–8,000 characters depending on browser/server). A polygon with 100 points in query string format would exceed this:

```
/api/listings?polygon=30.2672,-97.7431;30.2680,-97.7425;30.2691,-97.7410;...
```

### Options Considered

1. **GET with polygon in query string** — Simple but hits URL length limits for complex polygons. Would require polygon simplification to very few points.
2. **POST with polygon in request body** — No length limits. Repliers API natively supports `POST /listings` with `{ map: [[[lng, lat], ...]] }` body.
3. **Server-side polygon lookup** — Client sends community slug, server looks up polygon and makes the Repliers call. Simpler client, but adds a mapping layer.
4. **GeoJSON in query (base64 encoded)** — Technically works but ugly, hard to debug, and still has length limits.

### Repliers API Behavior

The Repliers API supports two search modes:
- **GET /listings?area=Travis&status=A&...** — Standard query param search
- **POST /listings** with body `{ map: [[[lng, lat], [lng, lat], ...]] }` — Polygon geographic filter, combinable with query params

## Decision

Use **POST requests with the `map` parameter in the request body** for all polygon-based searches.

### Implementation

**Internal API (`POST /api/listings`):**
```typescript
// Client sends polygon in body
const results = await fetch('/api/listings', {
  method: 'POST',
  body: JSON.stringify({
    polygon: community.polygon.map(([lng, lat]) => ({ lat, lng })),
    ...filters
  })
});
```

**Repliers API call (in `repliers-api.ts`):**
```typescript
// Convert to Repliers format: [[[lng, lat], ...]]
const ring = polygon.map(p => [p.lng, p.lat]);
ring.push(ring[0]); // Close the ring

await repliersRequest({
  endpoint: '/listings',
  method: 'POST',
  params: { status: 'A', type: 'Sale', ... },
  body: { map: [ring] }
});
```

**NLP Search (in `nlp-search/route.ts`):**
When the NLP prompt matches a community name, the polygon is automatically added:
```typescript
const matchedCommunity = findCommunityFromPrompt(prompt);
if (matchedCommunity) {
  postBody = { map: [matchedCommunity.polygon] };
  // Use POST instead of GET for the listings fetch
}
```

## Consequences

### Positive

- **No polygon size limits:** Can use full-resolution polygons (500+ points)
- **Native Repliers support:** POST with `map` is a first-class Repliers feature
- **Combinable:** Query params (price, beds, status) work alongside polygon body
- **Accurate boundaries:** No need to simplify polygons and lose precision
- **Consistent pattern:** Same POST body approach for direct polygon search and NLP-matched search

### Negative

- **Not cacheable by default:** POST requests bypass HTTP caching (mitigated by `next.revalidate`)
- **Two code paths:** GET for standard search, POST for polygon search
- **Client must know polygon:** Client-side needs community polygon data (or sends slug for server-side lookup)

### Technical Notes

- Repliers expects coordinates in **[longitude, latitude]** format (GeoJSON standard)
- Polygon rings must be **closed** (first point = last point)
- Our community data stores polygons in `[lng, lat]` format, matching Repliers
- The `map` parameter is an array of rings: `[[[lng, lat], ...]]` (supports multi-polygon)

## Rollback Plan

If POST-with-polygon approach needs to change:
1. **Switch to server-side slug lookup:** Client sends `?community=barton-hills`, server looks up polygon from static data and makes the Repliers POST call. Reduces client complexity but adds coupling.
2. **Simplify polygons for GET:** Use `@turf/simplify` with aggressive tolerance to fit polygons in GET query strings. Loses boundary precision.
3. No data migration needed — only API route handler and client-side fetch logic changes.
