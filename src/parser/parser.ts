import type { ASTNode } from './ast';
import { createParserError, type ParserError } from './errors';

export type ParseSuccess = {
  ok: true;
  input: string;
  ast: ASTNode;
  result?: boolean;
};

export type ParseFailure = {
  ok: false;
  input: string;
  error: ParserError;
};

export type ParseResult = ParseSuccess | ParseFailure;

export function parse(input: string): ParseResult {
  return {
    ok: false,
    input,
    error: createParserError(input, 'Parser implementation pending')
  };
}
