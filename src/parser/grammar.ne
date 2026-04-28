@preprocessor typescript

@{%
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
%}

@lexer lexer

main -> Input {% ([node]) => node %}

Input -> Comparison {% ([node]) => node %}
       | Additive {% ([node]) => node %}

Comparison -> Additive CompareOp Additive {% ([left, operator, right]) => comparisonExpression(left, operator, right) %}

CompareOp -> %eq {% ([token]) => token %}
           | %neq {% ([token]) => token %}

Additive -> Additive AddOp Multiplicative {% ([left, operator, right]) => binaryExpression(left, operator, right) %}
          | Multiplicative {% ([node]) => node %}

AddOp -> %plus {% ([token]) => token %}
       | %minus {% ([token]) => token %}

Multiplicative -> Multiplicative MulOp Primary {% ([left, operator, right]) => binaryExpression(left, operator, right) %}
                | Primary {% ([node]) => node %}

MulOp -> %times {% ([token]) => token %}
       | %divide {% ([token]) => token %}

Primary -> %number {% ([token]) => numberLiteral(token) %}
         | %lparen Additive %rparen {% ([, expression]) => expression %}
