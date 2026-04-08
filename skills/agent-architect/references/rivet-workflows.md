# Rivet Workflows

## Source

- Canonical URL: https://www.rivet.dev/docs/actors/workflows/
- Related URL: https://rivet.dev/changelog/2026-02-24-introducing-rivet-workflows/

## Summary

Rivet Workflows are Rivet's durable workflow layer embedded directly inside the actor model. Announced on February 24, 2026, they extend an actor so that the same durable runtime can manage queues, checkpointed steps, retries, sleeps, joins, races, and human-in-the-loop pauses without introducing an external workflow broker. The core appeal is co-location: the actor owns state, events, queue consumption, and workflow execution in one place instead of spreading them across separate services.

That design choice distinguishes Rivet Workflows from both Inngest and Temporal. Inngest is durable and operationally simpler than Temporal, but it still treats durable execution as a separate system that your app calls into. Temporal goes even further toward a dedicated orchestration platform with stricter determinism and more operational surface. Rivet instead says that if the conversation, tenant, or agent already belongs inside an actor, the workflow should live there too. The docs present workflows as long-lived run handlers composed from named steps with resumability after failures, rather than plain request callbacks.

For agent systems, that is a meaningful pattern. A product agent often has loops, waits, retries, approvals, and background tasks that are easier to model as durable workflows than as one long server request. Rivet Workflows promise to keep those concerns close to the state they operate on, which reduces the storage round-trips and coordination logic seen in more distributed architectures. This is particularly attractive for real-time agent backends where the same runtime is also responsible for WebSocket events and session-local state.

The maturity caveat is essential. As of April 8, 2026, Rivet Workflows are about six weeks old. The primitives are compelling and the integration story is clean, but the system has not earned the same level of production trust as Inngest or Temporal. For this knowledge base, the right reading is that Rivet Workflows are a strong signal of where the Rivet platform is heading: toward a more complete actor-native application stack. They are a good source for understanding the design, but they should still be treated as beta infrastructure rather than a default recommendation for teams that need proven production durability today.

## Implications

- Rivet Workflows show how durable orchestration can be embedded inside a stateful runtime instead of outsourced to a separate platform.
- The co-location story is elegant for real-time agent systems, especially when actors already own the relevant state.
- The beta maturity level means this is a promising option to revisit, not the safest first recommendation for a broad audience.

## Related Sources

- [Rivet Actors](rivet-actors.md)
- [Inngest AgentKit](inngest-agentkit.md)

