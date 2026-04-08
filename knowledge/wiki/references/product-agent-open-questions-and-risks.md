# Product Agent Open Questions and Risks

This page tracks the biggest unresolved product-agent concerns left open even after choosing a default architecture.

Primary inputs: [Recommended Main Product-Agent Architecture](recommended-main-product-agent-architecture.md), [Vercel AI SDK v5](../summaries/vercel-ai-sdk-v5.md), [Inngest AgentKit](../summaries/inngest-agentkit.md), [Mastra Framework](../summaries/mastra-framework.md), [ElectricSQL StreamDB](../summaries/electricsql-streamdb.md), [TanStack DB](../summaries/tanstack-db.md), [Rivet agentOS](../summaries/rivet-agentos.md).

## Memory and RAG Gap

The default recommendation covers the conversation shell and durable execution harness, but it does not by itself answer how the agent gets the right context. A serious product agent usually needs more than message history: user preferences, prior outcomes, domain entities, external documents, and compressed summaries of previous sessions. [Mastra Framework](../summaries/mastra-framework.md) is the strongest source in this set for treating memory as a first-class concern. Until the repo adds a dedicated page on memory architecture, this remains a major gap.

## Observability Gap

[Inngest AgentKit](../summaries/inngest-agentkit.md) gives a better observability baseline than raw app code, but neither the default recommendation nor the split alternative is complete without traces, tool failure visibility, and request-level debugging. The product needs a conscious observability stack for agent runs, tool calls, and user-visible failure states. Otherwise teams will end up debugging product agents from screenshots and support tickets.

## Testing and Evaluation Gap

The current recommendation is runtime-focused, not evaluation-focused. That is dangerous. Tool definition changes, retrieval changes, and prompt changes can silently degrade behavior. A product-agent stack needs evals and regression checks, not just a working chat screen. This repo should eventually add dedicated guidance for eval fixtures, scenario coverage, and human review workflows.

## Happy-Path Trap

Unified architectures are especially vulnerable to the happy-path trap: everything works in development because tools are local, fast, and mostly successful, then production exposes partial failures, slow dependencies, and retry storms. This is why the main recommendation insists on circuit breakers, retry budgets, cost caps, and explicit failure rendering. Without those, a unified architecture is operationally fragile even if it is structurally correct.

## StreamDB SSR Blocker

[ElectricSQL StreamDB](../summaries/electricsql-streamdb.md) is an exciting state-plane design, but its current practicality is gated by [TanStack DB](../summaries/tanstack-db.md). TanStack DB's SSR story is still being designed, which makes StreamDB a weak fit for server-rendered Vercel applications today. This is not just a maturity footnote. It is a concrete adoption blocker for many real product shells.

## Early-Adopter Risk Position for Rivet

[Rivet agentOS](../summaries/rivet-agentos.md) and the newer parts of the Rivet stack may still be the right bet for some teams that want maximum future optionality inside the Rivet ecosystem. That is a legitimate early-adopter risk position. The risk is not irrational. It is simply different from the risk profile this repo should optimize for in a default recommendation.

## What This Means

Choosing the right architecture does not remove the need to answer memory, observability, evaluation, and reliability questions explicitly. Those are the next pages the knowledge base needs if it wants its product-agent guidance to stay production-grade instead of stopping at runtime diagrams.

