# Rivet agentOS

## Source

- Canonical URL: https://rivet.dev/docs/agent-os/
- Related URL: https://rivet.dev/changelog/2026-04-04-introducing-agentos/
- Related URL: https://github.com/rivet-dev/agent-os

## Summary

Rivet agentOS is Rivet's preview runtime for running coding-agent-style workloads inside an in-process sandbox. It launched on April 4, 2026 and is explicitly positioned as a new layer on top of Rivet's more mature actor infrastructure rather than a replacement for it. The core idea is that an agent should get operating-system-like primitives without paying the cold-start, memory, and orchestration costs of launching a full container per interaction. Rivet implements that by running a WebAssembly and V8-isolate-based virtual machine inside a Node.js host process, with a virtual POSIX kernel, isolated filesystem, configurable networking, and host-bound tools.

The agentOS docs matter because they describe a very specific shape of agent runtime. This is not just another SDK wrapper around LLM calls. It is an execution environment designed for agents that need files, shell-like tools, process boundaries, and permissioned access to external capabilities. The docs emphasize deny-by-default security, per-agent isolation, host-to-VM tool binding, and optional hybrid escalation into a full Linux container when the lightweight sandbox is insufficient. That makes agentOS especially relevant for coding agents, browser automation, or research workers that need real tooling instead of pure text generation.

For this knowledge base, the main takeaway is not "use agentOS by default." The important point is that agentOS defines a credible backstage-worker abstraction for tasks that are fundamentally operating-system-shaped. It is strongest when the agent needs a scratch filesystem, commands, mounts, and long-running autonomous work. It is much weaker as a default conversational product-agent runtime because the product still needs to own identity, authorization, billing, user-facing conversation state, and structured tool rendering.

As of April 8, 2026, the maturity story is the main caveat. agentOS is only four days old, marked preview, and the surrounding product messaging is still moving quickly. That makes it a source to watch closely, but not a safe default recommendation for a general product-agent stack. The durable lesson is architectural: keep coding-agent-style execution as a distinct runtime concern, and do not confuse that with the user-facing product shell.

## Implications

- agentOS is a strong reference for sandboxed backstage workers, not for the default product conversation layer.
- Its main value is the runtime shape: isolated files, tools, and processes with lower overhead than container-per-task designs.
- The maturity warning matters because the repo's recommendations are meant to be copied into production systems, not just experiments.

## Related Sources

- [Rivet Actors](rivet-actors.md)
- [Rivet Workflows](rivet-workflows.md)

