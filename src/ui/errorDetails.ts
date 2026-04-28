import type { ParserError } from '../parser/errors';

export function formatErrorLocation(error: ParserError): string {
  return error.line > 1 ? `Line ${error.line}, column ${error.column}` : `Column ${error.column}`;
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
    return 'A closing parenthesis should appear before this token.';
  }

  return null;
}
