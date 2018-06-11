import * as glob from "glob";
import chalk from "chalk";
import analyse from "./analyse";
import report from "./report";
import writer from "./console";
import { Options, Dir } from "./types";

const getSnapshots = (cwd: Dir, snapPattern?: string) =>
  new Promise<string[]>((res, rej) => {
    glob(
      snapPattern || "**/*.js.snap",
      {
        cwd,
        ignore: ["**/node_modules/**"]
      },
      (err, matches) => {
        if (err) {
          return rej(err);
        }

        if (matches.length === 0) {
          console.log(chalk.yellow("No snaps were found"));
        }

        return res(matches);
      }
    );
  });

export default async (cwd: Dir, opts: Options) => {
  const snapshots = await getSnapshots(cwd, opts.snapPattern);

  const results = await Promise.all(snapshots.map(analyse));

  const criteria = report({
    genericAttrs: opts.genericAttributes || [],
    genericValues: opts.genericValues || ["[Function]"],
    maxAttr: opts.maxAttributes || 5,
    maxAttrArrayLength: opts.maxAttributeArrayLength || 5,
    maxAttrStringLength: opts.maxAttributeStringLength || 30,
    maxDepth: opts.maxDepth || 10,
    maxFileSize: opts.maxFileSize || 10000,
    maxGenericElement: opts.maxGenericElements || 10,
    maxLines: opts.maxLines || 300
  });

  const output = results.map(r => criteria(r));

  writer(output);
};
