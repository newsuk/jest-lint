const acorn = require("acorn-jsx");
import { ParsedTest } from "./types";

const stripJestStructures = (s: string) =>
  s.replace(/Array\s\[/g, "[").replace(/Object\s\{/g, "{");

const parseVal = (snapObj: { [key: string]: string }) => (
  key: string
): ParsedTest => {
  let value;

  try {
    value = acorn.parse(stripJestStructures(snapObj[key]), {
      plugins: { jsx: true }
    });
  } catch (e) {
    return {
      key,
      rawValue: snapObj[key],
      value: null,
      error: e.message
    };
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
