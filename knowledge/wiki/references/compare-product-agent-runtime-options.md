# Compare Product Agent Runtime Options

This page compares the main architecture shapes and runtime candidates discussed in this repo.

Primary inputs: [Recommended Main Product-Agent Architecture](recommended-main-product-agent-architecture.md), [Vercel AI SDK v5](../summaries/vercel-ai-sdk-v5.md), [Inngest AgentKit](../summaries/inngest-agentkit.md), [Mastra Framework](../summaries/mastra-framework.md), [Rivet Actors](../summaries/rivet-actors.md), [Rivet Workflows](../summaries/rivet-workflows.md), [Rivet agentOS](../summaries/rivet-agentos.md), [ElectricSQL Durable Streams](../summaries/electricsql-durable-streams.md), [ElectricSQL StreamDB](../summaries/electricsql-streamdb.md), [OpenClaw Documentation](../summaries/openclaw-docs.md).

## Architecture Shapes

| Shape | Best fit | Main strengths | Main costs |
|---|---|---|---|
| **Unified** | Small team, one main product surface, agent deeply coupled to product data | One codebase, fastest iteration, no schema drift, best type safety | Harder independent deploys, happy-path trap risk, weaker infra isolation |
| **Agent-as-service with shared DB** | Team needs independent deploys before it needs a full event/state plane | Clean service boundary, shared schema, less operational overhead than full split | Coupling moves to shared DB, runtime is less swappable |
| **Split runtime + state plane** | Multiple surfaces, hard tenant isolation, repeated long-running work, runtime optionality | Swappable runtime, clearer trust boundary, better multi-consumer state model | Highest operational surface, versioning and schema governance overhead |

## Runtime Evaluation Matrix

| Runtime or stack | Maturity as of 2026-04-08 | Product-shell fit | Durability story | Memory/eval coverage | Notes |
|---|---|---|---|---|---|
| **AI SDK v5 + Postgres** | Stable | Excellent | Basic unless paired with workflow layer | Must add separately | Strongest simple base for conversational product agents |
| **AI SDK v5 + Inngest AgentKit** | Stable + production-tested platform | Excellent | Strong step durability and streaming via `useAgent` | Must add memory, evals, and cost controls | Best default for teams already on Inngest |
| **Mastra** | Mature enough to evaluate seriously after 1.0 | Good | Needs a durability companion for long-running critical work | Better built-in story than most TS options | Strong framework choice when AI SDK alone feels too thin |
| **Rivet Actors + Workflows** | Actors credible, workflows beta | Mixed | Strong actor-local durability, newer workflow layer | Must add memory/evals | Good when actor boundaries and realtime infra isolation are core needs |
| **Rivet agentOS + Pi** | Preview | Weak as primary conversational abstraction | Promising, but preview-stage | Not the differentiator | Treat as backstage worker shape, not default runtime |
| **OpenClaw** | Useful internal system reference | Poor for multi-user product runtime | Not the point of the system | Workspace memory, not product memory | Best as internal orchestration reference, not default customer runtime |

## How to Choose

Use the decision variables in this order:

1. **Team size + release cadence** — if agent and product can share a deploy, start with Unified. If they need different cadences, go Agent-as-service.
2. **Isolation requirements** — if infrastructure-level tenant isolation is needed, go Split + State Plane.
3. **Risk tolerance** — if alpha/beta components are acceptable and the architecture is sound, the full Rivet stack (Actors + agentOS) is on the table. If not, stick with the more mature components.
4. **Session durability** — if multi-tab continuity, collaborative sessions, and durable audit trails matter, the state plane pattern (Durable Streams + optional StreamDB) earns its overhead.
5. **Runtime swappability** — if you want to be able to swap the runtime without rewriting the product shell, you need the state plane boundary from day one.

For the conceptual foundation behind Shape 3 (Split + State Plane), see [Runtime vs. Session State Boundary](runtime-vs-session-state-boundary.md).

For the full decision guide with honest tradeoffs for each shape, see [Product Agent Architecture Decision Guide](product-agent-architecture-decision-guide.md).

