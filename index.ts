#!/usr/bin/env node

const config = require("./package.json");
import * as program from "commander";
import main from "./main";

program
  .version(config.version)
  .usage("[...options]")
  .description("A tool to analyse/validate jest snapshots")
  .option("-v --verbose", "whether to log out everything or not")
  .parse(process.argv);

const {
  verbose = false
} = program;

main(process.cwd(), {
  isVerbose: verbose
});
