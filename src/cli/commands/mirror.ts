import { mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import type { Command } from "commander";

interface MirrorOptions {
  sourceId: string;
  out?: string;
}

const REPO_ROOT = process.cwd();

interface UrlSpec {
  url: string;
  filename: string;
}

function urlToFilename(url: string): string {
  const u = new URL(url);
  const path = u.pathname.replace(/^\/+/, "").replace(/\/$/, "");
  if (!path) return "index.md";
  if (path.endsWith(".md")) return path;
  return `${path}.md`;
}

async function fetchMarkdown(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "agent-architect-mirror/1.0" },
  });
  if (!res.ok) {
    throw new Error(`fetch ${url} -> ${res.status} ${res.statusText}`);
  }
  return await res.text();
}

export function registerMirrorCommand(parent: Command): void {
  parent
    .command("mirror <sourceId> <urls...>")
    .description(
      "Mirror raw markdown URLs into knowledge/external-docs/snapshots/<sourceId>/. Use with .md URLs.",
    )
    .option("-o, --out <dir>", "Output base dir", "knowledge/external-docs/snapshots")
    .action(async (sourceId: string, urls: string[], options: MirrorOptions) => {
      if (!sourceId || urls.length === 0) {
        process.stderr.write("Usage: kb mirror <sourceId> <url> [url...]\n");
        process.exit(1);
      }

      const outBase = resolve(REPO_ROOT, options.out ?? "knowledge/external-docs/snapshots");
      const sourceDir = resolve(outBase, sourceId);
      await mkdir(sourceDir, { recursive: true });

      const fetchedAt = new Date().toISOString();
      const results: { url: string; path: string; bytes: number; ok: boolean; error?: string }[] = [];

      for (const url of urls) {
        try {
          const filename = urlToFilename(url);
          const targetPath = resolve(sourceDir, filename);
          await mkdir(dirname(targetPath), { recursive: true });
          const body = await fetchMarkdown(url);
          // Prepend frontmatter so search can find source URL + sourceId
          const enriched = `---\nsource_id: ${sourceId}\nsource_url: ${url}\nfetched_at: ${fetchedAt}\n---\n\n${body}`;
          await writeFile(targetPath, enriched, "utf8");
          results.push({ url, path: targetPath, bytes: enriched.length, ok: true });
          process.stdout.write(`✓ ${url} -> ${targetPath} (${enriched.length} bytes)\n`);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          results.push({ url, path: "", bytes: 0, ok: false, error: message });
          process.stderr.write(`✖ ${url} -> ${message}\n`);
        }
      }

      // Write a manifest of mirrored pages
      const manifestPath = resolve(sourceDir, "_mirror.json");
      await writeFile(
        manifestPath,
        `${JSON.stringify({ sourceId, fetchedAt, results }, null, 2)}\n`,
        "utf8",
      );
      process.stdout.write(`\nManifest: ${manifestPath}\n`);
    });
}
