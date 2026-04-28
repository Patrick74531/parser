import { describe, expect, it } from 'vitest';
import type { ParserError } from '../parser/errors';
import { buildErrorHighlight } from '../ui/errorHighlight';

function parserError(overrides: Partial<ParserError>): ParserError {
  return {
    message: 'Invalid expression',
    explanation: 'Invalid expression.',
    index: 0,
    line: 1,
    column: 1,
    ...overrides
  };
}

describe('error highlight helper', () => {
  it('marks the invalid character on the failing line', () => {
    const highlight = buildErrorHighlight(
      '1 + 2 @ 3',
      parserError({
        index: 6,
        line: 1,
        column: 7
      })
    );

    expect(highlight).toEqual({
      lineNumber: 1,
      columnNumber: 7,
      before: '1 + 2 ',
      marker: '@',
      after: ' 3',
      isEndOfInput: false
    });
  });

  it('uses an end-of-input caret when the parser needs more input', () => {
    const highlight = buildErrorHighlight(
      '1 +',
      parserError({
        message: 'Unexpected end of input',
        index: 3,
        line: 1,
        column: 4
      })
    );

    expect(highlight).toEqual({
      lineNumber: 1,
      columnNumber: 4,
      before: '1 +',
      marker: '',
      after: '',
      isEndOfInput: true
    });
  });

  it('marks the full token when the error message includes one', () => {
    const highlight = buildErrorHighlight(
      '1 23',
      parserError({
        message: 'Unexpected token "23"',
        index: 2,
        line: 1,
        column: 3
      })
    );

    expect(highlight).toMatchObject({
      before: '1 ',
      marker: '23',
      after: ''
    });
  });

  it('handles errors after newline whitespace', () => {
    const highlight = buildErrorHighlight(
      '1 +\n@',
      parserError({
        index: 4,
        line: 2,
        column: 1
      })
    );

    expect(highlight).toMatchObject({
      lineNumber: 2,
      columnNumber: 1,
      before: '',
      marker: '@',
      after: ''
    });
  });
});
