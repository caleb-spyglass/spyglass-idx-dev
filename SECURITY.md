# Security Baseline — Spyglass IDX

> **Last updated:** 2025-02-09  
> **Classification:** Internal  
> **Owner:** Spyglass Realty Engineering  
> **Governance:** Conforms to [Enterprise Architecture Guidelines v1.0](./docs/spyglass_enterprise_arch.pdf), February 2026 — §7 "Security is a feature" and §Security Checklist

---

## 1. Data Classification

Per Enterprise Architecture Guidelines v1.0, all data handled by the system is classified below.

| Data | Classification | Storage | Retention | Notes |
|---|---|---|---|---|
| MLS listing data | **Public** | Not stored (proxied from Repliers) | Transient (60 s ISR cache) | Public record per MLS rules |
| Community polygons | **Public** | Bundled at build time | Until next deploy | Open / scraped data |
| User profile (name, email) | **Internal / PII** | Client localStorage only | Until user clears browser | Never stored server-side |
| Favorites, saved searches | **Internal** | Client localStorage only | Until user clears browser | No server copy |
| Lead form submissions | **Restricted PII** | **Not stored** — forwarded to FUB | Request lifecycle only | Name, email, phone transited to CRM |
| NLP search prompts | **Internal** | **Not stored** — forwarded to Repliers | Request lifecycle only | May contain location preferences |
| API keys | **Secret** | Vercel env vars (encrypted) | Managed by Vercel | Never in client bundle, never logged |
| NLP response summaries | **Untrusted** | Not stored | Transient | LLM output — treated as potentially adversarial |

---

## 2. Threat Model (STRIDE)

### 2.1 System Boundaries

```
                    TRUST BOUNDARY
                    ─────────────────────────────────────────
  Untrusted         │            Trusted (Server-Side)
  (Browser)         │
                    │
  User input ──────▶│ API Routes ──▶ Repliers API (3rd party)
  (search, forms)   │            ──▶ FUB API (3rd party)
                    │
  localStorage ◀───│ (no server-side user data)
                    │
```

### 2.2 STRIDE Analysis

| Threat | Category | Risk | Mitigation | Status |
|---|---|---|---|---|
| Attacker steals API keys | **S**poofing | High | Keys server-side only (no `NEXT_PUBLIC_`); Vercel encrypted env vars; `.env` in `.gitignore` | ✅ Mitigated |
| Attacker modifies API responses | **T**ampering | Low | HTTPS enforced (Vercel); Repliers CDN serves photos over HTTPS | ✅ Mitigated |
| Attacker denies submitting a lead | **R**epudiation | Low | Structured logs record lead submission events (without PII) with request IDs | ✅ Mitigated |
| API keys or PII leaked in logs | **I**nformation Disclosure | Medium | Logs never include API keys, email, phone, or names; error messages sanitized in prod | ✅ Mitigated |
| Spam leads flood CRM | **D**enial of Service | Medium | Rate limiting: 5 req/min per IP on `/api/leads`; FUB dedupes by email | ✅ Mitigated |
| NLP search abuse (cost) | **D**enial of Service | Medium | Rate limiting: 10 req/min per IP; prompt length capped at 500 chars | ✅ Mitigated |
| Prompt injection via NLP | **E**levation of Privilege | Medium | Prompt firewall (`nlp-guard.ts`): 19 injection patterns blocked; output sanitized | ✅ Mitigated |
| XSS via NLP summary | **T**ampering | Medium | `sanitizeNLPSummary()` strips HTML, escapes special chars; never rendered as `dangerouslySetInnerHTML` | ✅ Mitigated |
| Brute-force listing enumeration | **I**nformation Disclosure | Low | Listing data is public MLS data; no sensitive information exposed | ✅ Accepted |
| localStorage data stolen | **I**nformation Disclosure | Low | Only stores name/email user voluntarily entered; no tokens or secrets | ✅ Accepted (risk = client-side) |

---

## 3. AI / LLM Security

Per Enterprise Architecture Guidelines v1.0, §AI + Automation Architecture:

### 3.1 Prompt Firewall (`src/lib/nlp-guard.ts`)

| Layer | Control | Implementation |
|---|---|---|
| **Input validation** | Length limits | 3–500 characters |
| **Input validation** | Type check | Must be string |
| **Injection defense** | Pattern matching | 19 regex patterns (system prompt manipulation, role hijacking, data exfiltration, code execution) |
| **Output validation** | HTML stripping | `sanitizeNLPSummary()` strips tags |
| **Output validation** | Entity escaping | `&`, `<`, `>`, `"`, `'` escaped |
| **Output validation** | Length truncation | 500 char max on summary display |

### 3.2 What We Never Send to the LLM

- ❌ API keys or secrets
- ❌ User PII (email, phone, name) — only the search prompt
- ❌ System configuration or environment variables

### 3.3 AI Success Metrics

| Metric | Target | How Measured |
|---|---|---|
| NLP → valid listings rate | > 90% | `resultCount > 0` on non-406 responses |
| False 406 rate (valid prompts rejected) | < 5% | Monitor 406 responses in logs |
| Prompt injection block rate | 100% of known patterns | `nlp-guard.ts` pattern coverage; add patterns on new discoveries |
| Hallucination in summary | N/A (no display of generated facts) | Summaries are descriptive only; listings come from MLS data |

### 3.4 Regression Checks

When prompts, NLP guard patterns, or the Repliers NLP integration changes:
- [ ] Test 10 known-good prompts still return results
- [ ] Test 5 known-bad prompts (injection attempts) are blocked
- [ ] Verify 406 handling for non-real-estate prompts
- [ ] Check `sanitizeNLPSummary` strips any new output patterns

---

## 4. API Key Management

### Current State ✅

| Key | Storage | Access Scope | Rotation |
|---|---|---|---|
| `REPLIERS_API_KEY` | Vercel env vars (encrypted) | Server-side only | Quarterly (recommended) |
| `FUB_API_KEY` | Vercel env vars (encrypted) | Server-side only | Quarterly (recommended) |
| `DATABASE_URL` | Vercel env vars (encrypted) | Server-side only | On compromise |

### Controls

- No `NEXT_PUBLIC_` prefix on any secret → Next.js will not bundle client-side
- Keys accessed only in `src/lib/` and `src/app/api/` (server-side)
- `.env` and `.env.local` in `.gitignore` — never committed
- Error messages do not include API keys or response bodies from upstream

---

## 5. Input Validation

| Endpoint | Validation | Status |
|---|---|---|
| `POST /api/leads` | Name + email required; email regex; rate limited 5/min | ✅ |
| `POST /api/nlp-search` | Prompt firewall (length, injection, type); rate limited 10/min | ✅ |
| `GET /api/listings` | Query params parsed with `parseInt` + defaults; rate limited 60/min | ✅ |
| `POST /api/listings` | Body parsed as `SearchFilters` | ⚠️ Add Zod schema validation |
| `GET /api/communities/[slug]` | Slug lookup against known dataset (no injection possible) | ✅ |
| `GET /api/listings/[mls]` | MLS number passed as query param to Repliers | ✅ |
| `GET /api/listings/similar` | `mlsNumber` + `price` required; price parsed as int | ✅ |

---

## 6. Rate Limiting

Implemented via `src/lib/rate-limit.ts` (in-memory token-bucket per IP).

| Endpoint | Limit | Reason |
|---|---|---|
| `POST /api/nlp-search` | 10 req/min per IP | Expensive LLM calls |
| `POST /api/leads` | 5 req/min per IP | Prevent spam leads |
| `GET /api/listings` | 60 req/min per IP | Normal usage |
| `GET /api/communities` | 30 req/min per IP | Normal usage |

Rate-limited responses return `429 Too Many Requests` with `Retry-After` and `X-RateLimit-*` headers.

> **Note:** In-memory rate limiting resets on cold start. For durable rate limiting at scale, upgrade to Upstash Redis or Vercel KV.

---

## 7. Security Headers

Current: Vercel defaults (`X-Content-Type-Options: nosniff`, HTTPS enforcement).

Recommended addition to `next.config.ts`:

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
  {
    source: '/((?!api).*)', // Non-API pages — allow WordPress embed
    headers: [
      { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://www.spyglassrealty.com" },
    ],
  },
],
```

---

## 8. Dependency Security

- **npm dependencies:** 11 direct, 5 dev — minimal surface area
- **Key deps:** Next.js, React, Leaflet, Tailwind — well-maintained
- **No auth libraries** — reduces attack surface

### Actions

- [ ] Add `npm audit` to CI pipeline (Principle §4)
- [ ] Pin major versions
- [ ] Review `package-lock.json` changes in PRs

---

## 9. Production Security Checklist

Per Enterprise Architecture Guidelines v1.0, §Security Checklist (Minimum Bar for Production):

| Control | Status | Evidence |
|---|---|---|
| Threat model completed | ✅ | STRIDE analysis (§2.2 above) |
| Authn/authz implemented and tested | ✅ (N/A) | No server-side auth required; API keys protect upstream; localStorage for client prefs |
| Secrets stored in managed secret store | ✅ | Vercel encrypted env vars; no secrets in code |
| Input validation + rate limiting in place | ✅ | All routes validated; NLP/leads rate-limited |
| Logs redact PII/secrets | ✅ | Logger never records email, phone, name, or API keys |
| Dependency scanning enabled | ⚠️ | Manual `npm audit`; needs CI integration |
| Backup/restore plan documented | ✅ | Code in Git; no database; Vercel rollback in RUNBOOK.md §6 |
| Incident runbook created | ✅ | RUNBOOK.md §4–5 covers common incidents |

---

## 10. Incident Response

| Scenario | Severity | Response |
|---|---|---|
| API key compromised | **Critical** | Rotate in Vercel dashboard → Redeploy immediately |
| Spam leads flooding CRM | **Medium** | Rate limiter should block; if persistent, tighten limit or add CAPTCHA |
| NLP prompt injection discovered | **Medium** | Add pattern to `nlp-guard.ts` → deploy; log + investigate |
| Repliers API down | **High** | Users see errors; ISR cache serves stale data for 60 s; escalate to Repliers |
| XSS vulnerability reported | **High** | Verify input/output sanitization → deploy fix → notify reporter |
| Dependency vulnerability (npm audit) | **Medium** | Assess exploitability → update dep → redeploy |
