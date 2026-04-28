import { describe, expect, it } from 'vitest';
import type { ParserError } from '../parser/errors';
import { formatErrorLocation, formatExpectedInput, getErrorGuidance } from '../ui/errorDetails';

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

describe('error display details', () => {
  it('uses only the column for single-line errors', () => {
    expect(formatErrorLocation(parserError({ column: 7 }))).toBe('Column 7');
  });

  it('includes the line for multi-line errors', () => {
    expect(formatErrorLocation(parserError({ line: 2, column: 3 }))).toBe('Line 2, column 3');
  });

  it('keeps guidance conservative and tied to parser data', () => {
    expect(getErrorGuidance(parserError({ message: 'Unsupported character "@"' }))).toBe(
      'Use only numbers, +, -, *, /, =, !=, and parentheses.'
    );
  });

  it('explains decimal input without expanding the supported syntax', () => {
    expect(getErrorGuidance(parserError({ message: 'Unsupported character "."' }))).toBe(
      'Decimal numbers are not supported. Use whole numbers only.'
    );
  });

  it('formats expected parser tokens for end users', () => {
    expect(formatExpectedInput(parserError({ expected: ['number', 'lparen'] }))).toBe(
      'a number or "("'
    );
  });

  it('omits expected input when the parser did not provide it', () => {
    expect(formatExpectedInput(parserError({ expected: undefined }))).toBeNull();
  });
});
