export type ArithmeticOperator = '+' | '-' | '*' | '/';
export type ComparisonOperator = '=' | '!=';

export type NumberLiteralNode = {
  type: 'NumberLiteral';
  value: number;
  raw: string;
};

export type BinaryExpressionNode = {
  type: 'BinaryExpression';
  operator: ArithmeticOperator;
  left: ArithmeticNode;
  right: ArithmeticNode;
};

export type ComparisonExpressionNode = {
  type: 'ComparisonExpression';
  operator: ComparisonOperator;
  left: ArithmeticNode;
  right: ArithmeticNode;
};

export type ArithmeticNode = NumberLiteralNode | BinaryExpressionNode;
export type ASTNode = ArithmeticNode | ComparisonExpressionNode;
