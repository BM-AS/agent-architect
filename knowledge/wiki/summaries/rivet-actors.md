# Rivet Actors

## Source

- Canonical URL: https://www.rivet.dev/docs/actors/
- Related URL: https://www.rivet.dev/docs/connect/vercel/
- Related URL: https://github.com/rivet-dev/rivet

## Summary

Rivet Actors are the more mature core of the Rivet platform and the right place to start if the question is whether Rivet has a production-viable foundation for stateful agent backends. Actors are durable, addressable compute units that combine long-lived state, events, real-time connections, and recently added platform primitives such as queues, workflows, and per-actor SQLite. Rivet's actor model is intended for workloads where a session, tenant, room, or agent should have its own durable runtime boundary instead of being rebuilt from stateless serverless requests.

The product significance is that Rivet collapses several normally separate backend concerns into one primitive. In the Rivet model, an actor can own its own lifecycle, receive messages, emit events to connected clients, persist state locally, and coordinate background work. That is attractive for product agents because a conversation or workspace can map naturally to an actor. The docs and launch material also show why Rivet has been gaining attention for real-time AI systems: low-latency reads, built-in connection management, and a direct path to Vercel deployment through path-routed WebSockets.

This source matters because it separates the durable foundation from the newer preview layers built above it. Rivet Actors launched in December 2024, Rivet Cloud launched in October 2025, and the stack now includes adjacent capabilities such as queues, workflows, and SQLite. That makes Actors a stronger infrastructure reference than agentOS when evaluating product-agent architecture in April 2026. If a team genuinely needs per-tenant isolation, stateful long-lived compute, or a multi-surface real-time backend, Actors are a plausible choice today in a way agentOS is not yet.

At the same time, the actor model is not free. It introduces a more opinionated runtime shape than the typical TypeScript web app stack. For small teams building a first serious product agent, that extra runtime surface is often unnecessary until multiple surfaces, hard isolation, or long-running orchestration requirements appear. The useful framing for this repository is therefore: Rivet Actors are a credible backend substrate, but they are not automatically the best default architecture for every product agent. They become compelling when the system truly benefits from durable actor boundaries.

## Implications

- Rivet's production-credible story currently rests on Actors, not on preview-stage agentOS.
- Actors are most justified when the product needs durable per-tenant or per-session isolation with real-time coordination.
- The actor model should be compared against Inngest or service-split alternatives only when its runtime boundary solves a real problem.

## Related Sources

- [Rivet agentOS](rivet-agentos.md)
- [Rivet Workflows](rivet-workflows.md)

