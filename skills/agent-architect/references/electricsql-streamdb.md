# ElectricSQL StreamDB

## Source

- Canonical URL: https://durablestreams.com/stream-db
- Related URL: https://electric-sql.com/blog/2026/03/26/stream-db

## Summary

StreamDB is ElectricSQL's higher-level state layer built on top of Durable Streams and the State Protocol. Where Durable Streams gives you reliable append and resume semantics, StreamDB turns those stream events into typed collections that can be queried reactively. The model is aimed directly at applications such as chat systems and agent products that need messages, presence, approvals, tool calls, and other session entities to behave like a live database without forcing each team to hand-build a sync engine.

The key abstraction is a schema-driven state model. A developer defines entity types and primary keys, then binds a stream to that schema so incoming events materialize into collections. StreamDB can multiplex several entity types on one stream, derive higher-level views from lower-level events, and expose those views through TanStack DB's reactive query model. In practice, that means the same underlying event history can drive a live conversation view, a pending-approvals panel, a presence roster, or an audit trail. Optimistic writes can also be layered on top so the UI responds immediately while the stream catches up.

For product-agent architecture, StreamDB is attractive because it gives the session-state plane a more ergonomic shape than raw event bytes. If a team wants the product shell and a backstage runtime to communicate through shared durable state, StreamDB is one of the clearest early attempts to make that state plane typed, queryable, and UI-friendly. It also connects directly to the March 2026 durable transport adapters for AI SDK and TanStack AI, which is why it appears so often in discussions of durable AI chat.

The limiting factor is maturity and dependency stack. StreamDB launched on March 26, 2026, so it is extremely new. It also depends conceptually on Durable Streams and operationally on TanStack DB, whose server-rendering story was still unresolved at the time. That means StreamDB is a strong source for an emerging pattern, but not a conservative production default. The lasting value in this repo is the architecture it points toward: durable event history plus typed reactive projections, with runtime choice kept separate from state ownership.

## Implications

- StreamDB is a useful reference for how a session/event stream can become a reactive state plane instead of a raw log.
- It is promising for agent products with messages, presence, approvals, and shared state projections.
- Its current viability is constrained by its own newness and by TanStack DB's unresolved SSR story.

## Related Sources

- [ElectricSQL Durable Streams](electricsql-durable-streams.md)
- [TanStack DB](tanstack-db.md)

