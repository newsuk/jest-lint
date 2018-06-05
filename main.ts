import * as glob from "glob";
import chalk from "chalk";
import analyse from "./analyse";
import report from "./report";
import writer from "./console";
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

        if (matches.length === 0) {
          console.log(chalk.yellow("No snaps were found"));
        }

        return res(matches);
      }
    );
  });

export default async (cwd: Dir, opts: Options) => {
  const snapshots = await getSnapshots(cwd);

  const results = await Promise.all(snapshots.map(analyse));

  const criteria = report({
    genericAttrs: opts.genericAttributes || [],
    genericValues: opts.genericValues || ["[Function]"],
    maxAttr: opts.maxAttributes || 5,
    maxAttrLength: opts.maxAttributeLength || 30,
    maxDepth: opts.maxDepth || 10,
    maxFileSize: opts.maxFileSize || 10000,
    maxGenericElement: opts.maxGenericElements || 10,
    maxLines: opts.maxLines || 300
  });

  const output = results.map(r => criteria(r));

  writer(output);
};
