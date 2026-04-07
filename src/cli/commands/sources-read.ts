import { Command } from "commander";

import { loadSourceById, readSummaryPage } from "../utils.js";

export function registerSourcesReadCommand(parent: Command): void {
  parent
    .command("read")
    .description("Read a source entry and its summary page")
    .argument("<id>", "Source identifier")
    .action(async (id: string) => {
      const source = await loadSourceById(id);

      if (!source) {
        throw new Error(`Source not found: ${id}`);
      }

      const summary = await readSummaryPage(source.summaryPagePath);
      const metadata = JSON.stringify(source, null, 2);

      process.stdout.write(`${metadata}\n`);

      if (summary) {
        process.stdout.write(`\n--- SUMMARY ---\n${summary}`);
        if (!summary.endsWith("\n")) {
          process.stdout.write("\n");
        }
        return;
      }

      process.stdout.write("\n--- SUMMARY ---\nNo summary page found.\n");
    });
}
