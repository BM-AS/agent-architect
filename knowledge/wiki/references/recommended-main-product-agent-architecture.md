# Recommended Main Product-Agent Architecture

This page is the primary architecture recommendation for this repo. It answers: how should you build a product where the AI assistant is central to the user experience?

Two architectures are recommended — one as the default, one for specific needs. A third common pattern (agent-as-service with shared database) is documented as a natural middle ground.

Evaluation date: 2026-04-08. Dual-reviewed via Codex (repo-grounded) and adversarial architectural review (10-question stress test). Underlying research covered Rivet/AgentOS, AI SDK, TanStack DB, Durable Streams, StreamDB, Inngest AgentKit, Mastra, and the monolithic/split tradeoff space.

## Architecture A — Unified (Recommended Default)

**Shape:** Single Vercel-hosted app (TanStack Start or Next.js). Product shell, agent runtime, and tool execution in one codebase, one deploy target.

**Core stack:**
- [AI SDK UI v5](../summaries/vercel-ai-sdk-v5.md) (`useChat`) — streaming, tool rendering, generative UI, resumable streams
- [Inngest AgentKit](../summaries/inngest-agentkit.md) (`useAgent` hook) — durable execution harness; every LLM call + tool invocation is an independently retryable step
- Tools defined inline with Zod schemas — some server-side, some client-side via `onToolCall` + `addToolOutput`
- Session + message persistence in Postgres (official AI SDK pattern: load → `streamText` → persist on `onFinish` → `consumeStream()`)
- Optional: [Durable Streams](../summaries/electricsql-durable-streams.md) for multi-tab/multi-device/collaborative resilience (bolt-on via AI SDK durable transport adapter)
- Heavy/long-running tools delegate to Inngest functions — agent invokes tool, tool enqueues Inngest function, streams progress or returns job handle

**Why this is the default:**
- One codebase, one deploy, one failure domain
- Full type safety end-to-end (tools typed inline, no schema drift)
- Agent sees the same domain model users see — no impedance mismatch
- Production-ready components throughout (AI SDK v5 stable, Inngest production-tested, Vercel proven, Postgres proven)
- Lowest operational overhead — critical for early-stage teams
- "Feels capable" because streaming + tools + generative UI work seamlessly

**What it gives up:**
- Cannot deploy agent independently of product code
- Multi-tenant isolation is application-level, not platform-level
- Iteration velocity cost at scale: when agent changes require product deploys, and agent iteration cadence (daily) outpaces product release cadence (weekly or gated), the unified codebase becomes a coordination bottleneck. Architecture A's escape valve is real — but it requires explicit seam preservation (see above) to exercise cheaply.

**Critical requirement: happy-path trap mitigation.** A unified architecture has no natural forcing function for defensive patterns. Before shipping to production, add: circuit breakers for tool failures, retry budgets per step, per-user token/cost caps, Sentry integration for tool call failures. Without these, Architecture A is a prototype recipe, not a production one.

**Critical requirement: seam preservation.** Keep agent logic in a dedicated module or package boundary within the monorepo. Define the agent's API surface even when it's internal (function signatures, input/output types, tool registry). This ensures splitting to Architecture B later is a 1-week project, not a 2-month rewrite.

**When to stop using Architecture A:** See [When to Split](#when-to-split-concrete-inflection-points) below.

## Architecture B — Split (State Plane + Runtime Separation)

**Shape:** Product shell (Vercel app + AI SDK UI) owns conversation, session state, UI rendering, auth, billing. A separate backstage agent runtime picks up work and produces events back. The shared substrate is a durable session/event state plane.

**Core concept — trust boundary as the principle, state plane as the mechanism:**
- The product shell owns the trust perimeter: auth, RBAC, billing, rate limits, user-authorized writes
- The agent runtime operates under delegation — it can only do what the product shell has authorized via the event stream
- The state plane (Durable Streams, Postgres event log, or equivalent) is the shared substrate both sides read/write
- The runtime is swappable: Inngest AgentKit, Mastra, Rivet Actors, or OpenClaw — as long as both sides speak the same event stream

**Runtime options (not prescriptive — the split is defined by the state plane, not the runtime):**
- [Inngest AgentKit](../summaries/inngest-agentkit.md) — lowest friction, production-ready, already proven
- [Mastra](../summaries/mastra-framework.md) + Temporal/Restate — TS-native framework with durability bolted on
- [Rivet Actors](../summaries/rivet-actors.md) + [agentOS](../summaries/rivet-agentos.md) — most sophisticated, but agentOS is preview-stage as of April 2026
- OpenClaw gateway — if heavy work is file/shell/browser automation (the internal-orchestration pattern)

**Why keep session state separate from the runtime:** Durable session state outlives any particular runtime. If you encode state into the runtime (e.g., "session state is Rivet Actor internal state"), you're locked in — swap the runtime and you lose history. If you encode state into an explicit event stream, the runtime is swappable, users can resume from any offset, and debugging is a query instead of a core dump. See [Runtime vs. Session State Boundary](runtime-vs-session-state-boundary.md).

**When to reach for Architecture B:** See [When to Split](#when-to-split-concrete-inflection-points) below.

## Architecture C — Agent-as-Service with Shared Database

Most teams that outgrow Architecture A naturally arrive at this shape before reaching Architecture B's full state-plane separation.

**Shape:** Product shell (Vercel app) handles auth, billing, UX. Agent logic deployed as a separate service (another Vercel app, standalone Node service, Mastra deployment). Both services share the same Postgres database via the same Drizzle/Kysely schema. Agent service called via internal typed API (oRPC/tRPC), not via event stream.

**What it buys:** Independent agent deploys, type-safe API boundary, no new infrastructure (shared DB), understandable to any TypeScript developer.

**What it costs:** Shared DB schema changes can break both services. No clean runtime swappability. Coupling is at the data layer, not the event layer. Less resilient than Architecture B's state-plane separation.

**When it's the right choice:** You need independent deploys but don't yet need the operational overhead of a dedicated event stream infrastructure. Team is 4-8 engineers. Agent logic is complex enough to justify a separate service but not autonomous enough to justify a full runtime separation.

## When to Split (Concrete Inflection Points)

Move from A to B or C when ANY of these are true:

1. **Team > 5 engineers** working on agent and product simultaneously — coordination overhead of shared codebase exceeds API boundary overhead
2. **> 2 distinct product surfaces** sharing the same agent (web + mobile + Slack bot + API) — you've accidentally built a service layer inside a monorepo
3. **> 20% of agent interactions involve multi-minute workflows** — delegation scaffolding in Architecture A becomes the dominant code surface
4. **Multi-tenant isolation required at infrastructure level** — enterprise customers who contractually require separate infrastructure per tenant
5. **Agent's data model diverges significantly from product's** — embedding stores, semantic indexes, multi-hop graphs don't fit cleanly in the product DB
6. **Agent iteration cadence breaks product release cycles** — daily agent improvements vs. QA-gated product releases

## What This Recommendation Does NOT Say

- It does not say Rivet/Pi/agentOS is bad technology. The correct framing: **Rivet Actors are production-viable (16 months old, Apache 2.0); agentOS + Pi are the "penthouse under construction" on that foundation.** agentOS is 4 days old as of this writing, Pi has one agent, and the API is unstable. The Rivet ecosystem is worth watching closely — revisit in 3-6 months. See [AgentOS / Rivet for Product Agents](agentos-rivet-for-product-agents.md).
- It does not say the split pattern is wrong. It says the split is overhead for most early-stage product-agent teams.
- It does not say OpenClaw is unsuitable for all products. It's unsuitable as a multi-user product runtime. It's excellent for internal orchestration. See [OpenClaw for Product Agents](openclaw-for-product-agents.md).
- It does not say you must avoid alpha/beta packages. Philip has evaluated this stack and is comfortable with beta components if the architecture is sound. Maturity is a consideration, not a blocker. The stack recommendation stands on architectural shape, not version numbers.
- It does not say Rivet/Pi is the wrong bet for teams who want early-mover position in the ecosystem. If you want to influence API surfaces and own deep Rivet knowledge before it matures, that's a legitimate strategy — just not one this KB recommends as the default for teams building their first serious product-agent.

## Memory and Context Access

Both architectures assume the agent has access to relevant context — neither specifies how. For a DeFi portfolio tracker, the agent needs: portfolio history, price data, wallet labels, user preferences, prior conversation summaries. None of this is in the AI SDK's `messages` array by default.

Pattern for Architecture A: implement a memory layer as a first-class tool. The agent calls a `searchMemory` or `getContext` tool that queries a vector store or structured DB for relevant context, injects it into the system prompt or conversation. Mastra has observational memory with automatic context compression ([Mastra Framework](../summaries/mastra-framework.md)) as a reference pattern. Inngest functions can serve as the durable memory retrieval harness — store embeddings in Postgres, retrieve on demand.

Pattern for Architecture B: the product shell exposes context as read-only projections shaped by what the user has authorized. The agent reads from the state plane's context collections, not directly from product tables.

This is a first-class design decision, not an afterthought. Budget time for it in the agent's MVP scope.

## Observability Stack

Architecture A comes with Inngest's built-in step traces — use them. Beyond that, the full observability stack for a production agent:

- **Inngest Insights** — step-level latency, failure rates, retry counts per tool. Already included.
- **Sentry** — instrument tool call boundaries. Wrap every tool invocation in `Sentry.startSpan()` so tool failures appear in your error tracker with full input/output context. This is the most common failure mode in production agents.
- **Langfuse or Axiom** — log every agent turn: user message, tool calls made, final response, token spend. Langfuse has purpose-built LLM eval integrations; Axiom works if you're already in the Vercel ecosystem.
- **Cost per-user tracking** — implement a token counter per user session. Alert at thresholds. The research on agent production failures (MIT 2025) shows unconstrained retry loops are a primary cost driver. A per-user cap prevents one bad session from generating $236/month in runaway costs.

Architecture B's observability is runtime-dependent. Whatever runtime you choose, ensure it emits OpenTelemetry traces and you pipe those to your observability stack.

## Testing and Evaluation

Neither architecture includes agent evaluation infrastructure. Without evals, you cannot detect when a tool schema change breaks agent behavior, when a new model version degrades quality, or when prompt edits have unintended side effects.

Minimum viable eval stack: a replay harness that runs the agent against a fixed set of known inputs and asserts expected tool calls or outputs. Mastra has eval primitives; LangSmith/Langfuse also support this. Even a simple JSONL replay script is better than nothing.

## Open Gaps in Both Architectures

- **Memory/RAG:** See [Memory and Context Access](#memory-and-context-access) above. Budget for this as a first-class feature.
- **Testing/evaluation:** See [Testing and Evaluation](#testing-and-evaluation) above.

## Related Pages

- [Runtime vs. Session State Boundary](runtime-vs-session-state-boundary.md) — why separating state from runtime matters
- [Compare Product Agent Runtime Options](compare-product-agent-runtime-options.md) — evaluation matrix
- [Pi as Backstage Worker Pattern](pi-as-backstage-worker-pattern.md) — when and how Pi fits
- [AgentOS / Rivet for Product Agents](agentos-rivet-for-product-agents.md) — maturity assessment
- [Product Agent Open Questions and Risks](product-agent-open-questions-and-risks.md)
- [Product Agent Future Experiments](product-agent-future-experiments.md)

## Sources

This recommendation is grounded in research conducted 2026-04-08 across official documentation for all named technologies, plus adversarial architectural review. Key sources:
- [Vercel AI SDK v5](../summaries/vercel-ai-sdk-v5.md) — stable, production-ready
- [Inngest AgentKit](../summaries/inngest-agentkit.md) — durable agent execution harness
- [Rivet AgentOS](../summaries/rivet-agentos.md) — preview, promising, not ready
- [Rivet Actors](../summaries/rivet-actors.md) — production-viable stateful backend
- [ElectricSQL Durable Streams](../summaries/electricsql-durable-streams.md) — durable event streaming
- [ElectricSQL StreamDB](../summaries/electricsql-streamdb.md) — reactive typed DB over streams. **SSR blocker:** StreamDB depends on TanStack DB, whose SSR story is still being designed. It cannot be used in a server-rendered Vercel app today. Watch this space — it's the right architecture, just not ready for SSR yet.
- [TanStack DB](../summaries/tanstack-db.md) — beta client-side reactive store
- [Mastra Framework](../summaries/mastra-framework.md) — TS-native agent framework
