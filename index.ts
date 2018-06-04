#!/usr/bin/env node

const config = require("./package.json");
import * as program from "commander";
import { readFile } from "fs-extra";
import * as path from "path";
import main from "./main";

program
  .version(config.version)
  .usage("[...options]")
  .description("A tool to analyse/validate jest snapshots")
  .option("-v --verbose", "whether to log out everything or not")
  .parse(process.argv);

const { verbose = false } = program;

readFile(path.join(process.cwd(), ".jestlint"), "utf8")
  .then(contents =>
    main(process.cwd(), {
      ...JSON.parse(contents),
      isVerbose: verbose
    })
  )
  .catch(() => {
    if (verbose) {
      console.log("No config found");
    }

    main(process.cwd(), {
      isVerbose: verbose
    });
  });
