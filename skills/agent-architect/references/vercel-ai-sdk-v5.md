# Vercel AI SDK v5

## Source

- Canonical URL: https://ai-sdk.dev/v5/docs
- Related URL: https://ai-sdk.dev/docs/ai-sdk-ui/transport
- Related URL: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-resume-streams
- Related URL: https://ai-sdk.dev/docs/ai-sdk-ui/storing-messages

## Summary

Vercel AI SDK v5 is the most stable and production-ready source in this product-agent architecture set. It combines server-side model primitives such as `streamText` and `generateText` with UI-layer tools such as `useChat`, transport abstractions, resumable streams, and structured tool rendering. In practice, it gives a TypeScript app a first-class way to build streaming AI experiences without inventing a protocol, a message format, or a homegrown chat state model from scratch.

The important shift in v5 is that the SDK is no longer just "chat hook plus some helpers." It has a clearer transport layer, stronger typed message parts, and better alignment with structured tools and MCP-style naming. The docs describe `DefaultChatTransport`, `DirectChatTransport`, and custom transports; resumable streams through `resume: true`; and a server persistence pattern where historical messages are loaded from the database, passed into `streamText`, and saved in `onFinish` while `consumeStream()` guarantees completion even if the client disconnects. That gives teams a documented baseline for durable chat without requiring an entirely new architecture.

For this knowledge base, the AI SDK matters because it is the most credible default product shell abstraction. It fits the "agent is part of the product" pattern better than coding-agent runtimes or research-oriented frameworks. The client can render tool parts directly, the server can keep business rules close to the domain model, and transport can stay simple until more durability is justified. The SDK also works well with adjacent systems rather than trying to replace them: Inngest can provide durable execution, Durable Streams can provide stronger stream continuity, and product-specific memory or retrieval layers can sit behind the tools.

The main caution is vocabulary drift and scope discipline. The current docs emphasize typed message parts and `addToolOutput`, not older tool-invocation terminology from earlier examples. More importantly, AI SDK does not solve every product-agent problem. It does not give you durable workflow orchestration, memory design, observability, or evaluation by itself. What it does provide is a stable, well-documented center of gravity for the user-facing chat and tool-rendering layer, which is exactly why it is a strong default reference.

## Implications

- AI SDK v5 is the clearest default foundation for the conversational product shell in a TypeScript stack.
- It should be paired with explicit choices for durability, memory, observability, and cost controls instead of being treated as a full agent platform.
- Its documented persistence and resume patterns make it a stronger default than newer alpha alternatives.

## Related Sources

- [Inngest AgentKit](inngest-agentkit.md)
- [ElectricSQL Durable Streams](electricsql-durable-streams.md)

