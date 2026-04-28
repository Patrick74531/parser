import { describe, expect, it } from 'vitest';
import { parse } from '../parser/parser';

describe('parser API', () => {
  it.each([
    ['1 + 2 = 3', true],
    ['2 * 3 + 4 = 10', true],
    ['2 * (3 + 4) = 10', false],
    ['6 = 10 / 2 + 1', true],
    ['12 + 3 != 4 / 2 + 5', true],
    ['2 + 3 * 2 = 10', false],
    ['2 * 3 + 4 != 10', false]
  ])('returns AST and boolean result for %s', (input, expected) => {
    const result = parse(input);

    expect(result).toMatchObject({
      ok: true,
      input,
      result: expected
    });

    if (result.ok) {
      expect(result.ast.type).toBe('ComparisonExpression');
    }
  });

  it('returns AST without boolean result for arithmetic-only input', () => {
    const result = parse('1 + 2 * 3');

    expect(result).toMatchObject({
      ok: true,
      input: '1 + 2 * 3',
      ast: {
        type: 'BinaryExpression',
        operator: '+'
      }
    });

    if (result.ok) {
      expect(result.result).toBeUndefined();
    }
  });

  it('returns a friendly syntax error with token location', () => {
    const result = parse('1 + (2 = 3');

    expect(result).toMatchObject({
      ok: false,
      input: '1 + (2 = 3',
      error: {
        message: 'Unexpected token "="',
        index: 7,
        line: 1,
        column: 8
      }
    });

    if (!result.ok) {
      expect(result.error.expected).toContain('rparen');
    }
  });

  it('returns a friendly lexer error with character location', () => {
    const result = parse('1 + 2 @ 3');

    expect(result).toMatchObject({
      ok: false,
      input: '1 + 2 @ 3',
      error: {
        message: 'Unsupported character "@"',
        index: 6,
        line: 1,
        column: 7
      }
    });
  });

  it('uses the input length for unexpected end-of-input', () => {
    const input = '1 +';
    const result = parse(input);

    expect(result).toMatchObject({
      ok: false,
      input,
      error: {
        message: 'Unexpected end of input',
        index: input.length,
        line: 1,
        column: 4
      }
    });
  });

  it('reports line and column after newline whitespace', () => {
    const result = parse('1 +\n@');

    expect(result).toMatchObject({
      ok: false,
      error: {
        message: 'Unsupported character "@"',
        index: 4,
        line: 2,
        column: 1
      }
    });
  });
});
