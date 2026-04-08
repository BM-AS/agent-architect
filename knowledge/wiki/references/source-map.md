# Source Map

This map connects common design questions to the sources that answer them best. For each topic, start with the source that defines the primary pattern, then use the related sources to fill in infrastructure or agent-specific detail.

## Building an LLM Wiki

Most relevant sources: [Karpathy LLM Wiki](../summaries/karpathy-llm-wiki.md), [Fumadocs](../summaries/fumadocs-docs.md), [Fly/Tigris Object Storage Documentation](../summaries/fly-tigris-docs.md)

Read first: Start with Karpathy because it defines the architecture: raw material, maintained wiki, and conversation on top. Then read Fumadocs if the question is how to present the wiki as a browsable docs surface. Read Tigris once the question shifts from authoring to publishing or snapshot distribution.

How they relate: Karpathy explains why the wiki exists at all; Fumadocs shows one way to turn that wiki into a human-facing interface; Tigris provides the delivery substrate for mirrored artifacts or public snapshots.

## Agent Context & Filesystem Patterns

Most relevant sources: [AgentSearch Manifesto](../summaries/agentsearch-manifesto.md), [Nia Documentation](../summaries/nia-docs.md), [OpenClaw Documentation](../summaries/openclaw-docs.md)

Read first: Start with AgentSearch for the principle that documentation access should feel like navigating a filesystem. Then move to Nia for a concrete implementation of current-context delivery and doc access. Read OpenClaw when the question broadens from document access to an always-on gateway with memory, sessions, and skills.

How they relate: AgentSearch supplies the philosophy, Nia operationalizes that philosophy for coding agents, and OpenClaw expands the scope from document retrieval into full agent orchestration.

## Agent-Facing Repo Conventions

Most relevant sources: [OpenAI Codex Customization](../summaries/codex-customization-docs.md), [Claude Code Memory & CLAUDE.md](../summaries/claude-code-memory-docs.md), [OpenClaw Documentation](../summaries/openclaw-docs.md)

Read first: Start with Codex customization to understand `AGENTS.md`, skills, and repo-level persistent guidance. Then read Claude's memory docs to see the same problem from another agent's perspective, especially around `CLAUDE.md`, auto memory, and scoped rules. Use OpenClaw as a third reference for workspace-operating files like `SOUL.md`, `MEMORY.md`, and daily memory logs.

How they relate: Codex and Claude define how commercial coding agents ingest instructions, while OpenClaw shows a more general workspace-file pattern for long-lived agent behavior.

## Publishing & Mirroring

Most relevant sources: [Fly/Tigris Object Storage Documentation](../summaries/fly-tigris-docs.md), [AgentSearch Manifesto](../summaries/agentsearch-manifesto.md), [Nia Documentation](../summaries/nia-docs.md)

Read first: Start with Tigris for the storage mechanics: bucket visibility, global caching, and Fly CLI workflows. Then read AgentSearch and Nia to understand why mirrored docs matter operationally for agents: both emphasize current, filesystem-usable documentation rather than stale model memory.

How they relate: Tigris handles object distribution; AgentSearch motivates the need for mirrored, current docs; Nia provides a concrete pattern for making those mirrored assets agent-accessible.

## Docs Site Generation

Most relevant sources: [Fumadocs](../summaries/fumadocs-docs.md), [Karpathy LLM Wiki](../summaries/karpathy-llm-wiki.md), [Claude Code Memory & CLAUDE.md](../summaries/claude-code-memory-docs.md)

Read first: Start with Fumadocs for the framework and content pipeline. Then revisit Karpathy to ensure the docs site serves the maintained wiki rather than replacing it. Claude's docs are useful here because they reinforce the value of concise, well-scoped markdown files that agents can load reliably at session start.

How they relate: Fumadocs is the rendering layer, Karpathy is the knowledge architecture behind the content, and Claude's guidance is a reminder that markdown structure is not only for humans but also for the agents that consume the repository.

## Product-Agent Architecture

Most relevant sources: [Recommended Main Product-Agent Architecture](recommended-main-product-agent-architecture.md), [Vercel AI SDK v5](../summaries/vercel-ai-sdk-v5.md), [Inngest AgentKit](../summaries/inngest-agentkit.md), [Mastra Framework](../summaries/mastra-framework.md), [Rivet Actors](../summaries/rivet-actors.md), [Rivet agentOS](../summaries/rivet-agentos.md), [ElectricSQL Durable Streams](../summaries/electricsql-durable-streams.md)

Read first: Start with the main recommendation page for the default architecture and the decision rules around when to split. Then read AI SDK v5 and Inngest AgentKit for the default product-shell stack. Read Mastra when the question shifts toward a richer TypeScript framework. Read Rivet Actors and agentOS when evaluating whether hard runtime boundaries or backstage-worker runtimes are justified. Read Durable Streams once session continuity and runtime/state separation become part of the architecture discussion.

How they relate: the recommendation page frames the decision, AI SDK and Inngest define the default path, Mastra represents the stronger-framework alternative, Rivet covers the actor-runtime path, and Durable Streams introduces the explicit state-plane pattern. Supporting reference pages: [Runtime vs. Session State Boundary](runtime-vs-session-state-boundary.md), [Compare Product Agent Runtime Options](compare-product-agent-runtime-options.md), [Pi as Backstage Worker Pattern](pi-as-backstage-worker-pattern.md), [AgentOS / Rivet for Product Agents](agentos-rivet-for-product-agents.md), [OpenClaw for Product Agents](openclaw-for-product-agents.md), [Product Agent Open Questions and Risks](product-agent-open-questions-and-risks.md), [Product Agent Future Experiments](product-agent-future-experiments.md).
