# AGENTS.md

This repository is a standalone knowledge base for curated external references. The canonical flow is:

1. Raw or mirrored sources stay immutable.
2. Source summaries distill those references into stable markdown pages.
3. Reference pages map the corpus for future synthesis and browsing.
4. The CLI exposes the manifest as a stable machine-readable interface.

## File Tree

```text
knowledge/
  raw/
  external-docs/
    manifest.json
    imports/
    snapshots/
    metadata/
  wiki/
    _index.md
    references/
    summaries/
src/
  schemas/
  cli/
scripts/
```

## Repo Structure

- `knowledge/external-docs/manifest.json`: single source of truth for curated external sources
- `knowledge/external-docs/metadata/`: per-source metadata JSON files keyed by source ID
- `knowledge/wiki/summaries/`: one markdown summary page per source
- `knowledge/wiki/references/`: navigation and synthesis scaffolding for the corpus
- `src/schemas/source.ts`: Zod validation for source metadata
- `src/cli/`: `kb` CLI commands built with Commander

## Adding a New Source

1. Add the source record to `knowledge/external-docs/manifest.json`.
2. Create `knowledge/external-docs/metadata/<source-id>.json` with the same metadata.
3. Write `knowledge/wiki/summaries/<source-id>.md` with a real summary, not a stub.
4. Update the reference pages if the new source changes category coverage or reading order.
5. Run `bun run typecheck`, `bun run sources:list`, and `bun run sources:read <source-id>`.

## Wiki Conventions

- Keep one file per source or topic.
- Prefer relative markdown links so pages work in GitHub and Obsidian.
- Use headings that make agent parsing easy: `Source`, `Summary`, `Implications`, `Related Sources`.
- Treat source summaries as source-faithful pages. Put cross-source synthesis in dedicated reference or topic pages.

## CLI Usage

- `bun run sources:list`
- `bun run sources:list -- --stale`
- `bun run sources:list -- --category agent-customization`
- `bun run sources:read codex-customization-docs`
- `./scripts/kb.sh sources list`

## Agent Architect Skill

The primary user-facing deliverable is `skills/agent-architect/`. This is an installable skill published to ClawHub and skills.sh under @blockmind. It bundles copies of wiki summaries in `skills/agent-architect/references/` for standalone use.

When adding a new source, also copy the summary to `skills/agent-architect/references/`. Keep the skill's references in sync with `knowledge/wiki/summaries/`.

## Guardrails

- Never modify raw source content to make it easier to summarize; preserve the original and capture interpretation in the wiki layer.
- Keep manifest entries, metadata files, and summary page paths aligned.
- Put metadata rules in the schema first. If validation rules change, update the content to satisfy the schema instead of creating alternate parsing paths.
