#!/usr/bin/env node

import { Command } from "commander";

import { registerEvalRetrievalCommand } from "./commands/eval-retrieval.js";
import { registerMirrorCommand } from "./commands/mirror.js";
import { registerSearchCommand } from "./commands/search.js";
import { registerSourcesListCommand } from "./commands/sources-list.js";
import { registerSourcesReadCommand } from "./commands/sources-read.js";

async function main(): Promise<void> {
  const program = new Command();
  program
    .name("kb")
    .description("Knowledge base CLI for curated external references")
    .version("1.0.0");

  const sources = program.command("sources").description("Work with curated external sources");
  registerSourcesListCommand(sources);
  registerSourcesReadCommand(sources);

  registerSearchCommand(program);
  registerMirrorCommand(program);
  registerEvalRetrievalCommand(program);

  await program.parseAsync(process.argv);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
