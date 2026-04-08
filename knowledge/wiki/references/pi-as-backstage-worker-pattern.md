# Pi as Backstage Worker Pattern

This page explains where Rivet Pi fits if a team wants to use it without forcing a product agent to inherit coding-agent-shaped abstractions.

Primary inputs: [Rivet agentOS](../summaries/rivet-agentos.md), [Rivet Actors](../summaries/rivet-actors.md), [Vercel AI SDK v5](../summaries/vercel-ai-sdk-v5.md), [Inngest AgentKit](../summaries/inngest-agentkit.md).

## The Core Judgment

Pi is the wrong primary abstraction for a conversational product agent.

That is not because Pi is weak. It is because Pi is shaped for a different job. The abstractions exposed by [Rivet agentOS](../summaries/rivet-agentos.md) are file access, shell execution, mounts, sandbox permissions, and long-running autonomous work. Those are exactly the primitives a coding or research worker wants. They are not the primary primitives a customer-facing assistant needs. A product assistant needs typed tool results, resumable conversations, approval state, auth-aware data access, and rendering semantics the UI can understand.

## Where Pi Fits Well

Pi fits as a backstage worker behind a product-owned conversation.

The pattern looks like this:

1. The product shell owns the thread, auth, billing, and user-facing state.
2. The primary assistant decides that a subtask is coding-agent-shaped rather than chat-shaped.
3. A typed tool call hands that subtask to Pi through an async job boundary.
4. Pi runs inside its sandbox, produces artifacts or structured results, and emits them back into the product's durable session state.
5. The product shell renders progress and final output in its own language, not in Pi's raw event format.

This fits naturally inside Architecture A from [Recommended Main Product-Agent Architecture](recommended-main-product-agent-architecture.md): AI SDK handles the product conversation, [Inngest AgentKit](../summaries/inngest-agentkit.md) or another durable harness runs the heavy task, and Pi is just one tool backend among others.

## Why This Pattern Is Better

- The user does not have to think in coding-agent session semantics.
- Product policy stays in the product shell.
- Pi can be swapped out later if another backstage worker becomes better.
- The team gets the benefits of OS-shaped execution only where they are actually needed.

## When Not to Use Pi at All

Do not introduce Pi if the task is still ordinary product-agent work:

- answering questions over product data
- rendering structured results in the UI
- coordinating ordinary API calls
- handling short-lived assistant workflows

Those tasks are better served by [Vercel AI SDK v5](../summaries/vercel-ai-sdk-v5.md) and, when durability is needed, [Inngest AgentKit](../summaries/inngest-agentkit.md). Pi becomes interesting only when the work is clearly closer to "sandboxed autonomous worker" than to "interactive product assistant."

