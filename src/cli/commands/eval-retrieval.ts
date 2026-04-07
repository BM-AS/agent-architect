import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Command } from "commander";

const execFileAsync = promisify(execFile);

interface Fixture {
  id: string;
  query: string;
  issueText: string;
  expectedPaths: string[];
  rationale: string;
}

interface FixtureFile {
  schema: string;
  description: string;
  fixtures: Fixture[];
}

interface SearchResult {
  query: string;
  scope: string;
  results: { path: string; score: number; title?: string }[];
}

interface FixtureScore {
  id: string;
  query: string;
  expectedCount: number;
  precisionAt1: 0 | 1;
  recallAtK: number; // fraction of expected paths in top K
  topResultPath: string | null;
  topResultMatched: boolean;
  matchedExpected: string[];
  missedExpected: string[];
}

async function runSearch(query: string, limit: number): Promise<SearchResult> {
  const cliPath = resolve("dist/cli/index.js");
  const { stdout } = await execFileAsync("node", [cliPath, "search", query, "--json", "-l", String(limit)], {
    maxBuffer: 5 * 1024 * 1024,
  });
  return JSON.parse(stdout) as SearchResult;
}

export function registerEvalRetrievalCommand(parent: Command): void {
  parent
    .command("eval-retrieval")
    .description("Run kb search against fixture set, compute precision@1 and recall@k")
    .option("-f, --fixtures <path>", "Fixtures file", "knowledge/eval/retrieval-fixtures.json")
    .option("-k, --k <n>", "Top-K for recall measurement", "5")
    .action(async (options: { fixtures?: string; k?: string }) => {
      const fixturesPath = resolve(options.fixtures ?? "knowledge/eval/retrieval-fixtures.json");
      const k = parseInt(options.k ?? "5", 10);
      const raw = await readFile(fixturesPath, "utf8");
      const file = JSON.parse(raw) as FixtureFile;

      const scores: FixtureScore[] = [];

      for (const fx of file.fixtures) {
        const result = await runSearch(fx.query, k);
        const topPaths = result.results.map((r) => r.path);
        const matched = fx.expectedPaths.filter((p) => topPaths.includes(p));
        const missed = fx.expectedPaths.filter((p) => !topPaths.includes(p));
        const precisionAt1 = topPaths[0] && fx.expectedPaths.includes(topPaths[0]) ? 1 : 0;
        const recallAtK = fx.expectedPaths.length > 0 ? matched.length / fx.expectedPaths.length : 0;

        scores.push({
          id: fx.id,
          query: fx.query,
          expectedCount: fx.expectedPaths.length,
          precisionAt1,
          recallAtK,
          topResultPath: topPaths[0] ?? null,
          topResultMatched: precisionAt1 === 1,
          matchedExpected: matched,
          missedExpected: missed,
        });
      }

      const totalFixtures = scores.length;
      const precisionAt1Avg = scores.reduce((s, x) => s + x.precisionAt1, 0) / totalFixtures;
      const recallAtKAvg = scores.reduce((s, x) => s + x.recallAtK, 0) / totalFixtures;
      const passedAt1 = scores.filter((x) => x.precisionAt1 === 1).length;

      process.stdout.write(`\n=== Retrieval Eval ===\n`);
      process.stdout.write(`Fixtures: ${totalFixtures}\n`);
      process.stdout.write(`K (recall window): ${k}\n\n`);

      for (const s of scores) {
        const status = s.precisionAt1 === 1 ? "✓" : "✗";
        process.stdout.write(`${status} ${s.id}\n`);
        process.stdout.write(`  query: ${s.query}\n`);
        process.stdout.write(`  precision@1: ${s.precisionAt1}\n`);
        process.stdout.write(`  recall@${k}: ${s.recallAtK.toFixed(2)} (${s.matchedExpected.length}/${s.expectedCount})\n`);
        process.stdout.write(`  top: ${s.topResultPath ?? "(none)"}\n`);
        if (s.missedExpected.length > 0) {
          process.stdout.write(`  missed:\n`);
          for (const m of s.missedExpected) process.stdout.write(`    - ${m}\n`);
        }
        process.stdout.write(`\n`);
      }

      process.stdout.write(`=== Summary ===\n`);
      process.stdout.write(`precision@1: ${precisionAt1Avg.toFixed(2)} (${passedAt1}/${totalFixtures} top results were relevant)\n`);
      process.stdout.write(`recall@${k}: ${recallAtKAvg.toFixed(2)}\n`);

      // Gate at 0.80 for both
      const gate = 0.8;
      const passes = precisionAt1Avg >= gate && recallAtKAvg >= gate;
      process.stdout.write(`\nGate (≥${gate} on both): ${passes ? "PASS" : "FAIL"}\n`);

      if (!passes) process.exitCode = 1;
    });
}
