# CLAUDE.md

This repository is a standalone knowledge base for curated external references. The operating model is simple: immutable raw or mirrored sources live under `knowledge/raw/` and `knowledge/external-docs/`, maintained wiki pages live under `knowledge/wiki/`, and the TypeScript CLI in `src/cli/` provides a stable way to inspect the manifest and summary content from the terminal.

## Repo Structure

- `knowledge/external-docs/manifest.json`: canonical registry of seeded and future external sources
- `knowledge/external-docs/metadata/`: one metadata file per source ID
- `knowledge/wiki/summaries/`: one summary page per external source
- `knowledge/wiki/references/`: higher-level navigation pages such as foundational sources and source maps
- `src/schemas/source.ts`: Zod contract for source metadata and the manifest
- `src/cli/`: `kb` command implementation

## Adding a New Source

1. Add the source to `knowledge/external-docs/manifest.json`.
2. Create a matching metadata file in `knowledge/external-docs/metadata/<source-id>.json`.
3. Create a summary page in `knowledge/wiki/summaries/<source-id>.md`.
4. Update `knowledge/wiki/references/foundational-sources.md` and `knowledge/wiki/references/source-map.md` when the new source changes the recommended reading order.
5. Run `bun run typecheck` and verify `bun run sources:list` plus `bun run sources:read <source-id>`.

## Wiki Conventions

- Prefer one file per source or topic.
- Use concise, explicit headings such as `Source`, `Summary`, `Implications`, or `Related Sources`.
- Prefer links over duplicated explanation. Use relative markdown links that remain usable in GitHub and Obsidian.
- Treat summary pages as faithful distillations of a source, not synthesis pages that merge multiple references without saying so.

## CLI Usage

- `bun run sources:list`
- `bun run sources:list -- --category agent-infrastructure`
- `bun run sources:list -- --tag obsidian`
- `bun run sources:read karpathy-llm-wiki`
- `./scripts/kb.sh sources read karpathy-llm-wiki`

## Agent Architect Skill

The primary user-facing deliverable is `skills/agent-architect/`. This is an installable skill that turns any coding agent into an architecture consultant. It bundles copies of the wiki summaries in `skills/agent-architect/references/` so it works standalone when installed via ClawHub or skills.sh.

When adding a new source, copy the summary to `skills/agent-architect/references/` as well. Keep the skill's reference copies in sync with `knowledge/wiki/summaries/`.

## Guardrails

- Never modify files in `knowledge/raw/` or mirrored external source content in a way that rewrites the original source.
- Keep the manifest, metadata JSON, and summary page paths aligned.
- Put business rules about source metadata in the Zod schema first, then update content to match.
