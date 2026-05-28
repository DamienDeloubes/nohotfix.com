# Technical Architecture -- NoHotfix v1

_Last updated: 2026-03-04 (rev. 3 -- split into focused architecture documents)_

---

## Overview

NoHotfix is a release readiness platform replacing informal checklists with enforced testing workflows. The core guarantee triad: **artifact-gated spec execution + go/no-go decision gates + run immutability**.

## System Context Diagram

```
+-------------------+        HTTPS        +-------------------+        HTTPS        +-------------------+
|                   | ------------------> |                   | ------------------> |                   |
|   Browser (SPA)   |                     |   Fastify API     |                     |   PostgreSQL      |
|   React +         | <------------------ |   (DigitalOcean   | <------------------ |   (DO Managed,    |
|   TanStack Router |    JSON responses   |    App Platform)  |    Kysely queries   |    FRA1)          |
|                   |                     |                   |                     |                   |
+-------------------+                     +-------------------+                     +-------------------+
        |                                       |       |
        |  Landing pages                        |       |
        v                                       |       |
+-------------------+                           |       +---------------------------+
|   Next.js         |                           |                                   |
|   (Vercel)        |                           v                                   v
|   Marketing +     |                   +-------------------+               +-------------------+
|   Auth callback   |                   |   WorkOS          |               |   DigitalOcean    |
+-------------------+                   |   (AuthKit + JWT) |               |   Spaces (S3)     |
                                        +-------------------+               +-------------------+
                                                                                    ^
                                        +-------------------+                       |
                                        |   Stripe          |           Presigned PUT (browser direct)
                                        |   (Billing)       |                       |
                                        +-------------------+               +-------+
                                                |                           |
                                        +-------------------+       (from Browser)
                                        |   Resend          |
                                        |   (Email)         |
                                        +-------------------+
```

## System Components

| Component                                  | Role                                                                                          | Hosting Target                                       |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Next.js app** (`apps/web`)               | Landing pages, marketing, WorkOS auth callback routes, SEO pages                              | Vercel (`nohotfix.com`)                              |
| **React SPA** (`apps/app`)                 | Authenticated app, all post-login UI. React + TanStack Router + TanStack Query                | Vercel (`app.nohotfix.com`, static build)            |
| **Fastify API** (`apps/api`)               | Backend REST API. Thin transport layer over domain packages                                   | DigitalOcean App Platform                            |
| **Domain packages** (`packages/domains/*`) | Pure domain logic -- entities, services, use cases, repository interfaces. Transport-agnostic | N/A (library packages, consumed by apps)             |
| **PostgreSQL**                             | Primary data store for all domain entities                                                    | DigitalOcean Managed PostgreSQL (EU: Frankfurt FRA1) |
| **DigitalOcean Spaces**                    | S3-compatible object storage for artifact file uploads                                        | DigitalOcean Spaces (EU)                             |
| **WorkOS**                                 | Authentication provider -- AuthKit hosted UI, JWT issuance, org management, invitation flow   | WorkOS SaaS                                          |
| **Stripe**                                 | Payment processing -- Checkout (hosted), Customer Portal, webhook events                      | Stripe SaaS                                          |
| **Resend**                                 | Transactional email delivery (4 email templates)                                              | Resend SaaS                                          |
| **Sentry**                                 | Error capturing, performance monitoring, structured error fingerprinting                      | Sentry SaaS                                          |
| **OpenTelemetry Collector**                | Traces, metrics, and structured logs collection and export                                    | Sidecar on DO App Platform                           |

## Communication Patterns

| Pattern               | From          | To             | Protocol              | Purpose                                             |
| --------------------- | ------------- | -------------- | --------------------- | --------------------------------------------------- |
| REST API calls        | Browser (SPA) | Fastify API    | HTTPS / JSON          | All authenticated application data                  |
| Presigned PUT uploads | Browser (SPA) | DO Spaces      | HTTPS (S3 protocol)   | Direct file upload, bypassing API for large files   |
| JWT validation        | Fastify API   | WorkOS         | HTTPS (JWKS endpoint) | Token verification on every request                 |
| Stripe webhooks       | Stripe        | Fastify API    | HTTPS (POST)          | Subscription lifecycle events                       |
| Transactional email   | Fastify API   | Resend         | HTTPS                 | Email notifications (4 triggers)                    |
| WorkOS API calls      | Fastify API   | WorkOS         | HTTPS                 | Org management, invitation send, membership queries |
| Auth callback         | WorkOS        | Next.js app    | HTTPS (redirect)      | OAuth callback after authentication                 |
| OTLP export           | Fastify API   | OTel Collector | gRPC / HTTP           | Traces, metrics, logs                               |

## Architectural Decision Records (ADRs)

| ADR     | Decision                                                                               |
| ------- | -------------------------------------------------------------------------------------- |
| ADR-001 | Two frontend applications -- Next.js for public pages, React SPA for authenticated app |
| ADR-002 | Kysely as query builder, no ORM                                                        |
| ADR-003 | WorkOS for all auth, not built in-house                                                |
| ADR-004 | Presigned PUT for artifact uploads (browser-direct to S3)                              |
| ADR-005 | Snapshot-based run isolation                                                           |
| ADR-006 | SWR polling for real-time updates (v1), SSE planned for v2                             |
| ADR-007 | Structured error codes as Sentry fingerprints                                          |
| ADR-008 | "Keep local" as the sole spec divergence mechanism -- no overrides JSONB               |
| ADR-009 | Separate Vercel projects for Next.js and React SPA on distinct subdomains              |
| ADR-010 | Domain packages decoupled from transport layer (Hexagonal / Ports-and-Adapters)        |

For full ADR rationale and details, see [coding-architecture.md](./coding-architecture.md).

---

## Detailed Architecture Documents

| Document                                            | Scope                                                                                           |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [Database Diagram](./database-diagram.md)           | All 15 database entities, Mermaid ER diagram, indexing strategy, JSONB decisions, multi-tenancy |
| [Coding Architecture](./coding-architecture.md)     | Hexagonal architecture overview, monorepo structure, naming conventions, dependency rules, ADRs |
| [Frontend Architecture](./frontend-architecture.md) | Two-app split, route structure, auth flow, state management, component architecture             |
| [Backend Architecture](./backend-architecture.md)   | Fastify setup, middleware, route handlers, error handling, observability (OTel + Sentry)        |
| [Domain Architecture](./domain-architecture.md)     | 5 DDD bounded contexts, folder structure, port interfaces, state machines, cross-domain events  |
