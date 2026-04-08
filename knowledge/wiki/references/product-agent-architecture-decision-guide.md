# Product Agent Architecture — Decision Guide

This page helps you choose the right architecture shape for a product where an AI agent is a core user-facing component.

There is no universally correct answer. The right choice depends on your team's size, risk tolerance, iteration cadence, isolation requirements, and how central the agent is to the product's value. This guide presents the viable options with honest tradeoffs so you — or the coding agent helping you — can make the best decision for your situation.

This is a decision support page, not a recommendation engine. Read the comparison matrix first, then dig into the architecture shapes that look relevant to your context.

Evaluation date: 2026-04-08. Research covered: Vercel AI SDK v5, Inngest AgentKit, Mastra, Rivet Actors, Rivet Workflows, Rivet agentOS, ElectricSQL Durable Streams, ElectricSQL StreamDB, TanStack DB, and the tradeoffs between unified, service-split, and state-plane-separated architectures.

---

## The Three Architecture Shapes

### Shape 1 — Unified

Single codebase. Product shell and agent runtime in one deploy target.

**What it looks like:** Vercel app (TanStack Start or Next.js) + AI SDK UI + Inngest for durable step execution + Postgres for session persistence. Tools defined inline with Zod schemas. Heavy work delegated to Inngest functions.

**Tradeoffs:**

| Strengths | Costs |
|---|---|
| Fastest iteration for small teams | Agent and product code share a change boundary |
| Full type safety across the stack | Harder to give the agent an independent release cadence |
| No impedance mismatch between agent's data model and product's | Multi-tenant isolation is application-level only |
| Lowest operational surface | Happy-path trap: defensive patterns (circuit breakers, cost caps) must be added explicitly — there's no natural forcing function |

**Best for:** Teams still learning what the agent should do. Single primary product surface. Deep coupling between agent and product domain is acceptable.

---

### Shape 2 — Agent-as-Service with Shared Database

Product shell and agent logic are separate deployable services. Both share the same Postgres database via the same Drizzle/Kysely schema. Agent called via typed internal API (oRPC or tRPC), not via an event stream.

**What it looks like:** Separate Vercel apps or Node services for product shell and agent. Shared DB schema. Typed API boundary.

**Tradeoffs:**

| Strengths | Costs |
|---|---|
| Independent agent deploys | Shared DB schema changes can break both services simultaneously |
| Type-safe API boundary between product and agent | Runtime is not swappable — coupling is at the data layer |
| No new infrastructure to operate | Still no durable session stream — state is in Postgres |
| Understandable to any TypeScript developer | |

**Best for:** Teams that need different release cadences for agent and product. Agent logic is complex enough to warrant a separate service but not complex enough to need a full event-stream infrastructure. 4–8 engineers.

---

### Shape 3 — Split with Durable State Plane

Product shell (conversation, auth, billing, UI) and agent runtime are separate. They communicate through a shared durable event stream that serves as the session state substrate. The runtime is swappable — swap Inngest for Mastra, Mastra for Rivet Actors, without rewriting the product shell.

**What it looks like:** Product shell on Vercel + AI SDK UI. Agent runtime (any of the options below). Between them: ElectricSQL Durable Streams or a Postgres event log as the shared state plane. StreamDB optional — adds typed reactive collections over the stream.

**Runtime options for the agent side:**

- **Inngest AgentKit** — production-tested, strong streaming, lowest friction
- **Mastra** — TS-native, good memory primitives, needs a durability companion
- **Rivet Actors + Workflows** — actor model, real-time, infrastructure-level session isolation
- **Rivet Actors + agentOS** — actor model + WebAssembly isolate sandbox for the agent's execution environment. Deny-by-default security, ~6ms cold start, 32x cheaper than standalone sandbox providers. The isolate VM exposes host tools as CLI commands inside the sandbox.
- **OpenClaw gateway** — best fit for internal orchestration patterns, not multi-user product runtimes

**Tradeoffs:**

| Strengths | Costs |
|---|---|
| Runtime is fully swappable — product shell never changes when you swap the runtime | Highest operational surface — three moving parts instead of one |
| Durable session state outlives any runtime | Schema governance for the event stream needed upfront |
| Per-tenant or per-session isolation at the infrastructure level | Requires explicit trust boundary design — who can write what |
| Enables genuinely long-running autonomous work without blocking the product UI | Most complex to debug |
| StreamDB (optional) gives typed reactive projections over the raw stream | |

**Best for:** Multiple product surfaces sharing one agent. Hard multi-tenant isolation requirements. Long-running background work that shouldn't block the product UI. Teams that want runtime optionality as a strategic asset rather than a nice-to-have.

**On Durable Streams + StreamDB specifically:** This combination gives you a durable, resumable, offset-addressable event stream as the session state substrate, with typed reactive collections that can drive live UI updates. It's a clean model for: multi-tab continuity, collaborative sessions, audit trails of agent decisions, and runtime recovery after crashes. StreamDB depends on TanStack DB; the reactive query story is solid for client-initiated products (dashboard AI where the user prompts from the browser). Maturity is newer than the AI SDK stack — that's a real consideration for conservative teams, not a disqualifier.

---

## Comparison Matrix

| Dimension | Unified | Agent-as-Service | Split + State Plane |
|---|---|---|---|
| **Team size sweet spot** | 1–5 | 4–8 | 5+ |
| **Release cadence flexibility** | Low (shared) | Medium (API boundary) | High (state plane boundary) |
| **Operational complexity** | Lowest | Medium | Highest |
| **Runtime swappability** | None | None | Full |
| **Session durability** | Postgres persistence | Postgres persistence | Durable stream + optional StreamDB |
| **Multi-surface support** | Poor | Medium | Strong |
| **Multi-tenant isolation** | Application-level | Application-level | Infrastructure-level possible |
| **Debugging complexity** | Lowest | Medium | Highest |
| **Maturity of components** | AI SDK v5 stable, Inngest production | Depends on stack chosen | Varies by runtime; Durable Streams newer |

---

## How to Use This Guide

**If you're early and moving fast:** Shape 1 (Unified) gets you to a working product fastest. Add seam preservation practices from day one so splitting later is cheap.

**If you need independent deploys:** Shape 2 (Agent-as-service) is the natural intermediate. Don't add event stream infrastructure until you actually need runtime swappability.

**If you have multiple surfaces, hard isolation requirements, or want runtime optionality:** Shape 3 (Split + State Plane) is the right answer. Durable Streams + StreamDB is a viable state plane choice for client-initiated products.

**If you're unsure:** Start with Shape 1, build the seam explicitly, and reassess at your next major inflection point.

---

## What This Page Does NOT Say

- It does not say one shape is universally better than another. The right answer is context-dependent.
- It does not say Durable Streams + StreamDB + agentOS is the right choice for every product. It is a strong choice for specific contexts.
- It does not say you should avoid alpha or beta packages. Team risk tolerance is the right variable, not version numbers.

---

## Where to Go Next

- [Compare Product Agent Runtime Options](compare-product-agent-runtime-options.md) — detailed evaluation of each runtime candidate
- [Runtime vs. Session State Boundary](runtime-vs-session-state-boundary.md) — the conceptual principle behind Shape 3
- [agentos-rivet-for-product-agents.md](agentos-rivet-for-product-agents.md) — Rivet stack specifically: what the actor model gives you and when agentOS is the right runtime choice
- [pi-as-backstage-worker-pattern.md](pi-as-backstage-worker-pattern.md) — how Pi fits as a backstage job runner inside any shape
- [product-agent-open-questions-and-risks.md](product-agent-open-questions-and-risks.md) — memory/RAG, observability, evals: gaps that need attention regardless of shape
