import chalk from "chalk";
import { Report, TestError } from "./types";

const sortByType = (a: TestError, b: TestError): -1 | 0 | 1 => {
  if (a.type < b.type) {
    return -1;
  }

  if (a.type > b.type) {
    return 1;
  }

  return 0;
};

export default (sas: Report[]): void => {
  sas.forEach(sa => {
    console.log(chalk.white(sa.path));

    if (sa.errors.length > 0) {
      console.log(chalk.red("Snapshot errors:"));
    }

    sa.errors.forEach(e => {
      console.log(
        chalk.red(
          `• ${
            e.size
          } bytes is too large, consider breaking your tests into separate snapshot files`
        )
      );
    });

    let hasErrors = false;
    let hasWarnings = false;

    sa.lints.forEach(l => {
      if (l.error || l.errors.length > 0 || l.warnings.length > 0) {
        console.log(chalk.white(l.key));
      }

      if (l.error) {
        hasErrors = true;
        console.log(chalk.red(`Snapshot could not be parsed: ${l.error}`));
        return;
      }

      if (l.errors.length > 0) {
        hasErrors = true;
      }

      l.errors.sort(sortByType);

      l.errors.forEach(e => {
        if (e.type === "GENERIC_ATTR") {
          console.log(
            chalk.red(
              `Generic Attributes: ${e.elementName} has ${e.attributes}`
            )
          );
        }

        if (e.type === "GENERIC_VALUE") {
          console.log(
            chalk.red(`Generic Values: ${e.elementName} has ${e.values}`)
          );
        }

        if (e.type === "MAX_ATTR") {
          console.log(
            chalk.red(
              `Maximum Attributes: ${e.elementName} has ${e.count} attributes`
            )
          );
        }

        if (e.type === "MAX_ATTR_LENGTH") {
          console.log(
            chalk.red(
              `Maximum Attribute Length: ${e.elementName} ${
                e.attributeName
              } has a length of ${e.attributeLength}`
            )
          );
        }

        if (e.type === "MAX_DEPTH") {
          console.log(
            chalk.red(
              `Maximum Depth: ${e.leafElementName} has a depth of ${e.depth}`
            )
          );
        }

        if (e.type === "MAX_LINES") {
          console.log(
            chalk.red(
              `Maximum Lines: ${
                e.count
              } lines is too long, consider breaking this snapshot down`
            )
          );
        }
      });

      if (l.warnings.length > 0) {
        hasWarnings = true;
      }

      l.warnings.forEach(w => {
        console.log(
          chalk.yellow(
            `Max Generic Elements: Too many (${w.count}) generic elements (${
              w.elementName
            }) reduce the clarity of a snapshot`
          )
        );
      });
    });

    if (
      sa.errors.length === 0 &&
      sa.warnings.length === 0 &&
      !hasErrors &&
      !hasWarnings
    ) {
      console.log(chalk.green("No issues ✔️"));
    }
  });
};
