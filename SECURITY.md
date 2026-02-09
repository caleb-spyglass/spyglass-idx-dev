# Security Baseline — Spyglass IDX

> **Last updated:** 2025-02-09  
> **Classification:** Internal  
> **Owner:** Spyglass Realty Engineering

---

## 1. Security Posture Summary

Spyglass IDX is a **read-heavy, public-facing** real estate search application with minimal attack surface. It does not store user data server-side, does not implement authentication, and proxies all MLS data through server-side API routes to protect API keys.

**Risk Profile:** Low-Medium  
**Data Classification:** Public (MLS listings) + Limited PII (lead form submissions forwarded to CRM)

---

## 2. API Key Management

### ✅ Current State

| Key | Storage | Exposure Risk |
|---|---|---|
| `REPLIERS_API_KEY` | Vercel env vars (server-only) | ✅ Never sent to client |
| `FUB_API_KEY` | Vercel env vars (server-only) | ✅ Never sent to client |
| `DATABASE_URL` | Vercel env vars (server-only) | ✅ Never sent to client |

### Controls

- All API keys are accessed **only in API route handlers** (`src/app/api/`) and **server-side library files** (`src/lib/`)
- No `NEXT_PUBLIC_` prefix on sensitive keys — Next.js will not bundle them client-side
- Keys loaded via `process.env` at runtime in serverless functions
- `.env` and `.env.local` are in `.gitignore` — never committed

### ⚠️ Recommendation

- Rotate `REPLIERS_API_KEY` quarterly
- Enable Vercel's environment variable encryption (enabled by default)
- Consider scoping Repliers API key to read-only if supported

---

## 3. Data Handling & PII

### User Data Flow

```
User fills form → POST /api/leads → Forward to Follow Up Boss → Done
                                   ↓
                            (No server-side storage)
```

### What We Store

| Data | Where | Duration |
|---|---|---|
| User profile (name, email) | **Client localStorage only** | Until user clears |
| Favorites | **Client localStorage only** | Until user clears |
| Saved searches | **Client localStorage only** | Until user clears |
| Lead form submissions | **Not stored** — forwarded to FUB | Transient (request lifecycle) |
| Search queries / NLP prompts | **Not stored** — forwarded to Repliers | Transient (request lifecycle) |

### ✅ PII Controls

- **No server-side user database** — no breach risk for user data
- **No cookies or sessions** — no session hijacking vector
- **No password storage** — auth is localStorage identity only
- Lead form data is validated, forwarded to FUB, and discarded
- API route handlers do not log PII (email, phone, name)

### ⚠️ Recommendations

- Add `Secure` and `SameSite` attributes if cookies are added in future
- Consider adding a privacy policy link to lead capture forms
- Document data retention in FUB (owned by CRM, not this app)

---

## 4. Input Validation

### Current Validation

| Endpoint | Validation |
|---|---|
| `POST /api/leads` | ✅ Name + email required, email regex validation |
| `POST /api/nlp-search` | ✅ Prompt required, non-empty check |
| `GET /api/listings` | ✅ Query params parsed with defaults, `parseInt` with fallbacks |
| `POST /api/listings` | ⚠️ Body parsed as `SearchFilters` — no schema validation |
| `GET /api/communities/[slug]` | ✅ Slug lookup against known dataset (no injection) |
| `GET /api/listings/[mls]` | ✅ MLS number passed as query param to Repliers |

### ⚠️ Recommendations

- Add Zod schema validation on `POST /api/listings` body
- Add max length check on NLP prompts (prevent abuse)
- Add numeric range validation on price/pagination params
- Sanitize error messages in production (don't leak stack traces)

---

## 5. NLP / AI Search Security

### Threat Model

The NLP search endpoint forwards user prompts to Repliers' `/nlp` API. Risks include:

1. **Prompt Injection** — Malicious input attempting to manipulate the NLP model
2. **Data Exfiltration** — Prompts designed to extract system information
3. **Abuse/Cost** — High-volume requests increasing API costs

### Current Mitigations

- Prompts are forwarded as-is to Repliers NLP (Repliers handles LLM safety)
- Non-real-estate prompts return 406 (Repliers-side filtering)
- Community matching uses regex against a known dataset (no dynamic eval)
- NLP results are transformed through the same listing pipeline (no raw passthrough)

### ✅ Added Mitigations (see `src/lib/nlp-guard.ts`)

- **Input length limit:** 500 characters max
- **Prompt injection patterns:** Block common injection attempts
- **Rate awareness:** Document rate limiting needs
- **Output sanitization:** NLP summary is treated as untrusted text

### ⚠️ Recommendations

- Implement server-side rate limiting (see Section 6)
- Monitor NLP endpoint for unusual patterns
- Never render NLP `summary` as raw HTML (XSS risk)
- Log sanitized versions of prompts for abuse detection

---

## 6. Rate Limiting

### Current State: ❌ No Server-Side Rate Limiting

All API routes are currently unprotected against abuse. Vercel provides some DDoS protection at the edge, but no per-endpoint rate limits.

### ⚠️ Recommended Implementation

| Endpoint | Suggested Limit | Reason |
|---|---|---|
| `POST /api/nlp-search` | 10 req/min per IP | Expensive LLM calls |
| `POST /api/leads` | 5 req/min per IP | Prevent spam leads |
| `GET /api/listings` | 60 req/min per IP | Normal usage |
| `GET /api/communities` | 30 req/min per IP | Normal usage |

### Implementation Options

1. **Vercel Edge Middleware** with in-memory rate counting (simplest)
2. **Upstash Redis** for distributed rate limiting (recommended for production)
3. **Vercel WAF** rules (if on Pro/Enterprise plan)

---

## 7. CORS & Headers

### Current State

- Next.js default headers apply (no custom CORS config)
- Vercel adds security headers by default: `X-Content-Type-Options`, `X-Frame-Options`

### ⚠️ Recommended Headers

Add to `next.config.ts`:

```typescript
headers: async () => [
  {
    source: '/api/:path*',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
    ],
  },
],
```

### WordPress Embed (`?embed=true`)

- The app is designed to be embedded in WordPress via iframe
- `X-Frame-Options` should allow the WordPress origin
- Consider using `Content-Security-Policy: frame-ancestors` for more granular control

---

## 8. Dependency Security

### Supply Chain

- **npm dependencies:** Minimal (11 direct deps, 5 dev deps)
- **Key dependencies:** Next.js, React, Leaflet, Tailwind — all well-maintained
- **No authentication libraries** — reduces attack surface

### ⚠️ Recommendations

- Run `npm audit` regularly (add to CI)
- Pin major versions in `package.json`
- Review `package-lock.json` changes in PRs

---

## 9. Security Checklist

| Control | Status | Notes |
|---|---|---|
| API keys server-side only | ✅ | Via `process.env`, no `NEXT_PUBLIC_` |
| No PII stored server-side | ✅ | localStorage only |
| Input validation on forms | ✅ | Email regex, required fields |
| Input validation on search | ⚠️ | Basic — needs schema validation |
| NLP prompt guards | ✅ | Length limit + pattern blocking |
| Rate limiting | ❌ | Not implemented — recommended |
| Security headers | ⚠️ | Vercel defaults only |
| Dependency auditing | ⚠️ | Manual — should be in CI |
| Error message sanitization | ⚠️ | Some routes leak details in dev |
| HTTPS enforced | ✅ | Vercel enforces HTTPS |
| Git secrets scanning | ⚠️ | Should add `.env` to pre-commit hook |

---

## 10. Incident Response

1. **API key compromised:** Rotate immediately in Vercel dashboard → Redeploy
2. **Spam leads:** Check FUB for suspicious entries → Implement rate limiting
3. **Repliers API abuse:** Contact Repliers support → Review API key permissions
4. **XSS report:** Verify input sanitization → Deploy fix → Notify reporter
