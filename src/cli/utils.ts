import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { type SourceManifest, type SourceMetadata, SourceManifestSchema } from "../schemas/source.js";

const MODULE_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(MODULE_DIR, "../..");
const MANIFEST_PATH = resolve(REPO_ROOT, "knowledge/external-docs/manifest.json");

export function getRepoRoot(): string {
  return REPO_ROOT;
}

export function getManifestPath(): string {
  return MANIFEST_PATH;
}

export async function loadManifest(): Promise<SourceManifest> {
  let manifestRaw: string;

  try {
    manifestRaw = await readFile(MANIFEST_PATH, "utf8");
  } catch (error: unknown) {
    if (isErrorWithCode(error) && error.code === "ENOENT") {
      throw new Error(`Manifest not found at ${MANIFEST_PATH}`);
    }

    throw new Error(`Failed to read manifest at ${MANIFEST_PATH}`);
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(manifestRaw) as unknown;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(`Manifest contains invalid JSON at ${MANIFEST_PATH}`);
    }

    throw error;
  }

  const manifest = SourceManifestSchema.safeParse(parsed);

  if (!manifest.success) {
    const details = manifest.error.issues
      .map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join(".") : "root";
        return `- ${path}: ${issue.message}`;
      })
      .join("\n");
    throw new Error(`Manifest validation failed:\n${details}`);
  }

  return manifest.data;
}

export async function loadSourceById(id: string): Promise<SourceMetadata | undefined> {
  const manifest = await loadManifest();
  return manifest.sources.find((source) => source.id === id);
}

export async function readSummaryPage(summaryPagePath: string): Promise<string | null> {
  const absolutePath = resolve(getRepoRoot(), summaryPagePath);

  try {
    return await readFile(absolutePath, "utf8");
  } catch (error: unknown) {
    if (isErrorWithCode(error) && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

function isErrorWithCode(error: unknown): error is Error & { code: string } {
  return error instanceof Error && "code" in error && typeof error.code === "string";
}

export function isSourceStale(source: SourceMetadata, now: Date = new Date()): boolean {
  if (!source.reviewedAt) {
    return true;
  }

  const reviewedAt = new Date(source.reviewedAt);
  const ageMs = now.getTime() - reviewedAt.getTime();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
  return ageMs > ninetyDaysMs;
}

export function formatDate(value?: string): string {
  if (!value) {
    return "never";
  }

  return value.slice(0, 10);
}

export function printSourceList(sources: SourceMetadata[]): void {
  if (sources.length === 0) {
    process.stdout.write("No sources matched the requested filters.\n");
    return;
  }

  const rows = sources.map((source) => ({
    id: source.id,
    title: source.title,
    category: source.category,
    authority: source.authorityLevel,
    reviewed: formatDate(source.reviewedAt),
  }));

  const widths = {
    id: Math.max("ID".length, ...rows.map((row) => row.id.length)),
    title: Math.max("Title".length, ...rows.map((row) => row.title.length)),
    category: Math.max("Category".length, ...rows.map((row) => row.category.length)),
    authority: Math.max("Authority".length, ...rows.map((row) => row.authority.length)),
    reviewed: Math.max("Reviewed".length, ...rows.map((row) => row.reviewed.length)),
  };

  const header = [
    "ID".padEnd(widths.id),
    "Title".padEnd(widths.title),
    "Category".padEnd(widths.category),
    "Authority".padEnd(widths.authority),
    "Reviewed".padEnd(widths.reviewed),
  ].join("  ");

  const separator = [
    "-".repeat(widths.id),
    "-".repeat(widths.title),
    "-".repeat(widths.category),
    "-".repeat(widths.authority),
    "-".repeat(widths.reviewed),
  ].join("  ");

  const lines = rows.map((row) =>
    [
      row.id.padEnd(widths.id),
      row.title.padEnd(widths.title),
      row.category.padEnd(widths.category),
      row.authority.padEnd(widths.authority),
      row.reviewed.padEnd(widths.reviewed),
    ].join("  "),
  );

  process.stdout.write(`${header}\n${separator}\n${lines.join("\n")}\n`);
}
