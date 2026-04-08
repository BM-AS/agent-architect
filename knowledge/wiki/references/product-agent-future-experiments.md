# Product Agent Future Experiments

This page records the experiments worth revisiting later, once the relevant technologies mature further or a product team's constraints change.

Primary inputs: [Rivet agentOS](../summaries/rivet-agentos.md), [Rivet Workflows](../summaries/rivet-workflows.md), [ElectricSQL StreamDB](../summaries/electricsql-streamdb.md), [TanStack DB](../summaries/tanstack-db.md), [Mastra Framework](../summaries/mastra-framework.md).

## 1. Rivet agentOS When Stable

Revisit [Rivet agentOS](../summaries/rivet-agentos.md) once it exits preview, supports multiple clearly documented agents, and has production case studies for multi-user systems. The experiment is not "replace the whole product shell." The right test is whether agentOS has become a reliable backstage-worker runtime for coding-agent-shaped jobs inside the recommended architecture.

## 2. StreamDB Once TanStack DB SSR Resolves

Revisit [ElectricSQL StreamDB](../summaries/electricsql-streamdb.md) once [TanStack DB](../summaries/tanstack-db.md) has a stable SSR story and at least one serious product case study using the full state-plane stack in a server-rendered web app. The experiment should test whether durable session state plus reactive projections materially improves multi-device continuity and support/debuggability over simpler Postgres-backed persistence.

## 3. TanStack AI When It Reaches v1-Level Stability

This repo does not currently include TanStack AI as a seeded source, but it remains worth watching because it could eventually challenge AI SDK's default position for framework-agnostic teams. Revisit it once the API is stable, the docs are deep enough for production use, and the tool-and-transport story has settled.

## 4. CopilotKit + Mastra

Revisit [Mastra Framework](../summaries/mastra-framework.md) paired with CopilotKit when the product needs a more interactive agent UX than AI SDK alone provides and memory or multi-agent orchestration has become central. The interesting question is whether Mastra's framework support plus a richer interaction layer can provide a better product shell without forcing a premature split runtime.

## 5. Rivet Actors + Workflows for Hard Isolation Cases

If the product eventually crosses the split thresholds documented in [Recommended Main Product-Agent Architecture](recommended-main-product-agent-architecture.md), revisit [Rivet Actors](../summaries/rivet-actors.md) and [Rivet Workflows](../summaries/rivet-workflows.md) as one of the strongest candidates for infrastructure-level session or tenant isolation.

## Reading This Page Correctly

These are not backdoor recommendations. They are explicit "come back later" items. The purpose of the page is to preserve curiosity without turning preview-stage or unresolved stacks into default advice before they have earned it.

