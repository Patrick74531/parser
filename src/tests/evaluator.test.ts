import { describe, expect, it } from 'vitest';
import type { ArithmeticNode, ASTNode } from '../parser/ast';
import { evaluate, evaluateArithmetic } from '../parser/evaluator';
import { parseAst } from '../parser/parser';

const one: ArithmeticNode = { type: 'NumberLiteral', value: 1, raw: '1' };
const two: ArithmeticNode = { type: 'NumberLiteral', value: 2, raw: '2' };
const three: ArithmeticNode = { type: 'NumberLiteral', value: 3, raw: '3' };
const six: ArithmeticNode = { type: 'NumberLiteral', value: 6, raw: '6' };

function binary(
  operator: '+' | '-' | '*' | '/',
  left: ArithmeticNode,
  right: ArithmeticNode
): ArithmeticNode {
  return {
    type: 'BinaryExpression',
    operator,
    left,
    right
  };
}

function comparison(operator: '=' | '!=', left: ArithmeticNode, right: ArithmeticNode): ASTNode {
  return {
    type: 'ComparisonExpression',
    operator,
    left,
    right
  };
}

describe('evaluator', () => {
  it('evaluates number literals', () => {
    expect(evaluate(one)).toBe(1);
    expect(evaluateArithmetic(two)).toBe(2);
  });

  it('evaluates arithmetic operators', () => {
    expect(evaluate(binary('+', one, two))).toBe(3);
    expect(evaluate(binary('-', three, two))).toBe(1);
    expect(evaluate(binary('*', two, three))).toBe(6);
    expect(evaluate(binary('/', six, three))).toBe(2);
  });

  it('evaluates equality comparisons', () => {
    expect(evaluate(comparison('=', binary('+', one, two), three))).toBe(true);
    expect(evaluate(comparison('=', one, two))).toBe(false);
  });

  it('evaluates not-equals comparisons', () => {
    expect(evaluate(comparison('!=', one, two))).toBe(true);
    expect(evaluate(comparison('!=', binary('+', one, two), three))).toBe(false);
  });

  it.each([
    ['1 + 2 = 3', true],
    ['2 * 3 + 4 = 10', true],
    ['2 * (3 + 4) = 10', false],
    ['6 = 10 / 2 + 1', true],
    ['12 + 3 != 4 / 2 + 5', true],
    ['2 + 3 * 2 = 10', false],
    ['2 * 3 + 4 != 10', false]
  ])('evaluates parsed expression %s', (input, expected) => {
    expect(evaluate(parseAst(input))).toBe(expected);
  });
});
