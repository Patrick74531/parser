// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    {"name": "main$string$1", "symbols": [{"literal":"F"}, {"literal":"O"}, {"literal":"U"}, {"literal":"N"}, {"literal":"D"}, {"literal":"A"}, {"literal":"T"}, {"literal":"I"}, {"literal":"O"}, {"literal":"N"}, {"literal":"_"}, {"literal":"P"}, {"literal":"L"}, {"literal":"A"}, {"literal":"C"}, {"literal":"E"}, {"literal":"H"}, {"literal":"O"}, {"literal":"L"}, {"literal":"D"}, {"literal":"E"}, {"literal":"R"}], "postprocess": (d) => d.join('')},
    {"name": "main", "symbols": ["main$string$1"]}
  ],
  ParserStart: "main",
};

export default grammar;
