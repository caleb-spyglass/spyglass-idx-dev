# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the Spyglass IDX project.

ADRs document significant architectural decisions, their context, and consequences.

## Index

| ADR | Title | Status | Date |
|---|---|---|---|
| [ADR-001](./ADR-001-nextjs-vercel.md) | Choice of Next.js + Vercel | Accepted | 2025-02-03 |
| [ADR-002](./ADR-002-repliers-mls-data-source.md) | Repliers API as single MLS data source | Accepted | 2025-02-03 |
| [ADR-003](./ADR-003-localstorage-auth.md) | localStorage for user auth/favorites | Accepted | 2025-02-03 |
| [ADR-004](./ADR-004-polygon-post-search.md) | POST with map param for polygon searches | Accepted | 2025-02-04 |
| [ADR-005](./ADR-005-community-polygon-sources.md) | Community polygon data sources and merge strategy | Accepted | 2025-02-05 |

## Template

```markdown
# ADR-NNN: Title

**Status:** Proposed | Accepted | Deprecated | Superseded  
**Date:** YYYY-MM-DD  
**Deciders:** Names  

## Context
What is the issue? What forces are at play?

## Decision
What is the change we're making?

## Consequences
What becomes easier or harder?
```
