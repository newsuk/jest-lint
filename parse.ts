const acorn = require("acorn-jsx");
import { ParsedTest } from "./types";

const stripStyleBlock = (s: string) => s.replace(/<style>.*<\/style>/gs, "");

const stripJestStructures = (s: string) =>
  s
    .replace(/Array\s\[/g, "[")
    .replace(/Object\s\{/g, "{")
    .replace(/>[\s]*{.*}[\s]*</gs, ">[Replaced Object]<");

const stripStyledComponentStyles = (s: string) =>
  s.replace(/\.c\d {.*}\s*(?=<|Array \[)/gs, "");

const tryJson = (key: string, rawValue: string, value: string) => {
  try {
    // confirm this is simply JSON that we don't care about
    JSON.parse(JSON.stringify(value));

    return {
      key,
      rawValue,
      value: null
    };
  } catch (e) {
    return {
      key,
      rawValue,
      value: null,
      error: e.message
    };
  }
};

const parseVal = (snapObj: { [key: string]: string }) => (
  key: string
): ParsedTest => {
  let value;
  const sanitised = stripStyleBlock(stripJestStructures(snapObj[key]));

  try {
    value = acorn.parse(sanitised, {
      plugins: { jsx: true }
    });
  } catch (e) {
    // pending outcome of https://github.com/styled-components/jest-styled-components/issues/135
    const styledComponentsStyleRegex = /\.c\d {.*}\s*(?=<|Array \[)/gs;
    const noStyleBlock = stripStyleBlock(snapObj[key]);
    const hasStyledComponentStyles = styledComponentsStyleRegex.test(
      noStyleBlock
    );

    if (hasStyledComponentStyles) {
      try {
        value = acorn.parse(
          stripJestStructures(stripStyledComponentStyles(noStyleBlock)),
          {
            plugins: { jsx: true }
          }
        );
      } catch (e) {}
    }

    if (!value) {
      return tryJson(key, snapObj[key], sanitised);
    }
  }

  return {
    key,
    rawValue: snapObj[key],
    value
  };
};

export default (snapContents: string): ParsedTest[] => {
  const evil = new Function("exports", snapContents);
  const snapObj = {};

  evil(snapObj);

  return Object.keys(snapObj).map(parseVal(snapObj));
};
