# AgentOS / Rivet for Product Agents

This page evaluates the Rivet stack specifically for product-agent architecture, separating what is production-credible now from what is still preview or beta.

Primary inputs: [Rivet Actors](../summaries/rivet-actors.md), [Rivet Workflows](../summaries/rivet-workflows.md), [Rivet agentOS](../summaries/rivet-agentos.md), [ElectricSQL Durable Streams](../summaries/electricsql-durable-streams.md).

## Short Version

Rivet is not one maturity level. The foundation and the newest layers should not be judged the same way.

- **Production-credible now:** Rivet Actors
- **Promising but newer:** Rivet Workflows
- **Preview only:** agentOS and Pi as of April 8, 2026

That distinction matters because the wrong summary is "Rivet is too new" and the equally wrong summary is "Rivet is ready end to end." The more accurate framing is: the foundation is real, while the newest product-agent-specific penthouse is still under construction.

## What Is Viable Today

[Rivet Actors](../summaries/rivet-actors.md) are the part of Rivet that already functions as a serious backend reference. They give a product durable addressable runtimes, real-time connectivity, and a clean per-tenant or per-session isolation model. If a team already knows it needs actor boundaries, realtime events, and infrastructure-level session isolation, Actors are a credible choice today.

Rivet Workflows deserve cautious interest rather than blanket trust. The integration story is elegant because workflow, queue, state, and events live together, but the workflow layer only launched on February 24, 2026. That is enough to study and perhaps pilot, but not enough to make it the default recommendation for readers who need well-proven durability today.

## What Is Still Preview

[Rivet agentOS](../summaries/rivet-agentos.md) launched on April 4, 2026. That is too new for "main recommendation" status in a durable KB. The design is genuinely strong for coding-agent-shaped execution, but product recommendations should not ask readers to bet their core architecture on a four-day-old preview API.

Pi sits inside the same caution zone. It may become a valuable backstage worker, but it should not be treated as the main conversational abstraction for a product agent yet. See [Pi as Backstage Worker Pattern](pi-as-backstage-worker-pattern.md).

## When to Revisit

Revisit the Rivet stack for a primary recommendation when most of these are true:

- agentOS has exited preview and stabilized its API
- more than one supported agent is clearly available and documented
- Rivet Workflows have a longer production track record
- there are credible public examples of multi-user product deployments, not just demos or internal tools

## Legitimate Early-Adopter Position

There is still a valid early-adopter argument. Teams that want maximum exposure to Rivet's direction may accept the risk because the underlying actor foundation is already credible. That is a legitimate risk position. It is simply not the same thing as a safe default for a broad audience.

