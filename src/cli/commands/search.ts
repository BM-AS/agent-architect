import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import { resolve, relative } from "node:path";
import type { Command } from "commander";

const execFileAsync = promisify(execFile);

interface SearchHit {
  path: string;
  score: number;
  matchedLines: { line: number; text: string }[];
  title?: string;
  tags?: string[];
}

interface SearchOptions {
  limit?: string;
  scope?: string;
  json?: boolean;
}

const REPO_ROOT = process.cwd();

const SCOPES: Record<string, string[]> = {
  all: [
    "knowledge/external-docs/snapshots",
    "knowledge/wiki/summaries",
    "knowledge/wiki/references",
  ],
  snapshots: ["knowledge/external-docs/snapshots"],
  summaries: ["knowledge/wiki/summaries"],
  wiki: ["knowledge/wiki/summaries", "knowledge/wiki/references"],
};

async function ripgrepSearch(query: string, paths: string[]): Promise<Map<string, SearchHit>> {
  const hits = new Map<string, SearchHit>();

  // Tokenize: split on whitespace, keep tokens >= 3 chars, lowercase
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 3)
    .map((t) => t.replace(/[^a-z0-9-]/g, ""))
    .filter(Boolean);

  if (tokens.length === 0) return hits;

  // Filter to existing paths only
  const existingPaths: string[] = [];
  for (const p of paths) {
    try {
      const fs = await import("node:fs/promises");
      await fs.access(resolve(REPO_ROOT, p));
      existingPaths.push(p);
    } catch {
      // skip missing
    }
  }

  if (existingPaths.length === 0) return hits;

  // For each token, run ripgrep and accumulate matches per file
  for (const token of tokens) {
    try {
      const { stdout } = await execFileAsync(
        "rg",
        ["--json", "--smart-case", "--type", "md", token, ...existingPaths],
        { maxBuffer: 10 * 1024 * 1024 },
      );

      for (const rawLine of stdout.split("\n")) {
        if (!rawLine.trim()) continue;
        let event: { type: string; data?: { path?: { text?: string }; line_number?: number; lines?: { text?: string } } };
        try {
          event = JSON.parse(rawLine);
        } catch {
          continue;
        }
        if (event.type !== "match" || !event.data?.path?.text) continue;

        const filePath = event.data.path.text;
        const lineNumber = event.data.line_number ?? 0;
        const lineText = event.data.lines?.text?.trim() ?? "";

        let hit = hits.get(filePath);
        if (!hit) {
          hit = { path: filePath, score: 0, matchedLines: [] };
          hits.set(filePath, hit);
        }
        hit.score += 1;
        if (hit.matchedLines.length < 5) {
          hit.matchedLines.push({ line: lineNumber, text: lineText });
        }
      }
    } catch (err) {
      // ripgrep returns exit 1 when no matches; ignore
      if ((err as { code?: number }).code !== 1) {
        throw err;
      }
    }
  }

  // Enrich hits with title and tags from frontmatter, and apply ranking
  // adjustments: BM25-style length normalization + path/filename bonus.
  for (const hit of hits.values()) {
    try {
      const content = await readFile(hit.path, "utf8");
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      const fm = fmMatch?.[1];
      if (fm) {
        const titleMatch = fm.match(/^title:\s*"?([^"\n]+)"?/m);
        if (titleMatch?.[1]) hit.title = titleMatch[1].trim();
        const tagsMatch = fm.match(/^tags:\s*\[([^\]]+)\]/m);
        if (tagsMatch?.[1]) {
          hit.tags = tagsMatch[1].split(",").map((t) => t.trim().replace(/['"]/g, ""));
        }
      } else {
        // Fall back to first H1
        const h1Match = content.match(/^#\s+(.+)$/m);
        if (h1Match?.[1]) hit.title = h1Match[1].trim();
      }

      // Path/filename bonus — heavy weight because path names are curated.
      // Strip common dirs and extension before matching tokens.
      const pathBasename = hit.path
        .toLowerCase()
        .replace(/^.*\//, "")
        .replace(/\.md$/, "");
      const pathSegments = hit.path.toLowerCase().split(/[\/_-]/);
      for (const token of tokens) {
        if (pathBasename.includes(token)) hit.score += 15;
        else if (pathSegments.some((seg) => seg.includes(token))) hit.score += 6;
      }

      // Title-match bonus
      if (hit.title) {
        const titleLower = hit.title.toLowerCase();
        for (const token of tokens) {
          if (titleLower.includes(token)) hit.score += 5;
        }
      }
      // Tag-match bonus
      if (hit.tags) {
        for (const tag of hit.tags) {
          for (const token of tokens) {
            if (tag.toLowerCase().includes(token)) hit.score += 3;
          }
        }
      }

      // BM25-style length normalization: penalize long documents.
      // Use a soft normalization so very short docs aren't massively boosted.
      const lengthKb = content.length / 1024;
      const lengthPenalty = 1 / (1 + Math.log10(1 + lengthKb / 5));
      hit.score = Math.round(hit.score * lengthPenalty * 100) / 100;
    } catch {
      // skip files we can't read
    }
  }

  return hits;
}

export function registerSearchCommand(parent: Command): void {
  parent
    .command("search <query...>")
    .description("Search the knowledge base (ripgrep + frontmatter ranking)")
    .option("-l, --limit <n>", "Max results", "5")
    .option("-s, --scope <scope>", "Scope: all|snapshots|summaries|wiki", "all")
    .option("--json", "Output JSON")
    .action(async (queryParts: string[], options: SearchOptions) => {
      const query = queryParts.join(" ");
      const limit = parseInt(options.limit ?? "5", 10);
      const scope = options.scope ?? "all";

      const paths = SCOPES[scope];
      if (!paths) {
        process.stderr.write(`Unknown scope: ${scope}. Use one of: ${Object.keys(SCOPES).join(", ")}\n`);
        process.exit(1);
      }

      const hits = await ripgrepSearch(query, paths);
      const sorted = Array.from(hits.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((h) => ({
          ...h,
          path: relative(REPO_ROOT, h.path),
        }));

      if (options.json) {
        process.stdout.write(`${JSON.stringify({ query, scope, results: sorted }, null, 2)}\n`);
        return;
      }

      if (sorted.length === 0) {
        process.stdout.write(`No results for: ${query}\n`);
        return;
      }

      process.stdout.write(`Query: ${query} (scope=${scope})\n\n`);
      for (const [i, hit] of sorted.entries()) {
        process.stdout.write(`${i + 1}. [${hit.score}] ${hit.title ?? hit.path}\n`);
        process.stdout.write(`   ${hit.path}\n`);
        if (hit.tags?.length) process.stdout.write(`   tags: ${hit.tags.join(", ")}\n`);
        for (const ml of hit.matchedLines.slice(0, 2)) {
          const trimmed = ml.text.length > 100 ? `${ml.text.slice(0, 100)}…` : ml.text;
          process.stdout.write(`   L${ml.line}: ${trimmed}\n`);
        }
        process.stdout.write("\n");
      }
    });
}
