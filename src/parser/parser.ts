import { Grammar, Parser } from 'nearley';
import type { ASTNode, ComparisonExpressionNode } from './ast';
import { DEBUG_PARSER } from './debug';
import { evaluate } from './evaluator';
import {
  createParserError,
  locationFromIndex,
  type ParserError,
  unexpectedEndError
} from './errors';
import compiledGrammar from './grammar.generated';
import { LexerError } from './lexer';

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

type NearleyError = Error & {
  token?: {
    type?: string;
    value: string;
    offset: number;
    line: number;
    col: number;
  };
};

class EmptyParseError extends Error {
  readonly input: string;

  constructor(input: string) {
    super('Unexpected end of input');
    this.name = 'EmptyParseError';
    this.input = input;
  }
}

export function createNearleyParser(): Parser {
  return new Parser(Grammar.fromCompiled(compiledGrammar));
}

export function parseAst(input: string): ASTNode {
  const ast = parseInputToAst(input);

  if (DEBUG_PARSER) {
    console.debug('Parsed AST:', JSON.stringify(ast, null, 2));
  }

  return ast;
}

export function parse(input: string): ParseResult {
  try {
    const ast = parseInputToAst(input);
    const result = ast.type === 'ComparisonExpression' ? evaluateComparison(ast) : undefined;

    logParseSummary(input, { ok: true, ast });

    return {
      ok: true,
      input,
      ast,
      ...(typeof result === 'boolean' ? { result } : {})
    };
  } catch (error) {
    const parserError = toParserError(input, error);

    logParseSummary(input, { ok: false, error: parserError });

    return {
      ok: false,
      input,
      error: parserError
    };
  }
}

function parseInputToAst(input: string): ASTNode {
  const parser = createNearleyParser();
  parser.feed(input);

  if (parser.results.length !== 1) {
    if (parser.results.length === 0) {
      throw new EmptyParseError(input);
    }

    throw new Error(`Expected exactly one parse result, received ${parser.results.length}.`);
  }

  return parser.results[0] as ASTNode;
}

function evaluateComparison(ast: ComparisonExpressionNode): boolean {
  const result = evaluate(ast);

  if (typeof result !== 'boolean') {
    throw new Error('Expected comparison evaluation to return a boolean.');
  }

  return result;
}

function toParserError(input: string, error: unknown): ParserError {
  if (error instanceof EmptyParseError) {
    return unexpectedEndError(input);
  }

  if (error instanceof LexerError) {
    return createLexerParserError(error);
  }

  if (isNearleyError(error)) {
    if (error.token) {
      return createSyntaxParserError(input, error);
    }

    return createParserError({
      message: 'Invalid expression',
      explanation: getErrorMessage(error),
      location: locationFromIndex(input, input.length),
      expected: expectedFromMessage(error.message)
    });
  }

  return createParserError({
    message: 'Invalid expression',
    explanation: getErrorMessage(error),
    location: locationFromIndex(input, input.length)
  });
}

function createLexerParserError(error: LexerError): ParserError {
  return createParserError({
    message: `Unsupported character "${error.value}"`,
    explanation: 'The input contains a character that is not part of the supported expression syntax.',
    location: {
      index: error.index,
      line: error.line,
      column: error.column
    }
  });
}

function createSyntaxParserError(input: string, error: NearleyError): ParserError {
  const token = error.token;

  if (!token) {
    return unexpectedEndError(input, expectedFromMessage(error.message));
  }

  if (token.type === 'error') {
    return createParserError({
      message: `Unsupported character "${token.value.at(0) ?? token.value}"`,
      explanation: 'The input contains a character that is not part of the supported expression syntax.',
      location: {
        index: token.offset,
        line: token.line,
        column: token.col
      },
      expected: expectedFromMessage(error.message)
    });
  }

  return createParserError({
    message: `Unexpected token "${token.value}"`,
    explanation: 'The token does not fit the expected expression syntax at this position.',
    location: {
      index: token.offset,
      line: token.line,
      column: token.col
    },
    expected: expectedFromMessage(error.message)
  });
}

function expectedFromMessage(message: string): string[] | undefined {
  const expected = Array.from(message.matchAll(/A ([^\n]+?) based on:/g), ([, label]) =>
    label.replace(/ token$/, '')
  );
  const uniqueExpected = Array.from(new Set(expected));

  return uniqueExpected.length > 0 ? uniqueExpected : undefined;
}

function isNearleyError(error: unknown): error is NearleyError {
  return error instanceof Error;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown parser error.';
}

function logParseSummary(
  input: string,
  result: { ok: true; ast: ASTNode } | { ok: false; error: ParserError }
): void {
  if (!DEBUG_PARSER) {
    return;
  }

  if (result.ok) {
    console.debug('Parse summary:', {
      inputLength: input.length,
      ok: true,
      rootType: result.ast.type
    });
    return;
  }

  console.debug('Parse summary:', {
    inputLength: input.length,
    ok: false,
    errorIndex: result.error.index,
    line: result.error.line,
    column: result.error.column
  });
}
