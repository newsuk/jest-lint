const acorn = require("acorn-jsx");
import { ParsedTest } from "./types";

const stripJestStructures = (s: string) =>
  s
    .replace(/Array\s\[/g, "[")
    .replace(/Object\s\{/g, "{")
    .replace(/>[\s]*{.*}[\s]*</gs, ">[Replaced Object]<")
    .replace(/<style>.*<\/style>/gs, "");

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
  const sanitised = stripJestStructures(snapObj[key]);

  try {
    value = acorn.parse(sanitised, {
      plugins: { jsx: true }
    });
  } catch (e) {
    // pending outcome of https://github.com/styled-components/jest-styled-components/issues/135
    const noStyledComponentStyles = sanitised
      .slice(sanitised.indexOf("<"))
      .trim();

    if (noStyledComponentStyles.length > 0) {
      try {
        value = acorn.parse(noStyledComponentStyles, {
          plugins: { jsx: true }
        });
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
