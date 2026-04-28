import { Grammar, Parser } from 'nearley';
import type { ASTNode } from './ast';
import { DEBUG_PARSER } from './debug';
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

export function parseAst(input: string): ASTNode {
  const parser = createNearleyParser();
  parser.feed(input);

  if (parser.results.length !== 1) {
    throw new Error(`Expected exactly one parse result, received ${parser.results.length}.`);
  }

  const ast = parser.results[0] as ASTNode;

  if (DEBUG_PARSER) {
    console.debug('Parsed AST:', JSON.stringify(ast, null, 2));
  }

  return ast;
}

export function parse(input: string): ParseResult {
  return {
    ok: false,
    input,
    error: createParserError(input, 'Parser implementation pending')
  };
}
