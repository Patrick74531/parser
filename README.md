# Mathematical Equation Parser

React, Nearley, and Moo foundation for the mathematical equation parser assignment.

## Commands

- `npm install` installs dependencies.
- `npm run grammar:build` regenerates `src/parser/grammar.generated.ts` from `src/parser/grammar.ne`.
- `npm run dev` starts the Vite dev server.
- `npm test` runs the Vitest test suite.
- `npm run build` type-checks and builds the app.

## Grammar Build

The source grammar lives at `src/parser/grammar.ne`.

The generated grammar lives at `src/parser/grammar.generated.ts` and is checked into the project so runtime code can import it directly. Run `npm run grammar:build` after editing `grammar.ne`.

The current grammar is a minimal Nearley/Moo build smoke path. Later steps will add the full arithmetic grammar, AST construction, evaluation, and error-location handling.
