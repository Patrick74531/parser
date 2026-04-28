import { describe, expect, it } from 'vitest';
import { LexerError, dumpTokens, tokenize } from '../parser/lexer';

function compactTokens(input: string) {
  return tokenize(input).map((token) => ({
    type: token.type,
    value: token.value
  }));
}

describe('lexer', () => {
  it('produces equivalent meaningful tokens with or without spaces', () => {
    expect(compactTokens('1+2=3')).toEqual(compactTokens('1 + 2 = 3'));
  });

  it('tokenizes comparison and arithmetic operators', () => {
    const tokens = compactTokens('12 + 3 != 4 / 2 + 5');
    const neqTokens = tokens.filter((token) => token.type === 'neq');

    expect(neqTokens).toEqual([{ type: 'neq', value: '!=' }]);
    expect(tokens).toEqual([
      { type: 'number', value: '12' },
      { type: 'plus', value: '+' },
      { type: 'number', value: '3' },
      { type: 'neq', value: '!=' },
      { type: 'number', value: '4' },
      { type: 'divide', value: '/' },
      { type: 'number', value: '2' },
      { type: 'plus', value: '+' },
      { type: 'number', value: '5' }
    ]);
  });

  it('includes parenthesis tokens with source positions', () => {
    const tokens = tokenize('2 * (3 + 4) = 10');
    const leftParen = tokens.find((token) => token.type === 'lparen');
    const rightParen = tokens.find((token) => token.type === 'rparen');

    expect(leftParen).toMatchObject({
      type: 'lparen',
      value: '(',
      offset: 4,
      line: 1,
      col: 5
    });
    expect(rightParen).toMatchObject({
      type: 'rparen',
      value: ')',
      offset: 10,
      line: 1,
      col: 11
    });
  });

  it('throws a structured error for unsupported characters', () => {
    expect(() => tokenize('1 + 2 @ 3')).toThrow(LexerError);

    try {
      tokenize('1 + 2 @ 3');
    } catch (error) {
      expect(error).toMatchObject({
        name: 'LexerError',
        index: 6,
        line: 1,
        column: 7,
        value: '@'
      });
    }
  });

  it('preserves token positions after newline whitespace', () => {
    const tokens = tokenize('1 +\n  2');

    expect(tokens.at(-1)).toMatchObject({
      type: 'number',
      value: '2',
      offset: 6,
      line: 2,
      col: 3
    });
  });

  it('returns token dump rows without changing tokenization behavior', () => {
    expect(dumpTokens('1 + 2')).toEqual([
      { type: 'number', value: '1', offset: 0, line: 1, column: 1 },
      { type: 'plus', value: '+', offset: 2, line: 1, column: 3 },
      { type: 'number', value: '2', offset: 4, line: 1, column: 5 }
    ]);
  });
});
