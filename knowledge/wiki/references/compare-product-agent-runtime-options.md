# Compare Product Agent Runtime Options

This page compares the main architecture shapes and runtime candidates discussed in this repo.

Primary inputs: [Recommended Main Product-Agent Architecture](recommended-main-product-agent-architecture.md), [Vercel AI SDK v5](../summaries/vercel-ai-sdk-v5.md), [Inngest AgentKit](../summaries/inngest-agentkit.md), [Mastra Framework](../summaries/mastra-framework.md), [Rivet Actors](../summaries/rivet-actors.md), [Rivet Workflows](../summaries/rivet-workflows.md), [Rivet agentOS](../summaries/rivet-agentos.md), [ElectricSQL Durable Streams](../summaries/electricsql-durable-streams.md), [ElectricSQL StreamDB](../summaries/electricsql-streamdb.md), [OpenClaw Documentation](../summaries/openclaw-docs.md).

## Architecture Shapes

| Shape | Best fit | Main strengths | Main costs | Recommendation level |
|---|---|---|---|---|
| **Unified** | Small team, one main product surface, agent deeply coupled to product data | One codebase, fastest iteration, no schema drift, best type safety | Harder independent deploys, happy-path trap risk, weaker infra isolation | Default |
| **Agent-as-service with shared DB** | Team needs independent deploys before it needs a full event/state plane | Clean service boundary, shared schema, less operational overhead than full split | Coupling moves to shared DB, runtime is less swappable | Strong middle ground |
| **Split runtime + state plane** | Multiple surfaces, hard tenant isolation, repeated long-running work, runtime optionality | Swappable runtime, clearer trust boundary, better multi-consumer state model | Highest operational surface, versioning and schema governance overhead | Use for clear triggers only |

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

Start with Unified if all of these are true:

- one web product surface is primary
- the agent needs deep access to the same product data the user sees
- the team is still optimizing for speed of learning
- independent runtime deploys are not yet necessary

Move to Agent-as-service with shared DB when:

- agent changes need a different release cadence
- there is still one main data model
- the team wants an explicit API boundary without adopting a new state plane

Move to Split runtime + state plane when:

- more than two surfaces need the same agent behavior
- long-running background work is normal, not exceptional
- per-tenant runtime isolation matters at the infrastructure layer
- runtime optionality is a strategic goal, not just a nice idea

## What This Comparison Is Saying

This matrix does not argue that the newest stack is the most advanced answer. It argues that a product-agent recommendation should privilege production reality over novelty. [Vercel AI SDK v5](../summaries/vercel-ai-sdk-v5.md) and [Inngest AgentKit](../summaries/inngest-agentkit.md) are stronger defaults than preview-stage runtime stacks because they solve the most common product problem today: shipping a capable assistant inside an existing TypeScript app without inventing a platform first.

For the most important conceptual boundary behind these choices, see [Runtime vs. Session State Boundary](runtime-vs-session-state-boundary.md).

