import * as glob from "glob";
import analyse from "./analyse";
import report from "./report";
import console from "./console";
import { Options, Dir } from "./types";

const getSnapshots = (cwd: Dir) =>
  new Promise<string[]>((res, rej) => {
    glob(
      "**/*.js.snap",
      {
        cwd,
        ignore: ["node_modules/**"]
      },
      (err, matches) => {
        if (err) {
          return rej(err);
        }

        return res(matches);
      }
    );
  });

export default async (cwd: Dir, opts: Options) => {
  const snapshots = await getSnapshots(cwd);

  const results = await Promise.all(snapshots.map(analyse));

  const criteria = report({
    genericValues: ["[Function]"],
    maxAttr: 5,
    maxAttrLength: 30,
    maxDepth: 10,
    maxFileSize: 10000,
    maxGenericElement: 10,
    maxLines: 300
  });

  const output = results.map(r => criteria(r));

  console(output);
};
