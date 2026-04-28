import moo from 'moo';

export type ParserToken = moo.Token;

export function createLexer(): moo.Lexer {
  return moo.compile({
    placeholder: /__PARSER_FOUNDATION_PLACEHOLDER__/
  });
}
