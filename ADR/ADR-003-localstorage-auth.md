# ADR-003: localStorage for User Auth/Favorites (No Backend Auth)

**Status:** Accepted  
**Date:** 2025-02-03  
**Deciders:** Spyglass Realty Engineering  
**Governance:** [Enterprise Architecture Guidelines v1.0](../docs/spyglass_enterprise_arch.pdf), February 2026

## Context

The IDX app needs to support:
- User identification (name, email) for lead capture
- Saving favorite listings
- Saving search configurations
- Dismissing listings from results

These features need some form of user state. Options considered:

1. **Server-side auth (NextAuth/Auth.js, Supabase, etc.)** — Full authentication with sessions, password reset, OAuth. Requires a database, session management, and security hardening.
2. **localStorage-based identity** — Store user profile and preferences in the browser. No server-side auth, no passwords, no sessions.
3. **Cookie-based anonymous sessions** — Server sets a session cookie, stores preferences server-side. Partial solution — still needs a database.
4. **Third-party auth (Google/Apple sign-in)** — Delegate auth to OAuth providers. Requires OAuth integration and a user database for profile storage.

### Constraints

- This is a real estate search tool, not a social platform — authentication friction loses users
- Lead capture (name + email) is the primary conversion goal
- Favorites/saved searches are convenience features, not mission-critical data
- No budget or timeline for building a user management system
- Privacy advantage: less PII stored server-side = less breach risk

## Decision

Use **browser localStorage** for all user state. No server-side authentication.

Implementation (`src/lib/auth.ts`):
- `saveUser()` — stores `{ id, name, email, phone, createdAt }` in localStorage
- `getUser()` — retrieves user profile
- `clearUser()` — removes user profile
- User ID is generated client-side via `crypto.randomUUID()`

Related hooks:
- `useFavorites` — stores favorite MLS numbers in localStorage
- `useSavedSearches` — stores search filter configurations
- `useDismissedListings` — stores dismissed listing MLS numbers

## Consequences

### Positive

- **Zero friction:** Users "register" by filling out a contact form — no passwords, no email verification
- **No server-side PII:** User data never touches our servers (except when explicitly submitting a lead form)
- **No auth infrastructure:** No database tables, no session management, no password reset flows
- **Fast implementation:** Ships in days, not weeks
- **Privacy-friendly:** User controls their own data (clear browser = data gone)
- **GDPR-simple:** No server-side personal data to manage/delete

### Negative

- **No cross-device sync:** Favorites saved on phone won't appear on desktop
- **Data loss risk:** Clearing browser data loses all saved preferences
- **No server-side personalization:** Can't send "new listings matching your saved search" emails
- **Identity not verified:** User email is self-reported, not validated
- **Limited analytics:** Can't track user journeys across sessions/devices

### Future Path

If cross-device sync or email notifications become requirements:
1. Add a lightweight auth layer (e.g., magic link email auth)
2. Store favorites/searches in a database keyed by verified email
3. This ADR would be **superseded** by a new ADR documenting the migration

### Mitigations

- Lead capture form validates email format before submitting to FUB
- User-facing messaging sets expectations ("saved to this browser")
- Consider periodic localStorage → server sync as an opt-in feature later

## Rollback Plan

If localStorage-only becomes insufficient (cross-device demand, analytics needs):
1. Add magic-link email authentication (NextAuth.js or custom)
2. Create `users`, `favorites`, `saved_searches` tables in PostgreSQL (schema draft exists in `src/db/schema.sql`)
3. Migrate client-side hooks (`useFavorites`, `useSavedSearches`) to API-backed versions
4. Keep localStorage as offline cache with sync-on-auth pattern
5. This ADR would be **superseded** by a new ADR documenting the server-auth migration
