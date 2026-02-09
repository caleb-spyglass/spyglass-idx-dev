# Operations Runbook — Spyglass IDX

> **Last updated:** 2025-02-09  
> **Production URL:** https://spyglass-idx.vercel.app  
> **Owner:** Spyglass Realty Engineering

---

## 1. Deployment

### Platform

Vercel with automatic Git integration. Push to `main` triggers a production deployment.

### Deploy Process

```bash
# Standard deploy (automatic via git push)
git push origin main

# Manual deploy via Vercel CLI
npx vercel --prod

# Preview deploy (any branch or PR)
git push origin feature-branch
# → Vercel creates preview URL automatically
```

### Build Command

```bash
npm run build    # → next build
```

**Build time:** ~30–60 seconds (depends on static generation)

### Pre-Deploy Checklist

- [ ] `npm run build` passes locally
- [ ] `npm run lint` passes
- [ ] Environment variables are set in Vercel dashboard
- [ ] No `.env` or secrets in committed files

---

## 2. Environment Variables

Configure in **Vercel Dashboard → Settings → Environment Variables**.

### Required

| Variable | Example | Description |
|---|---|---|
| `REPLIERS_API_KEY` | `rpl_xxxxxxxxxxxx` | Repliers MLS API key — **required for any listing data** |

### Optional (Feature-Dependent)

| Variable | Example | Description |
|---|---|---|
| `REPLIERS_API_URL` | `https://api.repliers.io` | Override Repliers base URL (default shown) |
| `FUB_API_KEY` | `fub_xxxxxxxxxxxx` | Follow Up Boss API key — leads degrade gracefully without |
| `FUB_BASE_URL` | `https://api.followupboss.com/v1` | Override FUB base URL |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection (future use) |
| `NEXT_PUBLIC_SITE_URL` | `https://idx.spyglassrealty.com` | Canonical URL for SEO |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `pk.xxx` | Optional Mapbox token |
| `WORDPRESS_SITE_URL` | `https://www.spyglassrealty.com` | WordPress site for embed mode |

### Local Development

```bash
cp .env.example .env.local
# Edit .env.local with real values
npm run dev
```

---

## 3. Monitoring & Observability

### Current Monitoring

| What | Where | Notes |
|---|---|---|
| Deploy status | Vercel Dashboard | Auto-deploy on push |
| Serverless function logs | Vercel → Logs tab | Real-time + 1h retention (Hobby) |
| Build logs | Vercel → Deployments | Full build output |
| Error tracking | `console.error` in routes | Visible in Vercel logs |

### Structured Logging (Added)

API routes use `src/lib/logger.ts` for structured JSON logging:

```json
{
  "timestamp": "2025-02-09T12:00:00.000Z",
  "level": "info",
  "requestId": "req_abc123",
  "route": "/api/listings",
  "method": "GET",
  "message": "Listings search completed",
  "duration_ms": 245,
  "resultCount": 24
}
```

Request IDs are generated per-request and included in response headers (`X-Request-Id`).

### ⚠️ Recommended Additions

- **Upstash/Vercel Analytics** for real-time metrics
- **Sentry** for error tracking with source maps
- **Repliers API health check** — ping `/listings?resultsPerPage=1` periodically

---

## 4. Troubleshooting

### 4.1 "Failed to fetch listings" / Empty Results

**Symptoms:** Listings page shows error or no results  
**Likely Cause:** Repliers API key issue

```bash
# Verify API key is set
vercel env ls

# Test Repliers API directly
curl -H "REPLIERS-API-KEY: $REPLIERS_API_KEY" \
  "https://api.repliers.io/listings?area=Travis&resultsPerPage=1"
```

**Fixes:**
- Check Repliers API key is valid and not expired
- Check Repliers API status (contact support)
- Verify `REPLIERS_API_KEY` env var is set for Production environment in Vercel

---

### 4.2 Lead Form Submissions Failing

**Symptoms:** Form appears to succeed (we return 200 always) but leads don't appear in FUB  
**Likely Cause:** FUB API key issue or missing env var

```bash
# Check logs for FUB errors
# In Vercel Dashboard → Logs, search for "Lead submission error" or "FUB API error"

# Test FUB API directly
curl -u "$FUB_API_KEY:" \
  "https://api.followupboss.com/v1/people?limit=1"
```

**Fixes:**
- Verify `FUB_API_KEY` is set in Vercel env vars
- Check FUB account status and API permissions
- Note: Without `FUB_API_KEY`, leads are logged to console only (graceful degradation)

---

### 4.3 NLP Search Returns Unexpected Results

**Symptoms:** AI search returns wrong listings or errors  
**Likely Cause:** Repliers NLP interpretation issue

**Debug Steps:**
1. Check Vercel logs for `NLP generated URL:` to see what Repliers interpreted
2. Check if community matching is working: look for `Matched community:` in logs
3. Try the generated URL directly against Repliers API
4. If 406 response: prompt was rejected as non-real-estate

**Fixes:**
- Adjust prompt wording
- Check if community name is in the polygon dataset
- Report persistent NLP issues to Repliers support

---

### 4.4 Map Not Loading

**Symptoms:** Map area is blank or grey  
**Likely Cause:** Leaflet tile server issue or CSP blocking

**Fixes:**
- Check browser console for tile loading errors
- OSM tile servers occasionally have issues — usually self-resolving
- Verify no ad-blocker is blocking `tile.openstreetmap.org`
- Listings and search still work without the map

---

### 4.5 WordPress Embed Issues

**Symptoms:** Embedded IDX shows wrong styling or navigation issues  
**Likely Cause:** `?embed=true` not passed or iframe config

**Fixes:**
- Ensure WordPress iframe includes `?embed=true` query param
- Check `X-Frame-Options` header isn't blocking the WordPress domain
- Verify the WordPress URL matches `WORDPRESS_SITE_URL` env var

---

### 4.6 Build Failures

**Symptoms:** Vercel deploy fails  
**Common Causes:**

| Error | Fix |
|---|---|
| TypeScript errors | `npm run build` locally to see full errors |
| Missing env vars at build | Ensure vars are set for "Production" in Vercel |
| Memory limit exceeded | Simplify community polygon data or increase function memory |
| Module not found | `npm install` and commit `package-lock.json` |

```bash
# Local build to catch issues before pushing
npm run build
```

---

## 5. Scaling Considerations

### Current Limits

- **Vercel Hobby:** 100GB bandwidth, 100 hours serverless execution/month
- **Repliers API:** Rate limits per API key (check your plan)
- **FUB API:** Rate limits per account
- **Community polygons:** 4,145 polygons loaded in memory per serverless function invocation

### When to Scale

- **>50k monthly visitors:** Consider Vercel Pro
- **Slow polygon matching:** Move to database with spatial index (PostGIS)
- **Rate limit hits on Repliers:** Cache frequently-accessed listings with Redis/KV
- **Lead volume >100/day:** Implement server-side rate limiting to prevent spam

---

## 6. Rollback

### Instant Rollback via Vercel

1. Go to **Vercel Dashboard → Deployments**
2. Find the last known good deployment
3. Click **⋮ → Promote to Production**

### Git Rollback

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-sha>
git push --force origin main  # ⚠️ Use with caution
```

---

## 7. Contacts

| Role | Contact | Notes |
|---|---|---|
| **Engineering** | Spyglass Realty dev team | Primary |
| **Repliers Support** | support@repliers.io | MLS API issues |
| **FUB Support** | Follow Up Boss help desk | CRM integration |
| **Vercel Support** | Vercel dashboard | Hosting issues |
