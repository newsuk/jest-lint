import {
  Element,
  FilePath,
  ParsedTest,
  Prop,
  SnapshotAnalysis,
  TestAnalysis
} from "./types";
import { ArrayElement, JSXAttribute, JSXElement, Property } from "acorn-jsx";
import { readFile, stat } from "fs-extra";
import * as path from "path";
import parse from "./parse";

const sanitiseValue = (v: Object) => {
  if (Array.isArray(v) && v.length === 1 && v[0] === "Function") {
    return "[Function]";
  }

  return v;
};

const extractProp = (prop: Property) => ({
  key: prop.key.value,
  value: sanitiseValue(prop.value.value)
});

const extractElement = (depth: number) => (element: ArrayElement) => {
  if (element.type === "Identifier") {
    return element.name;
  } else if (element.type === "Literal") {
    return element.value;
  } else if (element.type === "UnaryExpression") {
    return element.argument.value;
  } else if (element.type === "JSXElement") {
    return traverse(depth + 1)(element);
  }

  return element.properties.map(extractProp);
};

const extractProps = (depth: number) => ({
  name,
  value
}: JSXAttribute): Prop => {
  let type;
  let propValue;

  if (value.type === "Literal") {
    type = value.type;
    propValue = value.value;
  } else if (value.expression.type === "Literal") {
    type = value.expression.type;
    propValue = value.expression.value;
  } else if (value.expression.type === "ObjectExpression") {
    type = value.expression.type;
    propValue = value.expression.properties.map(extractProp);
  } else if (value.expression.type === "ArrayExpression") {
    type = value.expression.type;
    propValue = value.expression.elements.map(extractElement(depth));
  } else if (value.expression.type === "Identifier") {
    type = value.expression.type;
    propValue = value.expression.name;
  } else if (value.expression.type === "UnaryExpression") {
    type = value.expression.type;
    propValue = value.expression.operator;
  } else {
    return {
      key: name.name,
      type: value.expression.type,
      value: traverse(depth + 1)(value.expression)
    };
  }

  return {
    key: name.name,
    type,
    value: sanitiseValue(propValue)
  };
};

const flatten = (depth: number) => (ys: Element[], y: JSXElement) => {
  return [...ys, ...traverse(depth)(y)];
};

const traverse = (depth: number) => (x: JSXElement): Element[] => {
  const oe = x.openingElement;

  const elementName = oe.name.name;
  const props = oe.attributes.map(extractProps(depth));

  return [
    {
      elementName,
      props,
      depth
    },
    ...x.children
      .filter(c => c.type === "JSXElement")
      .reduce(flatten(depth + 1), [])
  ];
};

const analyseSnapshot = (snapshot: ParsedTest): TestAnalysis => {
  const snapshotLength =
    snapshot.rawValue.length - snapshot.rawValue.replace(/\n/g, "").length + 1;

  if (snapshot.error) {
    return {
      key: snapshot.key,
      lines: snapshotLength,
      elements: [],
      error: snapshot.error
    };
  }

  if (!snapshot.value) {
    return {
      key: snapshot.key,
      lines: snapshotLength,
      elements: []
    };
  }

  const [{ expression }] = snapshot.value.body;

  if (expression.type !== "JSXElement") {
    return {
      key: snapshot.key,
      lines: snapshotLength,
      elements: []
    };
  }

  return {
    key: snapshot.key,
    lines: snapshotLength,
    elements: traverse(0)(expression)
  };
};

export default async (snapshotPath: FilePath): Promise<SnapshotAnalysis> => ({
  path: path.parse(snapshotPath).base,
  fileSize: (await stat(snapshotPath)).size,
  analyses: parse(await readFile(snapshotPath, "utf8")).map(analyseSnapshot)
});
