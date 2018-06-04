#!/usr/bin/env node

const config = require("./package.json");
import * as program from "commander";
import main from "./main";

program
  .version(config.version)
  .usage("[...options]")
  .description("A tool to analyse/validate jest snapshots")
  .option("-ml --maxLines", "max lines allowed in a snapshot: defaults to 200")
  .option(
    "-mfs --maxFileSize",
    "max file size allowed as a snapshot: defaults to 200kb"
  )
  .option(
    "-au --allowUndefined",
    "the default is to error on undefined snapshot values"
  )
  .option("-v --verbose", "whether to log out everything or not")
  .parse(process.argv);

const {
  maxLines = 200,
  maxFileSize = 200,
  allowUndefined = false,
  verbose = false
} = program;

main(process.cwd(), {
  maxLines,
  maxFileSize,
  allowUndefined,
  isVerbose: verbose
});
