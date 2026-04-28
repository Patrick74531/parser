# Mathematical Equation Parser

A TypeScript parser for simple mathematical expressions and comparison statements, with a React demo
for AST visualization, boolean evaluation, and friendly syntax errors.

Live demo: [mathematical-equation-parser.vercel.app](https://mathematical-equation-parser.vercel.app)

## Overview

The core parser is independent from React and lives under `src/parser`. It uses Moo for lexing,
Nearley for parsing, and a small evaluator for arithmetic and equality comparison results.

```txt
input -> Moo lexer -> Nearley parser -> AST -> evaluator -> React UI
```

## Scope

Supported:

- Whole-number literals only, for example `12` or `345`.
- Arithmetic operators: `+`, `-`, `*`, `/`.
- Standard arithmetic precedence: `*` and `/` bind before `+` and `-`.
- Comparison operators: `=` and `!=`.
- Parentheses for grouping arithmetic expressions.
- Optional whitespace, including newlines.
- Arithmetic-only input, which returns an AST without a boolean result.
- Comparison input, which returns an AST plus a boolean result.

Not supported in this version:

- Decimal literals, for example `1.5`.
- Negative number literals, for example `-1`. Expressions can still evaluate to negative values,
  such as `1 - 2`.
- Identifiers, variables, functions, or assignments.
- Chained comparisons, for example `1 = 1 = 1`.
- Comparison operators other than `=` and `!=`, such as `<`, `>`, `<=`, or `>=`.
- Parenthesized comparison expressions, for example `(1 = 1)`.

## Examples

| Input | Output |
| --- | --- |
| `1 + 2 = 3` | `true` |
| `2 * 3 + 4 = 10` | `true` |
| `2 * (3 + 4) = 10` | `false` |
| `6 = 10 / 2 + 1` | `true` |
| `12 + 3 != 4 / 2 + 5` | `true` |
| `2 + 3 * 2 = 10` | `false` |
| `2 * 3 + 4 != 10` | `false` |
| `1 + (2 = 3` | Invalid input with error location |

## Tech Stack

- TypeScript for parser, evaluator, and UI code.
- Nearley for grammar-based parsing.
- Moo for tokenization.
- React and Vite for the browser demo.
- Vitest for automated tests.

## Getting Started

```sh
npm install
npm run dev
```

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm test` | Run the Vitest test suite. |
| `npm run build` | Type-check and build the production app. |
| `npm run grammar:build` | Regenerate `src/parser/grammar.generated.ts` from `src/parser/grammar.ne`. |

## Project Structure

```txt
src/parser/
  ast.ts          AST node types
  lexer.ts        Moo lexer and token helpers
  grammar.ne      Nearley grammar source
  parser.ts       Public parse API and error normalization
  evaluator.ts    Arithmetic and comparison evaluator

src/ui/           React UI helpers and display components
src/tests/        Lexer, parser, evaluator, AST, and UI helper tests
```

## Quality Gates

[![CI](https://github.com/Patrick74531/parser/actions/workflows/ci.yml/badge.svg)](https://github.com/Patrick74531/parser/actions/workflows/ci.yml)

GitHub Actions runs grammar generation, generated-file verification, tests, and production build on
pushes to `main` and pull requests.

Before merging or deploying, run:

```sh
npm run grammar:build
npm test
npm run build
git status --short
```

Vercel builds the app with `npm ci` and `npm run build`, then serves the `dist` output directory.
