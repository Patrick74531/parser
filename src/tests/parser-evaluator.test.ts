import { describe, expect, it } from 'vitest';
import { parse } from '../parser/parser';

function expectComparisonResult(input: string, expected: boolean) {
  const result = parse(input);

  expect(result).toMatchObject({
    ok: true,
    input,
    result: expected,
    ast: {
      type: 'ComparisonExpression'
    }
  });
}

function expectInvalidLocation(
  input: string,
  expected: { message: string; index: number; line: number; column: number }
) {
  const result = parse(input);

  expect(result).toMatchObject({
    ok: false,
    input,
    error: expected
  });

  if (!result.ok) {
    expect(result.error.explanation.length).toBeGreaterThan(0);
  }
}

describe('parser and evaluator integration', () => {
  it.each([
    ['1 + 2 = 3', true],
    ['2 * 3 + 4 = 10', true],
    ['2 * (3 + 4) = 10', false],
    ['6 = 10 / 2 + 1', true],
    ['12 + 3 != 4 / 2 + 5', true],
    ['2 + 3 * 2 = 10', false],
    ['2 * 3 + 4 != 10', false]
  ])('matches assignment example %s', (input, expected) => {
    expectComparisonResult(input, expected);
  });

  it('reports the invalid assignment example location', () => {
    expectInvalidLocation('1 + (2 = 3', {
      message: 'Unexpected token "="',
      index: 7,
      line: 1,
      column: 8
    });
  });

  it.each([
    ['1+2=3', true],
    ['(1 + 2) * 3 = 9', true],
    ['10 / 2 != 6', true]
  ])('matches additional valid case %s', (input, expected) => {
    expectComparisonResult(input, expected);
  });

  it('reports useful syntax error location for an operator in the wrong position', () => {
    expectInvalidLocation('1 + * 2', {
      message: 'Unexpected token "*"',
      index: 4,
      line: 1,
      column: 5
    });
  });

  it('reports unsupported character location exactly', () => {
    expectInvalidLocation('1 + 2 @ 3', {
      message: 'Unsupported character "@"',
      index: 6,
      line: 1,
      column: 7
    });
  });

  it('keeps multiplication below addition in the AST', () => {
    const result = parse('2 + 3 * 2 = 10');

    expect(result).toMatchObject({
      ok: true,
      ast: {
        type: 'ComparisonExpression',
        left: {
          type: 'BinaryExpression',
          operator: '+',
          right: {
            type: 'BinaryExpression',
            operator: '*',
            left: { type: 'NumberLiteral', value: 3, raw: '3' },
            right: { type: 'NumberLiteral', value: 2, raw: '2' }
          }
        }
      }
    });
  });

  it('preserves parenthesized addition under multiplication in the AST', () => {
    const result = parse('2 * (3 + 4) = 10');

    expect(result).toMatchObject({
      ok: true,
      ast: {
        type: 'ComparisonExpression',
        left: {
          type: 'BinaryExpression',
          operator: '*',
          right: {
            type: 'BinaryExpression',
            operator: '+',
            left: { type: 'NumberLiteral', value: 3, raw: '3' },
            right: { type: 'NumberLiteral', value: 4, raw: '4' }
          }
        }
      }
    });
  });

  it('uses the parenthesized group before multiplication', () => {
    const result = parse('(1 + 2) * 3 = 9');

    expect(result).toMatchObject({
      ok: true,
      result: true,
      ast: {
        type: 'ComparisonExpression',
        left: {
          type: 'BinaryExpression',
          operator: '*',
          left: {
            type: 'BinaryExpression',
            operator: '+'
          },
          right: { type: 'NumberLiteral', value: 3, raw: '3' }
        }
      }
    });
  });
});
