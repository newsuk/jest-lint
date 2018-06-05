declare module "acorn-jsx" {
  type JSXPlugin =
    | boolean
    | {
        allowNamespacedObjects?: boolean;
        allowNamespaces?: boolean;
      };

  type Options = {
    plugins: {
      jsx: JSXPlugin;
    };
  };

  type JSXIdentifier = {
    type: "JSXIdentifier";
    start: number;
    end: number;
    name: string;
  };

  type JSXExpressionContainer = {
    type: "JSXExpressionContainer";
    start: number;
    end: number;
    expression: ArrayExpression | JSXElement | Literal | ObjectExpression;
  };

  type Identifier = {
    type: "Identifier";
    start: number;
    end: number;
    name: string;
  };

  type Literal = {
    type: "Literal";
    start: number;
    end: number;
    value: string | boolean | number;
    raw: string;
  };

  type Property = {
    type: "Property";
    start: number;
    end: number;
    method: boolean;
    shorthand: boolean;
    computed: boolean;
    key: Literal;
    value: Literal;
    kind: "init";
  };

  type ObjectExpression = {
    type: "ObjectExpression";
    start: number;
    end: number;
    properties: Property[];
  };

  type UnaryExpression = {
    type: "UnaryExpression";
    start: number;
    end: number;
    operator: "-" | "+";
    prefix: boolean;
    argument: Literal;
  };

  type ArrayElement = Identifier | Literal | ObjectExpression | UnaryExpression;

  type ArrayExpression = {
    type: "ArrayExpression";
    start: number;
    end: number;
    elements: ArrayElement[];
  };

  type JSXAttribute = {
    type: "JSXAttribute";
    start: number;
    end: number;
    name: JSXIdentifier;
    value: JSXExpressionContainer | Literal;
  };

  type JSXOpeningElement = {
    type: "JSXOpeningElement";
    start: number;
    end: number;
    attributes: JSXAttribute[];
    name: JSXIdentifier;
    selfClosing: false;
  };

  type JSXClosingElement = {
    type: "JSXClosingElement";
    start: number;
    end: number;
    name: JSXIdentifier;
  };

  type JSXElement = {
    type: "JSXElement";
    start: number;
    end: number;
    openingElement: JSXOpeningElement;
    closingElement: JSXClosingElement;
    children: Node[];
  };

  type JSXText = {
    type: "JSXText";
    start: number;
    end: number;
    value: string;
    raw: string;
  };

  type Node = JSXElement | JSXText;

  type ExpressionStatement = {
    type: "ExpressionStatement";
    start: number;
    end: number;
    expression: JSXElement;
  };

  export type AST = {
    type: "Program";
    start: number;
    end: number;
    body: ExpressionStatement[];
    sourceType: "script";
  };

  export function parse(input: string, options: Options): AST;
}
