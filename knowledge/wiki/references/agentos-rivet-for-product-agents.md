# AgentOS / Rivet for Product Agents

This page evaluates the Rivet stack for product-agent architecture. The maturity picture is mixed by design — the foundation is production-credible while the newest layers are early-stage but architecturally sound enough to bet on.

Primary inputs: [Rivet Actors](../summaries/rivet-actors.md), [Rivet Workflows](../summaries/rivet-workflows.md), [Rivet agentOS](../summaries/rivet-agentos.md), [ElectricSQL Durable Streams](../summaries/electricsql-durable-streams.md).

## The Stance on agentOS

agentOS launched April 4, 2026. It is new. The architecture it enables — WebAssembly + V8 isolate sandbox, deny-by-default security, host tools as CLI commands inside the VM, ~6ms cold start, 32x cheaper than sandbox providers — is a genuinely impressive execution model. For teams comfortable with early-adopter risk, the underlying architecture is worth betting on despite the API being fresh.

The preview status means: expect API changes, limited agent options (Pi is the only one available as of this writing, with Claude Code/Codex/Amp "coming soon"), and a smaller community to draw on. It does not mean the architecture is unsound.

**The right question is not "is agentOS old enough?" — it is "is the execution model right for my product?"** For dashboard-style AI products where the agent runs client-initiated jobs in a sandboxed environment, the answer may be yes sooner than the maturity date suggests.

## What Is Viable Today

[Rivet Actors](../summaries/rivet-actors.md) are the production-credible foundation. Durable addressable runtimes, real-time connectivity, per-tenant or per-session isolation. If you need actor boundaries and infrastructure-level session isolation, Actors are ready today.

[Rivet Workflows](../summaries/rivet-workflows.md) (launched February 24, 2026) co-locate workflow, queue, state, and events inside the Actor. Simpler than Temporal, more integrated than Inngest. Still early but the model is clean.

## Pi's Role

Pi is a coding agent runtime inside agentOS. It is the wrong shape for the main conversational product-agent abstraction — the primitives (file editing, shell execution, long-running autonomy) don't map to what a portfolio tracker or dashboard AI product needs at the conversation surface. Pi is the right fit as a **backstage worker**: a dedicated job runner for multi-step research or analysis tasks, invoked as a tool from the main agent, returning structured results. See [Pi as Backstage Worker Pattern](pi-as-backstage-worker-pattern.md).

## When to Use Rivet Now

Consider the Rivet stack (Actors + agentOS) if:

- You need infrastructure-level per-tenant or per-session isolation
- The agent's work is sandboxable as CLI-style commands (code execution, file manipulation, shell runs)
- You want to avoid the complexity of a separate event-stream infrastructure by using Actors as the state + communication layer
- You are comfortable with API instability in exchange for influence over the platform's direction

Consider sticking with the recommended Architecture A (Inngest AgentKit + AI SDK UI) if you need stability, a large community, and production-proven defaults today.

