import { describe, expect, it } from 'vitest';
import { createNearleyParser, parse, parseAst } from '../parser/parser';

describe('grammar build', () => {
  it('creates a Nearley parser from the generated grammar', () => {
    const parser = createNearleyParser();

    expect(parser.current).toBe(0);
    expect(parser.grammar.start).toBe('main');
    expect(typeof parser.feed).toBe('function');
  });

  it('parses a simple number through the generated Moo-backed grammar', () => {
    const parser = createNearleyParser();

    parser.feed('42');

    expect(parser.results).toEqual([
      {
        type: 'NumberLiteral',
        value: 42,
        raw: '42'
      }
    ]);
  });

  it('keeps parser consumers on parser module exports', () => {
    expect(typeof createNearleyParser).toBe('function');
    expect(typeof parseAst).toBe('function');
    expect(typeof parse).toBe('function');
  });

  it('builds a comparison AST', () => {
    expect(parseAst('1 + 2 = 3')).toEqual({
      type: 'ComparisonExpression',
      operator: '=',
      left: {
        type: 'BinaryExpression',
        operator: '+',
        left: { type: 'NumberLiteral', value: 1, raw: '1' },
        right: { type: 'NumberLiteral', value: 2, raw: '2' }
      },
      right: { type: 'NumberLiteral', value: 3, raw: '3' }
    });
  });

  it('keeps multiplication below addition for precedence', () => {
    const ast = parseAst('2 + 3 * 2 = 10');

    expect(ast).toMatchObject({
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
    });
  });

  it('preserves parenthesized addition under multiplication', () => {
    const ast = parseAst('2 * (3 + 4) = 10');

    expect(ast).toMatchObject({
      type: 'ComparisonExpression',
      left: {
        type: 'BinaryExpression',
        operator: '*',
        left: { type: 'NumberLiteral', value: 2, raw: '2' },
        right: {
          type: 'BinaryExpression',
          operator: '+',
          left: { type: 'NumberLiteral', value: 3, raw: '3' },
          right: { type: 'NumberLiteral', value: 4, raw: '4' }
        }
      }
    });
  });

  it('builds not-equals comparison ASTs', () => {
    expect(parseAst('12 + 3 != 4 / 2 + 5')).toMatchObject({
      type: 'ComparisonExpression',
      operator: '!=',
      left: {
        type: 'BinaryExpression',
        operator: '+'
      },
      right: {
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'BinaryExpression',
          operator: '/'
        }
      }
    });
  });

  it('allows arithmetic-only input', () => {
    expect(parseAst('1 + 2 * 3')).toMatchObject({
      type: 'BinaryExpression',
      operator: '+',
      right: {
        type: 'BinaryExpression',
        operator: '*'
      }
    });
  });
});
