import { AST } from "acorn-jsx";

export interface Options {
  snapPattern?: string;
  maxFileSize?: number;
  genericAttributes?: string[];
  genericValues?: string[];
  maxAttributes?: number;
  maxAttributeLength?: number;
  maxDepth?: number;
  maxLines?: number;
  maxGenericElements?: number;
  isVerbose: boolean;
}

export type Dir = string;

export type FilePath = string;

export type ParsedTest = {
  key: string;
  rawValue: string;
  value: AST | null;
  error?: string;
};

export type GenericAttributeError = {
  type: "GENERIC_ATTR";
  elementName: string;
  attributes: string[];
};

export type GenericValueError = {
  type: "GENERIC_VALUE";
  elementName: string;
  values: string[];
};

export type MaxAttributeError = {
  type: "MAX_ATTR";
  elementName: string;
  count: number;
};

export type MaxAttrLengthError = {
  type: "MAX_ATTR_LENGTH";
  elementName: string;
  attributeName: string;
  attributeLength: number;
};

export type MaxDepthError = {
  type: "MAX_DEPTH";
  leafElementName: string;
  depth: number;
};

export type MaxLinesError = {
  type: "MAX_LINES";
  count: number;
};

export type TestError =
  | GenericAttributeError
  | GenericValueError
  | MaxAttributeError
  | MaxAttrLengthError
  | MaxDepthError
  | MaxLinesError;

export type MaxGenericElementWarning = {
  type: "MAX_GENERIC_ELEMENT";
  elementName: string;
  count: number;
};

export type TestWarn = MaxGenericElementWarning;

export type Prop = {
  key: string;
  value: Object;
};

export type Element = {
  elementName: string;
  props: Prop[];
  depth: number;
};

export type TestAnalysis = {
  key: string;
  lines: number;
  elements: Element[];
  error?: string;
};

export type SnapshotAnalysis = {
  path: FilePath;
  fileSize: number;
  analyses: TestAnalysis[];
};

export type Criteria = {
  genericAttrs?: string[];
  genericValues?: string[];
  maxAttr?: number;
  maxAttrLength?: number;
  maxDepth?: number;
  maxFileSize?: number;
  maxGenericElement?: number;
  maxLines?: number;
};

export type Lint = {
  key: string;
  warnings: TestWarn[];
  errors: TestError[];
  error?: string;
};

export type FileWarning = Object;

export type MaxFileSizeError = {
  type: "MAX_FILE_SIZE";
  size: number;
};

export type FileError = MaxFileSizeError;

export type Report = {
  path: FilePath;
  warnings: FileWarning[];
  errors: FileError[];
  lints: Lint[];
};
