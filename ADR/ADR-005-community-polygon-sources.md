# ADR-005: Community Polygon Data Sources and Merge Strategy

**Status:** Accepted  
**Date:** 2025-02-05  
**Deciders:** Spyglass Realty Engineering  
**Governance:** [Enterprise Architecture Guidelines v1.0](../docs/spyglass_enterprise_arch.pdf), February 2026

## Context

The Spyglass IDX app needs geographic polygon boundaries for Austin-area communities and neighborhoods to enable:
- Community-specific listing searches (filter listings within a polygon)
- Community map visualization (show polygon outlines on the map)
- NLP search community matching (match "homes in Barton Hills" to the correct polygon)

Austin has ~4,000+ named communities, neighborhoods, subdivisions, and municipalities across Travis, Williamson, Hays, and Bastrop counties.

### Data Source Challenges

No single authoritative source exists for Austin community boundaries:
- **City of Austin** publishes some neighborhood association boundaries, but coverage is incomplete
- **MLS areas** are broad (county-level), not neighborhood-level
- **Real estate portals** (Realty Austin, Zillow) have their own boundary datasets, but they're proprietary
- **Census tracts/block groups** don't align with named communities
- **OpenStreetMap** has some neighborhoods but inconsistent coverage

### Sources Evaluated

1. **Realty Austin neighborhood data** — Scraped 2,500+ neighborhoods with polygons from their public-facing site. Good Austin metro coverage.
2. **Austin Community Inventory (City of Austin open data)** — Official neighborhood planning areas. Limited to City of Austin proper.
3. **GeoJSON community files (open data)** — Various open datasets for Texas communities.
4. **Manual polygon drawing** — For communities not covered by any source.
5. **CSV/spreadsheet community lists** — Names and basic metadata without polygons.

## Decision

**Merge multiple data sources** into a single unified polygon dataset, stored as a static TypeScript module (`src/data/communities-polygons.ts`).

### Merge Strategy

1. **Primary source:** Realty Austin scraped data (`data/realtyaustin-neighborhoods.json`) — broadest coverage with pre-built polygons
2. **Supplementary:** City of Austin community inventory (`data/communities.csv` + `data/communities.geojson`)
3. **Enrichment:** Census data for community stats (`src/lib/census-api.ts`)
4. **Deduplication:** Match by name similarity, prefer source with more polygon points
5. **Simplification:** Use `@turf/simplify` to reduce polygon complexity for large boundaries (tolerance: 0.001)

### Data Pipeline (Build-Time)

```
data/realtyaustin-neighborhoods.json  ──┐
data/communities.geojson              ──┼──→ scripts/merge-polygons.ts
data/communities.csv                  ──┘         │
                                                  ▼
                                    src/data/communities-polygons.ts
                                    (4,145 communities, static TS module)
```

### Data Format

Each community polygon is stored as:
```typescript
interface CommunityPolygon {
  name: string;           // Display name
  slug: string;           // URL slug
  county: string;         // Travis, Williamson, Hays, Bastrop
  featured: boolean;      // Show in featured communities
  polygon: [number, number][];      // [[lng, lat], ...] for Repliers API
  displayPolygon: [number, number][];  // [[lat, lng], ...] for Leaflet map display
}
```

Note the dual polygon formats:
- `polygon` — `[lng, lat]` (GeoJSON/Repliers standard) for API calls
- `displayPolygon` — `[lat, lng]` (Leaflet standard) for map rendering

## Consequences

### Positive

- **Comprehensive coverage:** 4,145 communities spanning the entire Austin metro
- **Fast lookups:** Static data bundled at build time — no database queries for polygon matching
- **NLP integration:** Community name matching works against the full dataset
- **Deterministic:** Same data on every deploy — no runtime data fetching for polygons
- **Offline-capable:** Polygon data is part of the JavaScript bundle

### Negative

- **Bundle size:** ~2MB of polygon data in the JS bundle (compressed: ~400KB)
- **Stale data:** Community boundaries don't change often, but any update requires a code change + deploy
- **Memory usage:** All 4,145 polygons loaded in memory per serverless function invocation
- **Data quality:** Scraped data may have inaccuracies — some polygons may not perfectly match real boundaries
- **Maintenance:** No automated pipeline to refresh data from sources

### Future Improvements

- Move polygon data to **PostgreSQL with PostGIS** for spatial queries (schema exists in `src/db/schema.sql`)
- Add an **admin interface** for polygon editing/correction
- Implement **automated data refresh** from open data sources
- Use **spatial indexing** for faster community matching in NLP search
- Consider **lazy loading** polygons to reduce initial bundle size

### Data Files Reference

| File | Description |
|---|---|
| `data/realtyaustin-neighborhoods.json` | Raw scraped Realty Austin data |
| `data/realtyaustin-checkpoint.json` | Scraping progress checkpoint |
| `data/communities.csv` | Community name/metadata list |
| `data/communities.geojson` | Community polygon geometries |
| `data/community-polygons.csv` | Processed polygon data |
| `src/data/communities-polygons.ts` | **Final merged output** (4,145 communities) |
| `src/data/communities-polygons.ts.backup` | Pre-merge backup |
| `src/data/austin-communities.ts` | Austin-specific community subset |
| `scripts/` | Merge and processing scripts |

## Rollback Plan

If static bundle approach becomes unsustainable (bundle size, staleness):
1. **Database migration:** Load polygons into PostgreSQL with PostGIS extension (schema draft: `src/db/schema.sql`)
2. **Spatial queries:** Replace in-memory `findCommunityFromPrompt()` with `ST_Contains()` / `ST_Intersects()`
3. **Admin UI:** Build polygon editor for manual corrections
4. **Data retained:** Current `communities-polygons.ts` serves as seed data for the database migration
5. Static file stays in repo as backup / fallback
