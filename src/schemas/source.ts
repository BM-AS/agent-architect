import { z } from "zod";

export const SourceTypeSchema = z.enum([
  "whitepaper",
  "docs",
  "spec",
  "article",
  "repo",
  "gist",
  "manifesto",
  "guide",
  "reference",
]);

export const AuthorityLevelSchema = z.enum([
  "primary",
  "secondary",
  "tertiary",
]);

export const SourceMetadataSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  url: z.string().url(),
  additionalUrls: z.array(z.string().url()).optional(),
  category: z.string(),
  sourceType: SourceTypeSchema,
  authorityLevel: AuthorityLevelSchema,
  tags: z.array(z.string()),
  addedAt: z.string().datetime(),
  reviewedAt: z.string().datetime().optional(),
  localSnapshotPath: z.string().optional(),
  summaryPagePath: z.string(),
  notes: z.string().optional(),
  rationale: z.string(),
});

export const SourceManifestSchema = z.object({
  $schema: z.string().optional(),
  version: z.literal("1.0"),
  sources: z.array(SourceMetadataSchema),
});

export type SourceMetadata = z.infer<typeof SourceMetadataSchema>;
export type SourceManifest = z.infer<typeof SourceManifestSchema>;
