# TanStack DB

## Source

- Canonical URL: https://tanstack.com/db/latest
- Related URL: https://tanstack.com/db/latest/docs/overview
- Related URL: https://tanstack.com/db/latest/docs/guides/ssr

## Summary

TanStack DB is TanStack's reactive client-side database for applications that need live queries, optimistic state, and synchronization with a remote backend. It sits between the UI and the server sync layer rather than replacing either one. The core primitives are collections, live queries, and optimistic mutations: data arrives from a backend adapter into local collections, queries react to changes incrementally, and writes can appear locally before the server confirms them. That makes it relevant for interfaces where latency, offline tolerance, or real-time updates would make a plain request-response data flow feel too brittle.

The March 25, 2026 v0.6 release is the important milestone in the current story. It added broader persistence support, hierarchical includes, reactive `createEffect` triggers, virtual metadata fields, and `queryOnce`. Those features matter because they push TanStack DB from "interesting local store" toward "serious reactive state engine" for complex apps. In the product-agent context, that means a chat or agent dashboard can be backed by live collections instead of ad hoc state reconciliation. It also explains why ElectricSQL's StreamDB project chose TanStack DB as its query and projection layer.

The practical reason this source belongs in the repo is not that TanStack DB is already the obvious default. It is that it represents a compelling answer to the problem of durable, optimistic, UI-native state for agent products. Multi-step agent systems often need messages, tool state, approvals, and progress indicators to stay reactive without constant refetching. TanStack DB offers a vocabulary for that. Its query-driven sync modes also make clear that the system is being designed for larger datasets and incrementally loaded state, not just toy demos.

The constraint is maturity. TanStack DB is labeled beta in the current docs, but it is still pre-v1 and the SSR guidance remains an active design area. For a server-rendered Vercel application in April 2026, that unresolved SSR story is not a minor footnote. It is a real adoption constraint. So the right summary is: TanStack DB is a strategically important source for where reactive state tooling is heading, but teams should treat it as an emerging dependency to evaluate carefully rather than a default foundation for critical production paths.

## Implications

- TanStack DB is a strong reference for reactive, optimistic, collection-based state in agent UIs.
- Its design makes StreamDB and other durable-session patterns easier to understand.
- The unresolved SSR story means it should not be treated as a low-risk default for server-rendered apps yet.

## Related Sources

- [ElectricSQL StreamDB](electricsql-streamdb.md)
- [Vercel AI SDK v5](vercel-ai-sdk-v5.md)

