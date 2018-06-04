import { test } from "ava";
import * as path from "path";
import analyse from "./analyse";

test("should produce the expected report", async t =>
  t.snapshot(
    await analyse(
      path.join(process.cwd(), "./__snapshots__/generate-snapshots.js.snap")
    )
  ));
