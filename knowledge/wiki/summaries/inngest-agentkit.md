# Inngest AgentKit

## Source

- Canonical URL: https://agentkit.inngest.com/
- Related URL: https://agentkit.inngest.com/reference/use-agent
- Related URL: https://www.inngest.com/changelog/2025-09-24-agentkit-use-agent

## Summary

Inngest AgentKit is Inngest's answer to the problem of durable agent execution for TypeScript applications that already want to stay close to ordinary application code. The core framing is that an agent usually needs a harness rather than a brand-new framework. Inngest applies its existing step-based durability model to the agent loop, so model calls and tool invocations can be retried, resumed, and observed as independently durable units. That makes AgentKit especially relevant for teams that already run background workflows or event-driven jobs on Inngest.

The most important product-facing feature is the `useAgent` hook, released on September 24, 2025. It provides a practical streaming path from durable backend execution into a React UI. Instead of treating durability and streaming as separate problems, AgentKit connects them: the user can watch messages and tool activity stream in real time while the actual agent loop is backed by Inngest's retry and checkpoint infrastructure. This is why AgentKit appears so often as the lowest-friction recommendation for Vercel-plus-TypeScript teams. It handles failure and reconnect behavior without forcing the team to build a dedicated runtime platform first.

This source matters because it fills a gap that raw AI SDK intentionally leaves open. AI SDK is excellent for the product shell, but it does not make long-running or failure-prone agent execution durable on its own. AgentKit adds that durability while keeping the system relatively understandable. It also brings built-in observability through Inngest's existing execution traces and metrics, which is an advantage over more manual stacks.

The limitation is equally important: AgentKit is not a complete agent platform. It does not solve memory or retrieval design for you, and it does not remove the need for explicit cost controls, tool failure policies, or seam-preservation discipline inside a unified app. It also couples the system to Inngest's execution model. For this repo, the right interpretation is that AgentKit is a strong default durable harness when a team is already on Inngest or wants a conservative TypeScript-first path to durable product agents.

## Implications

- AgentKit is one of the strongest default answers to "how do I make the agent loop durable without inventing a platform?"
- It pairs naturally with AI SDK for the product shell and streaming UI.
- Teams still need to design memory, guardrails, and cost controls explicitly.

## Related Sources

- [Vercel AI SDK v5](vercel-ai-sdk-v5.md)
- [Mastra Framework](mastra-framework.md)

