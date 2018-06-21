import {
  Criteria,
  FileError,
  FileWarning,
  Lint,
  Report,
  SnapshotAnalysis,
  TestAnalysis,
  TestError,
  TestWarn
} from "./types";

const reportOnTest = (criteria: Criteria) => (analysis: TestAnalysis): Lint => {
  const warnings: TestWarn[] = [];
  const errors: TestError[] = [];

  if (analysis.error) {
    return {
      key: analysis.key,
      warnings,
      errors,
      error: analysis.error
    };
  }

  if (criteria.maxLines && analysis.lines > criteria.maxLines) {
    errors.push({
      type: "MAX_LINES",
      count: analysis.lines
    });
  }

  const genericElements: { [key: string]: number } = {};
  analysis.elements.forEach(e => {
    const invalidProps: string[] = [];
    const invalidValues: Set<string> = new Set();

    e.props.forEach(p => {
      if (
        criteria.genericAttrs != null &&
        criteria.genericAttrs.includes(p.key)
      ) {
        invalidProps.push(p.key);
      }

      if (
        criteria.genericValues != null &&
        typeof p.value === "string" &&
        criteria.genericValues.includes(p.value)
      ) {
        invalidValues.add(p.value);
      }

      if (
        criteria.maxAttrArrayLength !== undefined &&
        p.type === "ArrayExpression" &&
        Array.isArray(p.value) &&
        p.value.length > criteria.maxAttrArrayLength
      ) {
        errors.push({
          type: "MAX_ATTR_ARR_LENGTH",
          elementName: e.elementName,
          attributeName: p.key,
          attributeLength: p.value.length
        });
      }

      if (
        criteria.maxAttrStringLength !== undefined &&
        typeof p.value === "string" &&
        p.value.length > criteria.maxAttrStringLength
      ) {
        errors.push({
          type: "MAX_ATTR_STR_LENGTH",
          elementName: e.elementName,
          attributeName: p.key,
          attributeLength: p.value.length
        });
      }
    });

    if (e.props.length === 0) {
      genericElements[e.elementName] = genericElements[e.elementName]
        ? genericElements[e.elementName] + 1
        : 1;
    }

    if (invalidProps.length > 0) {
      errors.push({
        type: "GENERIC_ATTR",
        elementName: e.elementName,
        attributes: invalidProps
      });
    }

    if (invalidValues.size > 0) {
      errors.push({
        type: "GENERIC_VALUE",
        elementName: e.elementName,
        values: [...invalidValues]
      });
    }

    if (criteria.maxAttr && e.props.length > criteria.maxAttr) {
      errors.push({
        type: "MAX_ATTR",
        elementName: e.elementName,
        count: e.props.length
      });
    }

    if (criteria.maxDepth && e.depth > criteria.maxDepth) {
      errors.push({
        type: "MAX_DEPTH",
        leafElementName: e.elementName,
        depth: e.depth
      });
    }
  });

  Object.keys(genericElements).forEach(k => {
    if (
      criteria.maxGenericElement &&
      genericElements[k] > criteria.maxGenericElement
    ) {
      warnings.push({
        type: "MAX_GENERIC_ELEMENT",
        elementName: k,
        count: genericElements[k]
      });
    }
  });

  if (analysis.elements.length === 0) {
    warnings.push({
      type: "NO_ELEMENTS_FOUND"
    });
  }

  return {
    key: analysis.key,
    warnings,
    errors
  };
};

export default (criteria: Criteria) => (analysis: SnapshotAnalysis): Report => {
  const warnings: FileWarning[] = [];
  const errors: FileError[] = [];

  if (criteria.maxFileSize && criteria.maxFileSize < analysis.fileSize) {
    errors.push({
      type: "MAX_FILE_SIZE",
      size: analysis.fileSize
    });
  }

  return {
    path: analysis.path,
    warnings,
    errors,
    lints: analysis.analyses.map(reportOnTest(criteria))
  };
};
