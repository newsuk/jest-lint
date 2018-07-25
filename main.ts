import * as glob from "glob";
import chalk from "chalk";
import analyse from "./analyse";
import report from "./report";
import writer from "./console";
import { Dir, Options, Report } from "./types";

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

const reportHasError = (r: Report) => r.errors.length > 0;

export default async (cwd: Dir, opts: Options) => {
  const snapshots = await getSnapshots(cwd, opts.snapPattern);

  const results = await Promise.all(snapshots.map(analyse));

  const criteria = {
    genericAttrs: opts.genericAttributes || [],
    genericValues: opts.genericValues || ["[Function]"],
    maxAttr: opts.maxAttributes || 5,
    maxAttrArrayLength: opts.maxAttributeArrayLength || 5,
    maxAttrStringLength: opts.maxAttributeStringLength || 32,
    maxDepth: opts.maxDepth || 10,
    maxFileSize: opts.maxFileSize || 10000,
    maxGenericElement: opts.maxGenericElements || 10,
    maxLines: opts.maxLines || 300
  };

  const reporter = report(criteria);

  const output = results.map(r => reporter(r));

  writer(criteria, output, {
    errorsOnly: opts.usingCI,
    isVerbose: opts.isVerbose
  });

  if (output.some(reportHasError)) {
    process.exit(1);
  }
};
