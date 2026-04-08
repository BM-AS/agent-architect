# Runtime vs. Session State Boundary

This page explains the core boundary question behind product-agent architecture: what should belong to the agent runtime, and what should belong to the durable session state owned by the product?

Primary inputs: [Vercel AI SDK v5](../summaries/vercel-ai-sdk-v5.md), [Inngest AgentKit](../summaries/inngest-agentkit.md), [ElectricSQL Durable Streams](../summaries/electricsql-durable-streams.md), [ElectricSQL StreamDB](../summaries/electricsql-streamdb.md), [Rivet Actors](../summaries/rivet-actors.md), [Rivet agentOS](../summaries/rivet-agentos.md).

## Principle First: Trust Boundary

The deepest boundary is not technical deployment. It is trust.

The product shell owns the trust perimeter:

- user identity and tenant membership
- auth, RBAC, billing, and rate limits
- writes to product data that need policy checks
- entitlements, moderation, and user-visible guarantees
- the durable session record the user can resume, inspect, and dispute

The agent runtime operates under delegation. It may reason, call tools, produce drafts, or emit proposed state changes, but it should not silently become the product's authority on who the user is allowed to be, see, or change.

This matters because a runtime swap should not force a policy rewrite. If trust lives in the product shell, the runtime can be AI SDK plus Inngest today, Mastra tomorrow, or a Rivet-based worker later without moving the policy center of gravity.

## Mechanism: State Plane

The state plane is how the trust boundary becomes operational.

In a unified architecture, the state plane can be simple: Postgres-backed message history, structured tool outputs, and job records managed inside the main app. In a split architecture, it becomes more explicit: a durable event log, shared session collections, or another substrate both sides can read and write.

The useful lesson from [ElectricSQL Durable Streams](../summaries/electricsql-durable-streams.md) and [ElectricSQL StreamDB](../summaries/electricsql-streamdb.md) is that session history should be durable, resumable, and inspectable independently from any one runtime process. The runtime is ephemeral compute. The session is product state.

## What Belongs on Each Side

Product shell:

- authenticated conversation and thread ownership
- canonical message history and projections
- approval decisions and user-visible workflow state
- billing-aware limits and cost controls
- final application of writes into the product database

Agent runtime:

- planning and tool selection
- long-running background execution
- sandboxed code, shell, or browser tasks when needed
- intermediate reasoning artifacts that do not need to become product truth
- suggested writes or events back into the session state plane

## Why This Boundary Matters

If runtime state and session state collapse into one system, changing runtimes becomes expensive and policy leaks into execution code. That is the main lock-in risk with product agents. The product ends up depending not just on a model API or a workflow engine, but on a specific runtime's internal notion of sessions and permissions.

Separating them solves three problems at once:

1. Users can resume and inspect the same session even if the underlying runtime changes.
2. Multiple consumers can read the same state: web UI, mobile UI, analytics jobs, support tooling, or a later replacement runtime.
3. Security review stays legible because the product shell remains the only place where authority is granted.

## Practical Reading

- For the default path, see [Recommended Main Product-Agent Architecture](recommended-main-product-agent-architecture.md).
- For the comparative tradeoffs, see [Compare Product Agent Runtime Options](compare-product-agent-runtime-options.md).
- For a concrete case where runtime shape and product shape diverge, see [Pi as Backstage Worker Pattern](pi-as-backstage-worker-pattern.md).

