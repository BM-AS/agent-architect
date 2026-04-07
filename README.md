# Agent Architect

An AI skill that helps you design the right agent system for your use case.

Point your coding agent at this skill. It asks structured questions about what you're building, then recommends architecture patterns backed by curated references to real tools and frameworks — not hallucinated suggestions.

## Install

**ClawHub:**
```bash
npx clawhub install @blockmind/agent-architect
```

**skills.sh:**
```bash
npx skills add BM-AS/agent-architect
```

**Manual:**
```bash
git clone https://github.com/BM-AS/agent-architect.git
# Point your agent at skills/agent-architect/SKILL.md
```

## What Happens

Your agent loads the skill and becomes an architecture consultant. It walks you through questions about your use case — surfaces, tools, memory, deployment — then synthesizes a recommendation grounded in 8+ curated source summaries covering:

- **Gateway patterns** — multi-channel agent routing (OpenClaw)
- **Repo conventions** — making repos agent-friendly (Codex AGENTS.md, Claude CLAUDE.md)
- **Knowledge patterns** — LLM-maintained wikis (Karpathy)
- **Agent context** — filesystem-native workflows (AgentSearch, Nia)
- **Infrastructure** — storage and publishing (Fly/Tigris)
- **Docs sites** — browsable documentation (Fumadocs)

## Example

```
You:    I want to build a personal AI assistant I can message from Telegram
        and Slack. It should remember our conversations and help me manage
        my projects.

Agent:  Good starting point. Telegram + Slack means you need a multi-channel
        gateway — something that sits between your chat apps and the AI model.
        What coding agent do you use for development? Codex, Claude Code, or
        something else?

You:    Claude Code mostly, sometimes Cursor.

Agent:  Got it. Do you need the assistant to browse the web or call external
        APIs, or is it mainly conversational?

        ...after intake...

Agent:  Here's what I'd recommend:

        **Gateway:** OpenClaw — self-hosted, connects Telegram + Slack to your
        model with built-in memory and skills. See references/openclaw-docs.md.

        **Repo setup:** Add a CLAUDE.md with your project conventions so Claude
        Code has persistent context. See references/claude-code-memory-docs.md.

        **Memory:** OpenClaw's workspace files (MEMORY.md, SOUL.md) give your
        agent session-to-session continuity without external databases.

        Want me to go deeper on any of these?
```

## Wiki Structure (Power Users)

The skill is backed by a curated knowledge base you can browse directly:

```
knowledge/
  external-docs/
    manifest.json           # Source registry with Zod-validated metadata
    metadata/               # Per-source metadata files
  wiki/
    summaries/              # 8 source summary pages
    references/             # Foundational sources + source map
src/
  schemas/source.ts         # Zod v4 schema
  cli/                      # kb sources list / kb sources read <id>
```

Browse with Obsidian for the best experience, or use the CLI:

```bash
bun install
bun run sources:list
bun run sources:read karpathy-llm-wiki
```

## Contributing

### Adding a Source

1. Add the source to `knowledge/external-docs/manifest.json`
2. Create `knowledge/external-docs/metadata/<source-id>.json`
3. Write `knowledge/wiki/summaries/<source-id>.md` (200+ words, not a stub)
4. Copy the summary to `skills/agent-architect/references/<source-id>.md`
5. Update `knowledge/wiki/references/foundational-sources.md` and `source-map.md`
6. Run `bun run typecheck && bun run sources:list`

### Improving the Skill

Edit `skills/agent-architect/SKILL.md`. The skill should stay under 500 lines — move detailed content to reference files.

## Credits

Architecture pattern inspired by [Andrej Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — raw sources feed a maintained wiki, conversations happen on top of compiled knowledge.

Built by [BlockMind](https://blockmind.app).
