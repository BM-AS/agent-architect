# Agent Architect

This wiki is the maintained knowledge layer for the repository. It sits between immutable source material in `knowledge/raw/` or `knowledge/external-docs/` and any future agent or human conversation that needs to reuse the compiled understanding.

## Entry Points

- [Foundational Sources](references/foundational-sources.md) groups the seeded sources by category and explains why each belongs in the corpus.
- [Source Map](references/source-map.md) shows which sources matter most for common implementation questions.
- `summaries/` contains one source summary per external document. Each page captures the key ideas, operational implications, and where that source fits in the overall knowledge model.

## Operating Model

1. Raw or mirrored source material is kept immutable.
2. Summary pages capture the source faithfully and in repo-native terms.
3. Future synthesis pages can combine multiple summaries without overwriting the source-specific understanding.

Use an Obsidian-compatible markdown workflow when browsing locally. Prefer links between topic pages rather than duplicating the same explanation in multiple places.
