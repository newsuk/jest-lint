import test from "ava";
import * as path from "path";
import main from "./main";

test("a snapshot with no errors should resolve successfully", async t => {
  await t.notThrowsAsync(
    main(path.join(process.cwd(), "good-snaps"), {
      usingCI: true,
      isVerbose: false
    })
  );
});

test("a snapshot with errors should reject", async t => {
  await t.throwsAsync(
    main(path.join(process.cwd(), "bad-snaps"), {
      usingCI: true,
      isVerbose: false
    })
  );
});
