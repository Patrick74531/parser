import type { ParserError } from '../parser/errors';

const expectedInputLabels: Record<string, string> = {
  divide: '"/"',
  eq: '"="',
  lparen: '"("',
  minus: '"-"',
  neq: '"!="',
  number: 'a number',
  plus: '"+"',
  rparen: '")"',
  times: '"*"'
};

export function formatErrorLocation(error: ParserError): string {
  return error.line > 1 ? `Line ${error.line}, column ${error.column}` : `Column ${error.column}`;
}

export function formatExpectedInput(error: ParserError): string | null {
  if (!error.expected || error.expected.length === 0) {
    return null;
  }

  const readableExpected = error.expected.map((expected) => expectedInputLabels[expected] ?? expected);
  const uniqueExpected = Array.from(new Set(readableExpected));

  if (uniqueExpected.length === 1) {
    return uniqueExpected[0];
  }

  return `${uniqueExpected.slice(0, -1).join(', ')} or ${uniqueExpected.at(-1)}`;
}

export function getErrorGuidance(error: ParserError): string | null {
  if (error.message === 'Unsupported character "."') {
    return 'Decimal numbers are not supported. Use whole numbers only.';
  }

  if (error.message.startsWith('Unsupported character')) {
    return 'Use only numbers, +, -, *, /, =, !=, and parentheses.';
  }

  if (error.message === 'Unexpected end of input' && error.expected?.includes('rparen')) {
    return 'A closing parenthesis is likely missing.';
  }

  if (error.message === 'Unexpected end of input') {
    return 'The expression needs another value or closing parenthesis.';
  }

  if (error.expected?.includes('number') && error.expected.includes('lparen')) {
    return 'A number or grouped expression should appear here.';
  }

  if (error.expected?.includes('rparen')) {
    return 'A closing parenthesis should appear before this symbol.';
  }

  return null;
}
