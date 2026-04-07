import { Command } from "commander";

import { isSourceStale, loadManifest, printSourceList } from "../utils.js";

export function registerSourcesListCommand(parent: Command): void {
  parent
    .command("list")
    .description("List all curated external sources")
    .option("--stale", "Show only sources not reviewed in the last 90 days")
    .option("--category <category>", "Filter sources by category")
    .option("--tag <tag>", "Filter sources by tag")
    .action(async (options: { stale?: boolean; category?: string; tag?: string }) => {
      const manifest = await loadManifest();
      const categoryFilter = options.category?.trim().toLowerCase();
      const tagFilter = options.tag?.trim().toLowerCase();

      const filtered = manifest.sources.filter((source) => {
        if (options.stale && !isSourceStale(source)) {
          return false;
        }

        if (categoryFilter && source.category.toLowerCase() !== categoryFilter) {
          return false;
        }

        if (tagFilter && !source.tags.some((tag) => tag.toLowerCase() === tagFilter)) {
          return false;
        }

        return true;
      });

      printSourceList(filtered);
    });
}
