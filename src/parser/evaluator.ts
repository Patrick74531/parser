import type {
  ASTNode,
  ArithmeticNode,
  BinaryExpressionNode,
  ComparisonExpressionNode
} from './ast';
import { DEBUG_PARSER } from './debug';

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
      traceEvaluation(node.type, undefined, undefined, node.value);
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
      return traceEvaluation(node.type, node.operator, [left, right], left + right);
    case '-':
      return traceEvaluation(node.type, node.operator, [left, right], left - right);
    case '*':
      return traceEvaluation(node.type, node.operator, [left, right], left * right);
    case '/':
      return traceEvaluation(node.type, node.operator, [left, right], left / right);
    default:
      return assertNever(node.operator);
  }
}

function evaluateComparison(node: ComparisonExpressionNode): boolean {
  const left = evaluateArithmetic(node.left);
  const right = evaluateArithmetic(node.right);

  switch (node.operator) {
    case '=':
      return traceEvaluation(node.type, node.operator, [left, right], left === right);
    case '!=':
      return traceEvaluation(node.type, node.operator, [left, right], left !== right);
    default:
      return assertNever(node.operator);
  }
}

function traceEvaluation<T extends EvaluationResult>(
  nodeType: ASTNode['type'],
  operator: string | undefined,
  operands: readonly number[] | undefined,
  result: T
): T {
  if (DEBUG_PARSER) {
    console.debug('Evaluator trace:', {
      nodeType,
      operator,
      operands,
      result
    });
  }

  return result;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled evaluator value: ${JSON.stringify(value)}`);
}
