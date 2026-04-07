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

export const SourceMetadataSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  url: z.url(),
  additionalUrls: z.array(z.url()).optional(),
  category: z.string(),
  sourceType: SourceTypeSchema,
  authorityLevel: AuthorityLevelSchema,
  tags: z.array(z.string()),
  addedAt: z.iso.datetime(),
  reviewedAt: z.iso.datetime().optional(),
  localSnapshotPath: z.string().optional(),
  summaryPagePath: z.string(),
  notes: z.string().optional(),
  rationale: z.string(),
});

export const SourceManifestSchema = z
  .strictObject({
    $schema: z.string().optional(),
    version: z.literal("1.0"),
    sources: z.array(SourceMetadataSchema),
  })
  .superRefine((manifest, ctx) => {
    const seenIds = new Set<string>();

    for (const [index, source] of manifest.sources.entries()) {
      if (seenIds.has(source.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate source id '${source.id}'`,
          path: ["sources", index, "id"],
        });
        continue;
      }

      seenIds.add(source.id);
    }
  });

export type SourceMetadata = z.infer<typeof SourceMetadataSchema>;
export type SourceManifest = z.infer<typeof SourceManifestSchema>;
