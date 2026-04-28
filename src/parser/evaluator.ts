import type {
  ASTNode,
  ArithmeticNode,
  BinaryExpressionNode,
  ComparisonExpressionNode
} from './ast';

export type EvaluationResult = number | boolean;

export function evaluate(ast: ASTNode): EvaluationResult {
  switch (ast.type) {
    case 'NumberLiteral':
    case 'BinaryExpression':
      return evaluateArithmetic(ast);
    case 'ComparisonExpression':
      return evaluateComparison(ast);
    default:
      return assertNever(ast);
  }
}

export function evaluateArithmetic(node: ArithmeticNode): number {
  switch (node.type) {
    case 'NumberLiteral':
      return node.value;
    case 'BinaryExpression':
      return evaluateBinaryExpression(node);
    default:
      return assertNever(node);
  }
}

function evaluateBinaryExpression(node: BinaryExpressionNode): number {
  const left = evaluateArithmetic(node.left);
  const right = evaluateArithmetic(node.right);

  switch (node.operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return left / right;
    default:
      return assertNever(node.operator);
  }
}

function evaluateComparison(node: ComparisonExpressionNode): boolean {
  const left = evaluateArithmetic(node.left);
  const right = evaluateArithmetic(node.right);

  switch (node.operator) {
    case '=':
      return left === right;
    case '!=':
      return left !== right;
    default:
      return assertNever(node.operator);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled evaluator value: ${JSON.stringify(value)}`);
}
