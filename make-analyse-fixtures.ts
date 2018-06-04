#!/usr/bin/env node

import { readFile, writeFile } from "fs-extra";
import * as path from "path";
import parse from "./parse";
import { ParsedTest } from "./types";

const fixtureKeys = require("./fixture-keys");

const writeAFile = (snaps: ParsedTest[]) => async (fixtureKey: string) => {
  const parsedSnap = snaps.find(({ key }) => key === `${fixtureKey} 1`);

  if (parsedSnap) {
    await writeFile(
      `./analyse-fixtures/${fixtureKey}.json`,
      JSON.stringify(parsedSnap)
    );
  }
};

const makeFixtures = async () => {
  const snapshotContents = await readFile(
    path.join(process.cwd(), "__snapshots__/generate-snapshots.js.snap"),
    "utf8"
  );
  const snaps = parse(snapshotContents);

  await Promise.all(fixtureKeys.map(writeAFile(snaps)));
};

makeFixtures();
