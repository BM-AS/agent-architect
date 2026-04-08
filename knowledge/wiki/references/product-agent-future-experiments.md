# Product Agent Experiments

This page records experiments worth running — some now, some when conditions change. The distinction is explicit so the page is useful rather than a hedge.

Primary inputs: [Rivet agentOS](../summaries/rivet-agentos.md), [Rivet Workflows](../summaries/rivet-workflows.md), [ElectricSQL StreamDB](../summaries/electricsql-streamdb.md), [TanStack DB](../summaries/tanstack-db.md), [Mastra Framework](../summaries/mastra-framework.md).

## Worth Running Now

### StreamDB as State Plane (Architecture B)

[ElectricSQL StreamDB](../summaries/electricsql-streamdb.md) is worth piloting as the state plane in a split architecture now if:

- The product is client-initiated (human prompt from browser — not SSR-dependent)
- The team wants typed reactive collections over raw event streams
- Durable session persistence and multi-tab/multi-device continuity are real requirements

SSR is not a blocker for dashboard AI products. The relevant question is whether StreamDB's reactive query model improves observability and debuggability over Postgres-backed session persistence.

### Rivet Actors + Workflows as Isolation Layer

If the split thresholds in [Recommended Main Product-Agent Architecture](recommended-main-product-agent-architecture.md) apply — multi-tenant isolation at infrastructure level, or agent data model diverging significantly from product data model — [Rivet Actors](../summaries/rivet-actors.md) and [Rivet Workflows](../summaries/rivet-workflows.md) are the strongest candidates for that role. Actors are production-viable today.

## Worth Revisiting Later

### Rivet agentOS as Backstage Worker

[Rivet agentOS](../summaries/rivet-agentos.md) is the right experiment once: more than one agent is available and documented (Pi is the only one as of April 2026), and the product needs sandboxed execution for specific job types. The architecture is worth running as a backstage worker even during preview — Pi inside agentOS as a tool invoked from the main agent is a legitimate pattern today.

### Mastra + CopilotKit

Revisit [Mastra Framework](../summaries/mastra-framework.md) paired with CopilotKit when the product needs richer interaction primitives than AI SDK provides, or when multi-agent orchestration becomes central rather than incidental.

### TanStack AI v1

Worth watching. Could eventually challenge AI SDK's default position for framework-agnostic teams. Revisit once the API is stable and docs are production-grade.

