import test from "ava";
import analyse from "./analyse";
import report from "./report";
import * as path from "path";
import { SnapshotAnalysis } from "./types";

let analysis: SnapshotAnalysis;

const simpleKey = "1. snapshot for simple-rn-component 1";
const listKey = "2. snapshot for list-rn-component 1";
const primitivesKey = "0. snapshot for primitives 1";
const lengthKey = "6. snapshot for length-tests 1";
const hugeKey = "8. snapshot for huge-style 1";

test.before(async () => {
  analysis = await analyse(
    path.join(process.cwd(), "__snapshots__/generate-snapshots.js.snap")
  );
});

test("should return no errors or warnings with no criteria", t => {
  const criteria = {};

  const result = report(criteria)(analysis);

  t.snapshot(result);
});

test("should return no errors for an acceptable file size", t => {
  const criteria = {
    maxFileSize: 8000
  };

  const result = report(criteria)(analysis);

  t.snapshot(result.errors);
});

test("should return an error for an unacceptable file size", t => {
  const criteria = {
    maxFileSize: 2000
  };

  const result = report(criteria)(analysis);

  t.snapshot(result.errors);
});

test(`should return no errors for a "good" snapshot`, t => {
  const criteria = {
    genericAttrs: ["initialNumToRender", "onContentSizeChange"],
    genericValues: ["[Function]"],
    maxAttr: 10,
    maxAttrLength: 200,
    maxDepth: 8,
    maxLines: 20
  };

  const result = report(criteria)(analysis);

  const simpleComponentLints = result.lints.find(
    ({ key }) => key === simpleKey
  );

  t.snapshot(simpleComponentLints);
});

test("should return the generic attribute error", t => {
  const criteria = {
    genericAttrs: ["initialNumToRender", "onContentSizeChange"]
  };

  const result = report(criteria)(analysis);

  const listComponentLints = result.lints.find(({ key }) => key === listKey);

  t.snapshot(listComponentLints);
});

test("should return the generic value error", t => {
  const criteria = {
    genericValues: ["[Function]"]
  };

  const result = report(criteria)(analysis);

  const listComponentLints = result.lints.find(({ key }) => key === listKey);

  t.snapshot(listComponentLints);
});

test("should return the max attribute error", t => {
  const criteria = {
    maxAttr: 2
  };

  const result = report(criteria)(analysis);

  const simpleComponentLints = result.lints.find(
    ({ key }) => key === simpleKey
  );

  t.snapshot(simpleComponentLints);
});

test("should return the max attribute length error for a string", t => {
  const criteria = {
    maxAttrStringLength: 20
  };

  const result = report(criteria)(analysis);

  const lengthComponentLints = result.lints.find(
    ({ key }) => key === lengthKey
  );

  t.snapshot(lengthComponentLints);
});

test("should return the max attribute length error for an array", t => {
  const criteria = {
    maxAttrArrayLength: 3
  };

  const result = report(criteria)(analysis);

  const lengthComponentLints = result.lints.find(
    ({ key }) => key === lengthKey
  );

  t.snapshot(lengthComponentLints);
});

test("should not return the max attribute length error for an object", t => {
  const criteria = {
    maxAttrStringLength: 20,
    maxAttrArrayLength: 3
  };

  const result = report(criteria)(analysis);

  const hugeStyleLints = result.lints.find(({ key }) => key === hugeKey);

  t.snapshot(hugeStyleLints);
});

test("should return the max depth error", t => {
  const criteria = {
    maxDepth: 4
  };

  const result = report(criteria)(analysis);

  const listComponentLints = result.lints.find(({ key }) => key === listKey);

  t.snapshot(listComponentLints);
});

test("should return the max lines error", t => {
  const criteria = {
    maxLines: 10
  };

  const result = report(criteria)(analysis);

  const simpleComponentLints = result.lints.find(
    ({ key }) => key === simpleKey
  );

  t.snapshot(simpleComponentLints);
});

test("should return the max generic element warning", t => {
  const criteria = {
    maxGenericElement: 2
  };

  const result = report(criteria)(analysis);

  const listComponentLints = result.lints.find(({ key }) => key === listKey);

  t.snapshot(listComponentLints);
});

test("should return the no elements found warning", t => {
  const criteria = {};

  const result = report(criteria)(analysis);

  const primitivesLints = result.lints.find(({ key }) => key === primitivesKey);

  t.snapshot(primitivesLints);
});
