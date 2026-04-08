# Foundational Sources

This page lists every seeded external source in the knowledge base. Sources are grouped by the capability they most directly inform. Summary links point to the maintained wiki pages that distill each source for repeat use.

## Knowledge Patterns

### Karpathy LLM Wiki

Why it matters: This is the conceptual root of the repository. It explains why knowledge should be compiled into a maintained wiki once, instead of being re-derived from raw documents every time a model is prompted. It also provides the three-layer model that this repository mirrors directly: sources, wiki, and conversation.

Summary: [Karpathy LLM Wiki](../summaries/karpathy-llm-wiki.md)

## Agent Infrastructure

### AgentSearch Manifesto

Why it matters: The manifesto reframes many agent failures as a freshness and access problem rather than a reasoning problem. Its filesystem-first stance is especially useful for a repo that wants agents to traverse documentation with ordinary Unix habits instead of custom protocol learning.

Summary: [AgentSearch Manifesto](../summaries/agentsearch-manifesto.md)

### Nia Documentation

Why it matters: Nia shows a concrete productized path for turning documentation, local repositories, and shared context into agent-usable inputs. It is relevant both for the content ingestion story and for the plugin or skill patterns that let coding agents access that context consistently.

Summary: [Nia Documentation](../summaries/nia-docs.md)

### OpenClaw Documentation

Why it matters: OpenClaw provides the operational pattern for a self-hosted agent gateway with skills, memory, and workspace files. It is the strongest reference in this set for how a personal or team agent system can persist context and route work across multiple surfaces.

Summary: [OpenClaw Documentation](../summaries/openclaw-docs.md)

## Agent Customization

### OpenAI Codex Customization

Why it matters: This source explains how Codex consumes persistent repo guidance such as `AGENTS.md`, as well as skills and environment setup. It informs how this repository should be structured so Codex can work productively with minimal repeated prompting.

Summary: [OpenAI Codex Customization](../summaries/codex-customization-docs.md)

### Claude Code Memory & CLAUDE.md

Why it matters: Claude Code uses a different but parallel set of persistent instruction layers, including `CLAUDE.md`, auto memory, and scoped rules. Keeping this repo legible to Claude as well as Codex reduces agent-specific drift and makes the knowledge base more portable.

Summary: [Claude Code Memory & CLAUDE.md](../summaries/claude-code-memory-docs.md)

## Infrastructure

### Fly/Tigris Object Storage Documentation

Why it matters: Publishing mirrored docs or frozen wiki snapshots eventually needs cheap, global, S3-compatible storage. Tigris is the clearest seeded reference for public and private buckets, global caching behavior, and Fly-native management commands.

Summary: [Fly/Tigris Object Storage Documentation](../summaries/fly-tigris-docs.md)

## Docs Tooling

### Fumadocs

Why it matters: Fumadocs is the reference for turning markdown knowledge into a polished docs site without losing the plain-files authoring model. Its composable architecture and Obsidian-aware extensions make it especially relevant for this repository's wiki-first workflow.

Summary: [Fumadocs](../summaries/fumadocs-docs.md)

## Product-Agent Architecture Sources

### Vercel AI SDK v5

Why it matters: This is the most production-ready source in the product-agent set. It defines the stable product-shell abstraction for streaming chat, structured tool rendering, transport, resumable streams, and message persistence in a TypeScript application.

Summary: [Vercel AI SDK v5](../summaries/vercel-ai-sdk-v5.md)

### Inngest AgentKit

Why it matters: AgentKit adds the durable execution harness that raw chat abstractions do not provide. It is especially important for teams already using Inngest and wanting a production-grade way to make model calls and tool loops resumable.

Summary: [Inngest AgentKit](../summaries/inngest-agentkit.md)

### Mastra Framework

Why it matters: Mastra is the strongest TypeScript-native framework source in the current set for teams that need more than AI SDK alone, especially around memory, orchestration, and evaluation-adjacent concerns.

Summary: [Mastra Framework](../summaries/mastra-framework.md)

### Rivet Actors

Why it matters: Rivet Actors are the production-credible part of the Rivet ecosystem and the best reference in this set for durable stateful runtimes with realtime boundaries at the actor level.

Summary: [Rivet Actors](../summaries/rivet-actors.md)

### Rivet Workflows

Why it matters: Rivet Workflows matter because they show how durable orchestration can be embedded inside a stateful actor runtime instead of being handled by a separate workflow platform.

Summary: [Rivet Workflows](../summaries/rivet-workflows.md)

### Rivet agentOS

Why it matters: agentOS is the clearest current reference for a coding-agent-shaped backstage runtime in the Rivet ecosystem. It is strategically important even though it is still preview-stage.

Summary: [Rivet agentOS](../summaries/rivet-agentos.md)

### ElectricSQL Durable Streams

Why it matters: Durable Streams introduces the key session-state idea in this architecture set: streaming state should be resumable, inspectable, and separable from the runtime that produced it.

Summary: [ElectricSQL Durable Streams](../summaries/electricsql-durable-streams.md)

### ElectricSQL StreamDB

Why it matters: StreamDB shows how a durable event stream can become a typed, reactive session state plane rather than remaining a raw transport log.

Summary: [ElectricSQL StreamDB](../summaries/electricsql-streamdb.md)

### TanStack DB

Why it matters: TanStack DB is the reactive data-layer reference that explains where StreamDB's collection and live-query model comes from, and why UI-native state planes are attractive for agent products.

Summary: [TanStack DB](../summaries/tanstack-db.md)
