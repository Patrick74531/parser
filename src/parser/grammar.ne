@preprocessor typescript

@{%
import { createLexer } from './lexer';

const lexer = createLexer();
%}

@lexer lexer

main -> %number {% ([token]) => token.value %}
