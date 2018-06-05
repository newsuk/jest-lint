const acorn = require("acorn-jsx");
import { ParsedTest } from "./types";

const stripJestStructures = (s: string) =>
  s
    .replace(/Array\s\[/g, "[")
    .replace(/Object\s\{/g, "{")
    .replace(/>[\s]*{.*}[\s]*</gs, ">[Replaced Object]<");

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
    try {
      // confirm this is simply JSON that we don't care about
      JSON.parse(JSON.stringify(sanitised));

      return {
        key,
        rawValue: snapObj[key],
        value: null
      };
    } catch (e) {
      return {
        key,
        rawValue: snapObj[key],
        value: null,
        error: e.message
      };
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
