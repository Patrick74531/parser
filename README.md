# Mathematical Equation Parser

React, Nearley, and Moo implementation for the mathematical equation parser assignment.

The app parses arithmetic and comparison expressions, displays the AST, evaluates comparison
statements, and reports friendly error locations in the demo UI.

## Commands

- `npm install` installs dependencies.
- `npm run grammar:build` regenerates `src/parser/grammar.generated.ts` from `src/parser/grammar.ne`.
- `npm run dev` starts the Vite dev server.
- `npm test` runs the Vitest test suite.
- `npm run build` type-checks and builds the app.

## Grammar Build

The source grammar lives at `src/parser/grammar.ne`.

The generated grammar lives at `src/parser/grammar.generated.ts` and is checked into the project so runtime code can import it directly. Run `npm run grammar:build` after editing `grammar.ne`.

## Supported Syntax

- Integer literals.
- Arithmetic operators: `+`, `-`, `*`, `/`.
- Comparison operators: `=`, `!=`.
- Parentheses for grouping.
- Whitespace between tokens is optional.

## Examples

- `1 + 2 = 3` evaluates to `true`.
- `2 * 3 + 4 = 10` evaluates to `true`.
- `2 * (3 + 4) = 10` evaluates to `false`.
- `6 = 10 / 2 + 1` evaluates to `true`.
- `12 + 3 != 4 / 2 + 5` evaluates to `true`.
- `2 + 3 * 2 = 10` evaluates to `false`.
- `2 * 3 + 4 != 10` evaluates to `false`.
- `1 + (2 = 3` is invalid and reports an error location.
