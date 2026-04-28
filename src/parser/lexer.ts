import moo from 'moo';
import { DEBUG_PARSER } from './debug';

export const tokenTypes = [
  'number',
  'plus',
  'minus',
  'times',
  'divide',
  'neq',
  'eq',
  'lparen',
  'rparen'
] as const;

export type TokenType = (typeof tokenTypes)[number];
export type ParserToken = moo.Token & { type: TokenType };

export type TokenDumpRow = {
  type: TokenType;
  value: string;
  offset: number;
  line: number;
  column: number;
};

const meaningfulTokenTypes = new Set<string>(tokenTypes);

const rules: moo.Rules = {
  ws: { match: /\s+/, lineBreaks: true },
  number: /[0-9]+/,
  neq: '!=',
  eq: '=',
  plus: '+',
  minus: '-',
  times: '*',
  divide: '/',
  lparen: '(',
  rparen: ')',
  error: moo.error
};

export class LexerError extends Error {
  readonly index: number;
  readonly line: number;
  readonly column: number;
  readonly value: string;
  readonly token: moo.Token;

  constructor(token: moo.Token) {
    const value = token.value.at(0) ?? token.value;

    super(`Unsupported character "${value}" at line ${token.line}, column ${token.col}.`);
    this.name = 'LexerError';
    this.index = token.offset;
    this.line = token.line;
    this.column = token.col;
    this.value = value;
    this.token = token;
  }
}

function toParserToken(token: moo.Token): ParserToken {
  if (!token.type || !meaningfulTokenTypes.has(token.type)) {
    throw new Error(`Unexpected lexer token type: ${token.type ?? 'unknown'}`);
  }

  return token as ParserToken;
}

export function createLexer(): moo.Lexer {
  const lexer = moo.compile(rules);
  const nextToken = lexer.next.bind(lexer);

  // Nearley should consume only meaningful parser tokens; whitespace still advances Moo positions.
  lexer.next = () => {
    let token = nextToken();

    while (token?.type === 'ws') {
      token = nextToken();
    }

    if (token?.type === 'error') {
      throw new LexerError(token);
    }

    return token;
  };

  return lexer;
}

export function tokenize(input: string): ParserToken[] {
  const lexer = createLexer();
  lexer.reset(input);

  return Array.from(lexer, toParserToken);
}

export function dumpTokens(input: string): TokenDumpRow[] {
  const rows = tokenize(input).map((token) => ({
    type: token.type,
    value: token.value,
    offset: token.offset,
    line: token.line,
    column: token.col
  }));

  if (DEBUG_PARSER) {
    console.table(rows);
  }

  return rows;
}
