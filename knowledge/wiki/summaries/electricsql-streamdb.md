# ElectricSQL StreamDB

## Source

- Canonical URL: https://durablestreams.com/stream-db
- Related URL: https://electric-sql.com/blog/2026/03/26/stream-db

## Summary

StreamDB is ElectricSQL's higher-level state layer built on top of Durable Streams and the State Protocol. Where Durable Streams gives you reliable append and resume semantics, StreamDB turns those stream events into typed collections that can be queried reactively. The model is aimed directly at applications such as chat systems and agent products that need messages, presence, approvals, tool calls, and other session entities to behave like a live database without forcing each team to hand-build a sync engine.

The key abstraction is a schema-driven state model. A developer defines entity types and primary keys, then binds a stream to that schema so incoming events materialize into collections. StreamDB can multiplex several entity types on one stream, derive higher-level views from lower-level events, and expose those views through TanStack DB's reactive query model. In practice, that means the same underlying event history can drive a live conversation view, a pending-approvals panel, a presence roster, or an audit trail. Optimistic writes can also be layered on top so the UI responds immediately while the stream catches up.

For product-agent architecture, StreamDB is attractive because it gives the session-state plane a more ergonomic shape than raw event bytes. If a team wants the product shell and a backstage runtime to communicate through shared durable state, StreamDB is one of the clearest early attempts to make that state plane typed, queryable, and UI-friendly. It also connects directly to the March 2026 durable transport adapters for AI SDK and TanStack AI, which is why it appears so often in discussions of durable AI chat.

The limiting factor is maturity, not architecture. StreamDB launched March 26, 2026 — very new. The architecture it points toward (durable event history + typed reactive projections + runtime kept separate from state ownership) is sound. For teams evaluating StreamDB as the state plane in Architecture B, the adoption decision should be driven by team risk tolerance, not SSR concerns.

**On SSR:** StreamDB depends on TanStack DB, whose SSR story is still being designed. For client-initiated dashboard AI products — where a human prompt from the browser is the primary interaction — SSR is not the relevant constraint. The relevant architecture is: client polls or SSE-subscribes to the stream, server renders the initial shell, AI responses stream in via the transport. If that fits the product model, the SSR gap is not a practical blocker.

## Implications

- StreamDB is a useful reference for how a session/event stream can become a reactive state plane instead of a raw log.
- It is promising for agent products with messages, presence, approvals, and shared state projections.
- The architecture is sound; maturity is the only real question mark.

## Related Sources

- [ElectricSQL Durable Streams](electricsql-durable-streams.md)
- [TanStack DB](tanstack-db.md)

