# Blockmind Knowledge

Blockmind Knowledge is a standalone, LLM-maintained knowledge base with a first-class external references layer. It follows the Karpathy-style pattern of keeping raw inputs separate from a maintained wiki, then using that wiki as the durable substrate for future agent and human conversations.

## Quick Start

```bash
bun install
bun run typecheck
bun run sources:list
bun run sources:read karpathy-llm-wiki
```

You can also run the CLI through the shell wrapper:

```bash
./scripts/kb.sh sources list
./scripts/kb.sh sources read karpathy-llm-wiki
```

## Structure Overview

- `knowledge/raw/`: immutable local source documents
- `knowledge/external-docs/`: curated external reference registry, mirrored docs, snapshots, and per-source metadata
- `knowledge/wiki/`: maintained markdown wiki, including source summaries and reference pages
- `src/schemas/`: Zod contracts for source metadata
- `src/cli/`: Commander-based `kb` CLI

## Adding Sources

1. Add a new source entry to `knowledge/external-docs/manifest.json`.
2. Create `knowledge/external-docs/metadata/<source-id>.json`.
3. Write `knowledge/wiki/summaries/<source-id>.md`.
4. Update the reference pages if the new source changes the category map or reading order.
5. Run `bun run typecheck`, `bun run sources:list`, and `bun run sources:read <source-id>`.

## Browsing the Wiki

The repository is designed to work well as plain markdown, but Obsidian is the recommended local browser because it makes linked wiki navigation and markdown-first maintenance straightforward. Start with [knowledge/wiki/_index.md](knowledge/wiki/_index.md), then move into the source summaries and reference pages.

## Credits

The core architecture is inspired by Andrej Karpathy's LLM wiki pattern: raw sources feed a maintained wiki, and conversations happen on top of that maintained knowledge layer rather than recomputing understanding from scratch on every prompt.
