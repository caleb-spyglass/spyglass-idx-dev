# MLS Integration with Repliers API

This document describes the full Repliers MLS API integration implemented for the Spyglass IDX site, transforming it from static data to a live MLS-driven system.

## Overview

The integration includes:

1. **Correct Database Connection** - Render PostgreSQL database
2. **Repliers Geo-Spatial API** - Polygon-based listing searches
3. **Live MLS Data** - Real-time listings instead of static files
4. **Enhanced Admin Interface** - Mission Control with MLS management
5. **Performance Optimization** - Database caching system

## Database Configuration

### Environment Variables

```bash
# Updated .env file
DATABASE_URL=postgresql://spyglass_db_user:elXT5DAowpZq81OVzNmrFkDFZX5g909h@dpg-d5em253e5dus73bvtkhg-a.oregon-postgres.render.com/spyglass_db
REPLIERS_API_KEY=sSOnHkc9wVilKtkd7N2qRs2R2WMH00
```

### Database Setup

Initialize the database with required tables:

```bash
npm run init-db
```

This creates:
- `listings_cache` - Cached MLS listing data
- `communities_cache` - Community metadata cache
- `market_stats_cache` - Market statistics cache

## Repliers Geo-Spatial API Integration

### Polygon-Based Searches

The integration uses Repliers' geo-spatial API with polygon filtering:

```typescript
// Single polygon search
const listings = await searchByPolygon(
  [[lng, lat], [lng, lat], ...], // Community boundary
  { minPrice: 500000, maxPrice: 1000000 }
);

// Multi-polygon search
const listings = await searchByMultiPolygon(
  [
    [[lng, lat], ...], // Polygon 1
    [[lng, lat], ...]  // Polygon 2
  ],
  'OR', // or 'AND'
  { minBeds: 3 }
);
```

### Live Market Data

Get real-time market statistics for any area:

```typescript
const marketData = await getLiveMarketData({
  polygon: communityPolygon,
  // or area: 'Travis',
  // or city: 'Austin',
  // or zip: '78704'
});

// Returns:
// {
//   activeListings: 247,
//   medianPrice: 650000,
//   avgDaysOnMarket: 28,
//   pricePerSqft: 312,
//   ...
// }
```

## API Endpoints

### Enhanced Communities API

```bash
# Standard communities
GET /api/communities

# With live MLS data
GET /api/communities?live=true

# Individual community with MLS data
GET /api/communities/{slug}?live=true
```

### New Zip Code Listings API

```bash
# Zip code listings with polygon boundary
GET /api/zip-codes/{zipcode}/listings?polygon=true&minPrice=500000
```

### Admin APIs

```bash
# Get MLS statistics
GET /api/admin/mls-stats

# Sync MLS data
POST /api/admin/sync-mls

# Refresh cache
POST /api/admin/refresh-cache
```

## Components

### MLS-Enhanced Maps

```tsx
import MLSMapView from '@/components/map/MLSMapView';

<MLSMapView
  listings={listings}
  zipCodePolygons={zipPolygons}
  communityPolygons={communityPolygons}
  showListings={true}
  showPolygons={true}
  showListingCounts={true}
  onPolygonClick={(slug, type) => {
    // Navigate to community or zip code
  }}
/>
```

### Admin Dashboard

```tsx
import MLSDataDashboard from '@/components/admin/MLSDataDashboard';

<MLSDataDashboard showControls={true} />
```

## Scripts

### Initialize Database

```bash
npm run init-db
```

Sets up PostgreSQL tables and indexes.

### Sync MLS Data

```bash
npm run sync-mls
```

Fetches all communities from Mission Control, enhances them with live MLS data from Repliers, and caches the results. Shows summary statistics and top communities.

Example output:
```
🚀 Starting MLS Data Sync...

🏘️  Fetching communities from Mission Control...
📊 Enhanced 156 communities with live MLS data
📈 Total active listings across all communities: 3,247
💰 Average median price: $487,500

🏆 Top 10 communities by active listings:
1. Downtown: 89 listings, $525,000 median
2. South Lamar: 67 listings, $445,000 median
...

✅ MLS data sync completed in 12s
```

## Performance Optimizations

### Caching Strategy

- **Listings Cache**: 1 hour TTL
- **Communities Cache**: 24 hours TTL  
- **Market Stats Cache**: 6 hours TTL

### Database Indexes

```sql
CREATE INDEX idx_listings_cache_expires ON listings_cache(expires_at);
CREATE INDEX idx_communities_cache_expires ON communities_cache(expires_at);
CREATE INDEX idx_market_stats_expires ON market_stats_cache(expires_at);
```

### Parallel Processing

MLS data fetching uses parallel processing for multiple communities:

```typescript
const mlsCommunities = await Promise.all(
  communities.slice(0, 50).map(async (community) => {
    // Fetch MLS data in parallel
  })
);
```

## Migration from Static Data

### Before (Static)

```typescript
// Old: Static community data
const communities = COMMUNITIES.filter(c => c.county === 'Travis');
```

### After (Live MLS)

```typescript
// New: Live MLS-enhanced communities
const communities = await searchMLSCommunities({
  county: 'Travis',
  includeLiveData: true
});

// Each community now has:
// {
//   ...staticData,
//   liveStats: {
//     activeListings: 45,
//     medianPrice: 675000,
//     avgDaysOnMarket: 22,
//     lastUpdated: Date
//   },
//   listingsCount: 45
// }
```

## Issues Fixed

### 1. Communities Access

**Before**: Only 8 static communities
**After**: 150+ live communities with real MLS data

### 2. Map Functionality

**Before**: Broken maps with no listings
**After**: Interactive maps showing real properties within zip/community boundaries

### 3. Market Data

**Before**: Static/outdated market files
**After**: Live market statistics from MLS

### 4. Admin Interface

**Before**: Static content management only
**After**: Full MLS data management with sync controls and analytics

## Error Handling

The system includes comprehensive fallbacks:

1. **API Fallback**: MLS-enhanced → Standard API → Static data
2. **Cache Fallback**: Live data → Cached data → Default values
3. **Map Fallback**: Interactive map → Static image
4. **Database Fallback**: PostgreSQL → In-memory cache

## Monitoring

### Logs

All API calls include request logging:

```
[Community API] Using MLS-enhanced data for Downtown Austin
[MLS Service] Polygon search returned 89 listings
[Cache] Cached market data for community_downtown (TTL: 30min)
```

### Admin Dashboard

Real-time monitoring of:
- Total communities with MLS data
- Active listings across all communities
- Cache status and sync health
- Top-performing communities

## Development

### Local Setup

1. Install dependencies:
```bash
npm install pg @types/pg
```

2. Set up environment:
```bash
cp .env.example .env
# Update DATABASE_URL and REPLIERS_API_KEY
```

3. Initialize database:
```bash
npm run init-db
```

4. Sync MLS data:
```bash
npm run sync-mls
```

### Testing

Test the MLS integration:

```bash
# Test community with MLS data
curl "http://localhost:3000/api/communities/downtown?live=true"

# Test zip code polygon search
curl "http://localhost:3000/api/zip-codes/78704/listings?polygon=true"

# Test admin stats
curl "http://localhost:3000/api/admin/mls-stats"
```

## Deployment

### Environment Variables

Ensure these are set in production:

```bash
DATABASE_URL=postgresql://...
REPLIERS_API_KEY=sSOnHkc9wVilKtkd7N2qRs2R2WMH00
MISSION_CONTROL_URL=https://missioncontrol-tjfm.onrender.com
PULSE_API_KEY=65610eb9740198d72a731970f797f4e627036742da7c8a6e8b283d33f8f7a1b7
```

### Build Process

The integration is fully compatible with Next.js static generation and incremental static regeneration (ISR).

### Monitoring

Set up alerts for:
- Database connection failures
- Repliers API rate limits
- Cache miss rates
- Sync failures

## Future Enhancements

1. **Real-time Updates** - WebSocket integration for live listing updates
2. **Advanced Filtering** - School districts, HOA fees, property features
3. **Market Trends** - Historical price data and trend analysis
4. **Automated Sync** - Scheduled MLS data refresh
5. **Performance Metrics** - Detailed analytics and monitoring

---

This MLS integration transforms the Spyglass IDX site into a fully dynamic, real-time property search platform powered by live MLS data through the Repliers API.