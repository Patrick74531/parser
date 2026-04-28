# Mathematical Equation Parser Execution Plan

This plan breaks the assignment into small implementation steps. Each step is independently verifiable and stays close to the PDF requirements.

Core rules:

- Use Nearley and Moo.
- Keep parser/evaluator code separate from React.
- Build and display an AST.
- Evaluate comparison statements to `true` or `false`.
- Show invalid input location.
- Keep debug instrumentation lightweight and opt-in.
- Keep UX error feedback clear and visible.

---

## Step 1: Project Foundation

- Objective:
  - Set up the React app, parser folders, dependencies, scripts, and test runner.

- Scope:
  - Included: project scaffold, Nearley, Moo, React, chosen JavaScript/TypeScript setup, test runner, package scripts.
  - Not included: lexer rules, grammar behavior, evaluator logic, UI polish.

- Implementation Tasks:
  - Create the project structure from `docs/project-design.md`.
  - Add dependencies for React, Nearley, Moo, and the chosen test runner.
  - Add package scripts for `dev`, `build`, `test`, and grammar generation if the generated grammar is checked or imported by the app.
  - Create parser module placeholders:
    - `src/parser/lexer.ts`
    - `src/parser/grammar.ne`
    - `src/parser/parser.ts`
    - `src/parser/ast.ts`
    - `src/parser/evaluator.ts`
    - `src/parser/errors.ts`
  - Create UI placeholders for input, AST, result, and error display.

- Debug / Instrumentation:
  - Add a lightweight debug convention, such as a local `DEBUG_PARSER` flag.
  - Keep debug output disabled during normal app usage.

- Acceptance Criteria:
  - Dependencies install successfully.
  - Test command runs.
  - Development app starts.
  - Parser and UI folders exist.

---

## Step 2: Moo Lexer

- Objective:
  - Convert raw input strings into tokens for the grammar.

- Scope:
  - Included: tokens for assignment syntax, skipped whitespace, lexer tests.
  - Not included: grammar parsing, AST construction, evaluation, React display.

- Implementation Tasks:
  - Implement `src/parser/lexer.ts`.
  - Define tokens for:
    - `number`
    - `plus`
    - `minus`
    - `times`
    - `divide`
    - `eq`
    - `neq`
    - `lparen`
    - `rparen`
    - skipped whitespace
  - Ensure `!=` is tokenized before `=`.
  - Preserve token position metadata for error reporting.
  - Add lexer tests for compact input, spaced input, parentheses, and unsupported characters.

- Debug / Instrumentation:
  - Add a token dump helper that prints token type, value, offset, line, and column when debug mode is enabled.

- Acceptance Criteria:
  - `1+2=3` and `1 + 2 = 3` produce equivalent meaningful tokens.
  - `12 + 3 != 4 / 2 + 5` includes one `neq` token.
  - `2 * (3 + 4) = 10` includes both parenthesis tokens.
  - `1 + 2 @ 3` fails at the `@` position.

---

## Step 3: Nearley Grammar Build

- Objective:
  - Make the Nearley grammar usable from the parser module.

- Scope:
  - Included: `grammar.ne`, generation command if needed, parser import path.
  - Not included: evaluator behavior, React behavior.

- Implementation Tasks:
  - Create `src/parser/grammar.ne`.
  - Configure Nearley compilation if the app imports a generated grammar file.
  - Ensure app/test/build commands either generate the grammar first or clearly use the generated file.
  - Document the grammar generation command in `README.md`.

- Debug / Instrumentation:
  - Make grammar generation print the input grammar path and output path.

- Acceptance Criteria:
  - Grammar generation succeeds if used.
  - Parser code can import the grammar used at runtime.
  - Runtime code does not read `grammar.ne` directly unless the project intentionally supports that path.

---

## Step 4: Grammar and AST Construction

- Objective:
  - Parse valid input into the expected AST shape with correct precedence.

- Scope:
  - Included: grammar rules, AST nodes, precedence, parentheses, comparison statement shape.
  - Not included: React rendering and final UI styling.

- Implementation Tasks:
  - Implement grammar layers:
    - `Input -> Comparison | Additive`
    - `Comparison -> Additive ("=" | "!=") Additive`
    - `Additive -> Additive ("+" | "-") Multiplicative | Multiplicative`
    - `Multiplicative -> Multiplicative ("*" | "/") Primary | Primary`
    - `Primary -> number | "(" Additive ")"`
  - Define AST node types in `src/parser/ast.ts`.
  - Build AST nodes in grammar postprocessors or small helper functions.
  - Keep grammar postprocessors focused on AST construction, not evaluation.

- Debug / Instrumentation:
  - Add an optional AST debug printer that shows node type, operator, and child structure.

- Acceptance Criteria:
  - `1 + 2 = 3` produces a `ComparisonExpression`.
  - `2 + 3 * 2 = 10` represents `3 * 2` below the `+` node.
  - `2 * (3 + 4) = 10` preserves the parenthesized addition in the AST.
  - `12 + 3 != 4 / 2 + 5` produces a comparison with operator `!=`.

---

## Step 5: Evaluator

- Objective:
  - Evaluate comparison statements safely from the AST.

- Scope:
  - Included: recursive AST evaluator, arithmetic subexpression evaluation, comparison evaluation, tests.
  - Not included: parsing raw input, UI rendering.

- Implementation Tasks:
  - Implement `src/parser/evaluator.ts`.
  - Evaluate `NumberLiteral` to a number.
  - Evaluate `BinaryExpression` operators `+`, `-`, `*`, and `/`.
  - Evaluate `ComparisonExpression` operators `=` and `!=` to boolean.
  - Ensure the evaluator receives AST nodes, not raw input strings.
  - Keep evaluation based on AST nodes.

- Debug / Instrumentation:
  - Add an optional evaluator trace with node type, operator, input values, and result.

- Acceptance Criteria:
  - `1 + 2 = 3` evaluates to `true`.
  - `2 * 3 + 4 = 10` evaluates to `true`.
  - `2 * (3 + 4) = 10` evaluates to `false`.
  - `6 = 10 / 2 + 1` evaluates to `true`.
  - `12 + 3 != 4 / 2 + 5` evaluates to `true`.
  - `2 + 3 * 2 = 10` evaluates to `false`.
  - `2 * 3 + 4 != 10` evaluates to `false`.

---

## Step 6: Parser API and Error Location

- Objective:
  - Provide one parser entry point for tests and React.

- Scope:
  - Included: parser orchestration, AST return, boolean result for comparison statements, friendly error object.
  - Not included: React UI rendering.

- Implementation Tasks:
  - Implement `parse(input)` in `src/parser/parser.ts`.
  - Return success with:
    - original input
    - AST
    - boolean evaluation when the AST is a comparison statement
  - Return failure with:
    - original input
    - friendly error message
    - error index
    - line and column
    - optional expected token labels
  - Convert normal Moo and Nearley failures into this UI-friendly error shape.
  - Use `input.length` as the error index for unexpected end-of-input.

- Debug / Instrumentation:
  - In debug mode, log a compact parse summary:
    - input length
    - success/failure
    - AST root type when successful
    - error location when failed

- Acceptance Criteria:
  - Valid assignment examples return AST and expected boolean result.
  - Invalid assignment example returns an error location.
  - React can depend on `parse(input)` without importing lexer, grammar, or evaluator internals.

---

## Step 7: Parser and Evaluator Tests

- Objective:
  - Verify the behavior required by the PDF and a few meaningful edge cases.

- Scope:
  - Included: unit/integration tests for parser modules.
  - Not included: full browser visual tests.

- Implementation Tasks:
  - Add tests for all assignment examples:
    - `1 + 2 = 3`
    - `2 * 3 + 4 = 10`
    - `2 * (3 + 4) = 10`
    - `6 = 10 / 2 + 1`
    - `12 + 3 != 4 / 2 + 5`
    - `2 + 3 * 2 = 10`
    - `2 * 3 + 4 != 10`
    - `1 + (2 = 3`
  - Add at least three additional tests:
    - `1+2=3`
    - `(1 + 2) * 3 = 9`
    - `10 / 2 != 6`
    - `1 + * 2`
    - `1 + 2 @ 3`
  - Test representative AST shapes for precedence and parentheses.
  - Test error index, line, and column for invalid input.

- Debug / Instrumentation:
  - Keep debug logs opt-in so normal test output stays readable.

- Acceptance Criteria:
  - All required PDF examples are covered.
  - At least three additional meaningful tests are covered.
  - Tests verify AST shape, boolean result, and invalid input location.
  - `npm test` passes.

---

## Step 8: React Demo and UX Error Feedback

- Objective:
  - Build the required demo application and keep the user experience clear.

- Scope:
  - Included: input, AST display, result display, error display, error highlighting.
  - Not included: full code editor integration or complex UI framework work.

- Implementation Tasks:
  - Implement `src/App.tsx` as the main demo screen.
  - Implement UI components:
    - `ExpressionInput.tsx`
    - `AstViewer.tsx`
    - `ResultPanel.tsx`
    - `ErrorDisplay.tsx`
  - Keep parse state derived from `parse(input)`.
  - Show formatted AST JSON for valid input.
  - Show `Result: true` or `Result: false` for valid comparison statements.
  - Show a clear error message for invalid input.
  - Display line and column for errors.
  - Highlight the invalid character or token.
  - Show a caret at the end for unexpected end-of-input.
  - Add assignment example presets if useful.

- Debug / Instrumentation:
  - Add development-only logging for highlight calculations:
    - input length
    - error index
    - whether the error is end-of-input

- Acceptance Criteria:
  - User can enter `1 + 2 = 3` and see `Result: true`.
  - User can enter `2 * (3 + 4) = 10` and see `Result: false`.
  - User can see formatted AST JSON for valid input.
  - User sees a clear error message and location for invalid input.
  - Error highlighting points at the correct position.

---

## Step 9: Final Deliverables and Verification

- Objective:
  - Prepare the project for assignment review.

- Scope:
  - Included: README, final test run, build verification, repository readiness.
  - Not included: new syntax outside the PDF requirements.

- Implementation Tasks:
  - Write `README.md` with:
    - project overview
    - install instructions
    - grammar generation instructions if needed
    - dev server instructions
    - test instructions
    - supported syntax
    - assignment example list
  - Run the final verification commands:
    - grammar generation if needed
    - tests
    - build
  - Confirm the demo UI satisfies:
    - expression input
    - AST display
    - boolean result display
    - error location display
  - Confirm no unsupported syntax was added as a feature.

- Debug / Instrumentation:
  - Keep debug logs disabled by default.
  - Document how to enable local parser debug output if implemented.

- Acceptance Criteria:
  - Source code is complete and organized.
  - README explains how to run and test the app.
  - All required assignment examples pass.
  - At least three additional tests pass.
  - Production build succeeds.
  - Demo UI shows AST, result, and error location.
