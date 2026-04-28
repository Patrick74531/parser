import { Grammar, Parser } from 'nearley';
import type { ASTNode } from './ast';
import { createParserError, type ParserError } from './errors';
import compiledGrammar from './grammar.generated';

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

export function createNearleyParser(): Parser {
  return new Parser(Grammar.fromCompiled(compiledGrammar));
}

export function parse(input: string): ParseResult {
  return {
    ok: false,
    input,
    error: createParserError(input, 'Parser implementation pending')
  };
}
