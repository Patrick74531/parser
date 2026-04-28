// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var eq: any;
declare var neq: any;
declare var plus: any;
declare var minus: any;
declare var times: any;
declare var divide: any;
declare var number: any;
declare var lparen: any;
declare var rparen: any;

import type {
  ArithmeticNode,
  ArithmeticOperator,
  BinaryExpressionNode,
  ComparisonExpressionNode,
  ComparisonOperator,
  NumberLiteralNode
} from './ast';
import { createLexer, type ParserToken } from './lexer';

const lexer = createLexer();

function numberLiteral(token: ParserToken): NumberLiteralNode {
  return {
    type: 'NumberLiteral',
    value: Number(token.value),
    raw: token.value
  };
}

function binaryExpression(
  left: ArithmeticNode,
  operator: ParserToken,
  right: ArithmeticNode
): BinaryExpressionNode {
  return {
    type: 'BinaryExpression',
    operator: operator.value as ArithmeticOperator,
    left,
    right
  };
}

function comparisonExpression(
  left: ArithmeticNode,
  operator: ParserToken,
  right: ArithmeticNode
): ComparisonExpressionNode {
  return {
    type: 'ComparisonExpression',
    operator: operator.value as ComparisonOperator,
    left,
    right
  };
}

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
  Lexer: lexer,
  ParserRules: [
    {"name": "main", "symbols": ["Input"], "postprocess": ([node]) => node},
    {"name": "Input", "symbols": ["Comparison"], "postprocess": ([node]) => node},
    {"name": "Input", "symbols": ["Additive"], "postprocess": ([node]) => node},
    {"name": "Comparison", "symbols": ["Additive", "CompareOp", "Additive"], "postprocess": ([left, operator, right]) => comparisonExpression(left, operator, right)},
    {"name": "CompareOp", "symbols": [(lexer.has("eq") ? {type: "eq"} : eq)], "postprocess": ([token]) => token},
    {"name": "CompareOp", "symbols": [(lexer.has("neq") ? {type: "neq"} : neq)], "postprocess": ([token]) => token},
    {"name": "Additive", "symbols": ["Additive", "AddOp", "Multiplicative"], "postprocess": ([left, operator, right]) => binaryExpression(left, operator, right)},
    {"name": "Additive", "symbols": ["Multiplicative"], "postprocess": ([node]) => node},
    {"name": "AddOp", "symbols": [(lexer.has("plus") ? {type: "plus"} : plus)], "postprocess": ([token]) => token},
    {"name": "AddOp", "symbols": [(lexer.has("minus") ? {type: "minus"} : minus)], "postprocess": ([token]) => token},
    {"name": "Multiplicative", "symbols": ["Multiplicative", "MulOp", "Primary"], "postprocess": ([left, operator, right]) => binaryExpression(left, operator, right)},
    {"name": "Multiplicative", "symbols": ["Primary"], "postprocess": ([node]) => node},
    {"name": "MulOp", "symbols": [(lexer.has("times") ? {type: "times"} : times)], "postprocess": ([token]) => token},
    {"name": "MulOp", "symbols": [(lexer.has("divide") ? {type: "divide"} : divide)], "postprocess": ([token]) => token},
    {"name": "Primary", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([token]) => numberLiteral(token)},
    {"name": "Primary", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "Additive", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": ([, expression]) => expression}
  ],
  ParserStart: "main",
};

export default grammar;
