# Mathematical Equation Parser

[![CI](https://github.com/Patrick74531/parser/actions/workflows/ci.yml/badge.svg)](https://github.com/Patrick74531/parser/actions/workflows/ci.yml)

React demo for a small mathematical expression parser built with Nearley and Moo.

Live demo: [mathematical-equation-parser.vercel.app](https://mathematical-equation-parser.vercel.app)

The app parses arithmetic or comparison input, displays the AST, evaluates comparison statements to
`true` or `false`, and shows a friendly error location for invalid input.

## Architecture

```txt
input -> Moo lexer -> Nearley parser -> AST -> evaluator -> React UI
```

The parser and evaluator live in `src/parser` and are independent from React. The UI uses the public
`parse(input)` API and renders either a success state with AST/result or a failure state with location
details.

## Install

```sh
npm install
```

## Common Commands

```sh
npm run grammar:build
npm run dev
npm test
npm run build
npx vercel deploy --prod
```

- `grammar:build` regenerates `src/parser/grammar.generated.ts` from `src/parser/grammar.ne`.
- `dev` starts the Vite demo server.
- `test` runs the Vitest suite.
- `build` type-checks and builds the production app.
- `npx vercel deploy --prod` publishes the current project to Vercel.

## CI/CD

GitHub Actions runs install, grammar generation, generated-file verification, tests, and production
build on pushes to `main` and pull requests.

Vercel uses `npm ci`, `npm run build`, and `dist` as the output directory. After the repository is
connected in Vercel, pushes to `main` can deploy automatically.

## Supported Syntax

- Integer literals, such as `12`.
- Arithmetic operators: `+`, `-`, `*`, `/`.
- Comparison operators: `=`, `!=`.
- Parentheses for grouping.
- Optional whitespace between tokens.

Unsupported syntax is intentionally rejected, including decimals, identifiers, chained comparisons,
and operators outside the assignment scope.

## Assignment Examples

| Input | Expected output |
| --- | --- |
| `1 + 2 = 3` | `true` |
| `2 * 3 + 4 = 10` | `true` |
| `2 * (3 + 4) = 10` | `false` |
| `6 = 10 / 2 + 1` | `true` |
| `12 + 3 != 4 / 2 + 5` | `true` |
| `2 + 3 * 2 = 10` | `false` |
| `2 * 3 + 4 != 10` | `false` |
| `1 + (2 = 3` | Invalid input with an error location |

## Test Coverage

The suite covers lexer tokenization, precedence, parentheses, AST shape, evaluator output, parser
errors, UI error highlighting, all assignment examples, and additional cases such as:

- `1+2=3`
- `(1 + 2) * 3 = 9`
- `10 / 2 != 6`
- `1 + * 2`
- `1 + 2 @ 3`

## Final Verification

```sh
npm run grammar:build
npm test
npm run build
git status --short
```
