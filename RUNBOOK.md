# Operations Runbook — Spyglass IDX

> **Last updated:** 2025-02-09  
> **Production URL:** https://spyglass-idx.vercel.app  
> **Owner:** Spyglass Realty Engineering  
> **Governance:** Conforms to [Enterprise Architecture Guidelines v1.0](./docs/spyglass_enterprise_arch.pdf), February 2026

---

## 1. Deployment

### Platform

Vercel with automatic Git integration. Push to `main` triggers production deployment.

Per Vercel Platform Guidance (Enterprise Architecture Guidelines v1.0):
- ✅ **Use for:** Frontend hosting, SSR/ISR, Edge functions
- ❌ **Avoid:** Long-running jobs, heavy compute

### Deploy Process

```bash
# Standard (automatic via git push)
git push origin main
# → Vercel builds + deploys in ~60 s

# Manual deploy
npx vercel --prod

# Preview deploy (any non-main branch)
git push origin feature-branch
# → Vercel creates preview URL automatically
```

### Pre-Deploy Checklist

- [ ] `npm run build` passes locally
- [ ] `npm run lint` passes
- [ ] No secrets in committed files (`grep -r "REPLIERS_API_KEY" src/`)
- [ ] Environment variables set in Vercel for target environment
- [ ] If NLP guard patterns changed → run regression prompts (see SECURITY.md §3.4)
- [ ] CHANGELOG.md updated

---

## 2. Environment Variables

Configure in **Vercel Dashboard → Settings → Environment Variables**.

All secrets are stored in Vercel's encrypted secret store (never in code). Per Enterprise Architecture Guidelines v1.0, §Security Checklist.

### Required

| Variable | Example | Description |
|---|---|---|
| `REPLIERS_API_KEY` | `rpl_xxxxxxxxxxxx` | Repliers MLS API key — **required for any listing data** |

### Optional (Feature-Dependent)

| Variable | Example | Description |
|---|---|---|
| `REPLIERS_API_URL` | `https://api.repliers.io` | Override Repliers base URL |
| `FUB_API_KEY` | `fub_xxxxxxxxxxxx` | Follow Up Boss API key (leads degrade gracefully without) |
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

Per Enterprise Architecture Guidelines v1.0, §Observability Baseline.

### SLOs

| Metric | Target | Measurement |
|---|---|---|
| Listing search latency (P95) | < 2 s | `duration_ms` in structured logs for `/api/listings` |
| NLP search latency (P95) | < 5 s | `duration_ms` in structured logs for `/api/nlp-search` |
| API error rate | < 1% | `level: "error"` count / total request count |
| Availability | 99.5% | Vercel status + external synthetic check |
| Lead capture success rate | > 99% | `level: "error"` on `/api/leads` (users always see success) |

### Structured Logging

API routes emit structured JSON via `src/lib/logger.ts`:

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
  "resultCount": 24
}
```

**Key fields for alerting:**
- `level: "error"` — any error-path execution
- `duration_ms > 5000` — slow requests (likely upstream timeout)
- `"Rate limit exceeded"` — abuse detection
- `"NLP prompt validation failed"` with `errorCode: "injection"` — attack attempt

### Alerts That Reflect User Impact

| Alert | Condition | User Impact |
|---|---|---|
| Search down | > 5 errors/min on `/api/listings` | Users can't search listings |
| NLP down | > 3 errors/min on `/api/nlp-search` | AI search unavailable |
| Leads failing | Any error on `/api/leads` | Leads silently lost (user sees success) |
| High latency | P95 > 5 s on listings | Slow/timeout experience |

### Current Monitoring Stack

| What | Where | Retention |
|---|---|---|
| Deploy status | Vercel Dashboard | All deploys |
| Function logs | Vercel → Logs tab | 1 hour (Hobby) / 3 days (Pro) |
| Build logs | Vercel → Deployments | All builds |
| Structured logs | stdout (JSON) | Vercel log retention |

### Recommended Additions

- **Sentry** — Error tracking with source maps and alerting
- **Vercel Analytics** — Real-time web vitals + function metrics
- **Upstash Redis** — Durable rate limiting + cache layer
- **Checkly / Uptime Robot** — Synthetic availability checks

---

## 4. Troubleshooting — Common Incidents

### INC-1: "Failed to fetch listings" / Empty Results

**User Impact:** Listings page shows error or no results  
**Likely Cause:** Repliers API key issue or Repliers downtime  
**Severity:** Critical

**Debug Steps:**
```bash
# 1. Check if API key is set
vercel env ls | grep REPLIERS

# 2. Test Repliers API directly
curl -w "\n%{http_code} in %{time_total}s" \
  -H "REPLIERS-API-KEY: $REPLIERS_API_KEY" \
  "https://api.repliers.io/listings?area=Travis&resultsPerPage=1"

# 3. Check Vercel logs for structured errors
# Search for: "Repliers API error" or "duration_ms" > 8000
```

**Resolution:**
- If API key invalid → rotate in Vercel dashboard → redeploy
- If Repliers down → ISR cache serves stale data for 60 s; escalate to Repliers support
- If timeout → check `fetchWithRetry` logs for retry attempts

---

### INC-2: Lead Forms Not Reaching CRM

**User Impact:** Form appears to succeed but leads don't appear in Follow Up Boss  
**Likely Cause:** FUB API key issue  
**Severity:** High (silent failure — user sees success)

**Debug Steps:**
```bash
# 1. Check Vercel logs for "Lead submission failed" at level: "error"
# 2. Look for requestId in logs to trace the full request

# 3. Test FUB API directly
curl -u "$FUB_API_KEY:" "https://api.followupboss.com/v1/people?limit=1"
```

**Resolution:**
- If `FUB_API_KEY` missing → set in Vercel env vars → redeploy
- If FUB returns 401 → regenerate API key in FUB dashboard
- Without FUB key: leads logged to Vercel function logs (search for "FUB_API_KEY not set")

---

### INC-3: NLP Search Returns Wrong/No Results

**User Impact:** AI search returns irrelevant listings or errors  
**Severity:** Medium

**Debug Steps:**
1. Search Vercel logs for `requestId` to see full trace
2. Check `"NLP generated search params"` log to see what Repliers interpreted
3. Check `"Matched community from prompt"` to verify polygon matching
4. If 406: prompt was rejected as non-real-estate (this is correct behavior)

**Resolution:**
- If community not matching → verify name in `communities-polygons.ts`
- If wrong search params → report to Repliers support
- If injection blocked → review `nlp-guard.ts` patterns for false positive

---

### INC-4: Rate Limiting False Positives

**User Impact:** Legitimate user gets 429 response  
**Severity:** Low

**Debug Steps:**
1. Check logs for `"Rate limit exceeded"` with `clientIp`
2. Verify the IP isn't behind a shared NAT (office, VPN)

**Resolution:**
- In-memory rate limiter resets on cold start (usually within minutes)
- If persistent: increase limit in `src/lib/rate-limit.ts`
- For production scale: migrate to Upstash Redis rate limiter

---

### INC-5: Build Failure

**User Impact:** Deploy blocked — production unchanged  
**Severity:** Medium

| Error | Fix |
|---|---|
| TypeScript errors | `npm run build` locally |
| Missing env vars at build | Set in Vercel for correct environment |
| Memory exceeded | Simplify polygon data or increase function memory |
| Module not found | `npm install` → commit `package-lock.json` |

---

### INC-6: WordPress Embed Broken

**User Impact:** IDX not visible in WordPress iframe  
**Severity:** Medium

**Resolution:**
- Ensure iframe URL includes `?embed=true`
- Check `X-Frame-Options` / `Content-Security-Policy` headers allow WordPress origin
- Verify `WORDPRESS_SITE_URL` env var matches actual WordPress domain

---

## 5. Scaling Considerations

| Threshold | Action |
|---|---|
| > 50k monthly visitors | Upgrade to Vercel Pro |
| Repliers rate limits hit | Add Redis/KV cache layer in front of Repliers calls |
| Rate limiter resets too often | Migrate to Upstash Redis for durable rate limiting |
| Polygon matching slow | Move polygons to PostGIS; add spatial index |
| Lead volume > 100/day | Add CAPTCHA to lead forms |

---

## 6. Rollback

### Instant Rollback via Vercel

1. Go to **Vercel Dashboard → Deployments**
2. Find last known good deployment
3. Click **⋮ → Promote to Production**

Time to rollback: < 30 seconds.

### Git Rollback

```bash
# Revert last commit (safe — creates new commit)
git revert HEAD
git push origin main

# Hard reset to specific commit (destructive — use with caution)
git reset --hard <commit-sha>
git push --force origin main
```

### Backup / Restore

Per Enterprise Architecture Guidelines v1.0, §Security Checklist:

| What | Backup Strategy | Restore |
|---|---|---|
| Source code | Git (GitHub) | `git clone` |
| Environment variables | Vercel encrypted store | Vercel dashboard |
| Community polygon data | Git (static file in repo) | Redeploy |
| MLS listing data | Not stored (Repliers is source of truth) | N/A |
| User favorites/searches | Client localStorage (no server backup) | N/A |
| Lead data | Follow Up Boss (FUB is source of truth) | FUB export |

---

## 7. Contacts

| Role | Contact | Notes |
|---|---|---|
| **Engineering** | Spyglass Realty dev team | Primary |
| **Repliers Support** | support@repliers.io | MLS API issues |
| **FUB Support** | Follow Up Boss help desk | CRM integration |
| **Vercel Support** | Vercel dashboard | Hosting / function issues |
