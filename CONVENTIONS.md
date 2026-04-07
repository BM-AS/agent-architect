# Knowledge Base Conventions

This repository uses a layered knowledge model. The goal is to keep source material intact, summarize sources faithfully, and reserve synthesis for dedicated pages that explicitly combine multiple references.

## Writing Summary Pages

Every summary page should be a real distillation of the source, not a placeholder. Use a predictable structure:

1. `Source`: canonical URL and important related URLs.
2. `Summary`: 200+ words that explain the main argument, system, or framework in repo-native terms.
3. Optional sections such as `Implications`, `Key Terms`, or `Related Sources` when the source needs more structure.

Summary pages should answer why the source matters, what it actually says, and how it connects to this knowledge base. Avoid marketing copy and avoid repeating headings without adding substance.

## Citing Sources in Wiki Pages

- Use a `Source` section at the top of summary pages.
- Link the canonical URL first, then list directly relevant supporting URLs.
- When a synthesis page depends on multiple references, link each summary page or original source explicitly instead of implying provenance.

## Wikilink Format

Plain markdown links are the default because they work in GitHub and Obsidian:

- Summary link: `[Karpathy LLM Wiki](../summaries/karpathy-llm-wiki.md)`
- Reference link: `[Foundational Sources](../references/foundational-sources.md)`

If a local workflow adds Obsidian wikilinks, keep the markdown link available or ensure the page remains readable in plain markdown tooling.

## Source Review Process

1. Add the source metadata to the manifest.
2. Review the source and write the summary page.
3. Set `reviewedAt` when the summary matches the current source.
4. Re-review sources whenever the upstream document changes materially or the summary no longer reflects current behavior.
5. Use the CLI stale filter to identify sources that need fresh review.

## Content Layers

- Raw imported source: unmodified source material in `knowledge/raw/`, `knowledge/external-docs/imports/`, or `knowledge/external-docs/snapshots/`
- Source summary: one markdown page in `knowledge/wiki/summaries/` that faithfully distills a single source
- Synthesis page: a higher-level page that connects several summaries into a topic map, recommendation, or working model

Do not collapse these layers. If a page starts mixing primary-source summary with cross-source recommendation, split it.
