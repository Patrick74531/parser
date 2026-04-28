# Mathematical Equation Parser Design Document

## 1. Assignment Scope

This project implements a small mathematical equation parser using Nearley, Moo, and React.

The implementation should stay close to the assignment requirements:

- Use Nearley for parsing.
- Use Moo for lexical analysis.
- Support arithmetic operators: `+`, `-`, `*`, `/`.
- Support comparison operators: `=`, `!=`.
- Ignore whitespace.
- Support parentheses for grouping.
- Apply standard precedence:
  - parentheses first
  - `*` and `/`
  - `+` and `-`
  - comparison after arithmetic
- Produce an AST for valid arithmetic or comparison input.
- Evaluate valid comparison statements to `true` or `false`.
- Report the location of invalid input.
- Provide a React demo that lets a user enter an expression, inspect the AST, see the evaluation result, and see error location.
- Include the assignment examples as tests plus at least three additional tests.

The grammar should focus on the assignment syntax described in the PDF.

## 2. Architecture

The parser pipeline is intentionally simple:

```txt
input string -> Moo tokens -> Nearley parser -> AST -> evaluator -> React display
```

Design rules:

- Keep parser and evaluator logic independent from React.
- Build the AST in parser/grammar code.
- Evaluate from the AST, not by re-reading the raw input string.
- Convert parser failures into a small UI-friendly error object with a useful location.
- Keep debug helpers opt-in and disabled during normal app usage.

## 3. Lexer

Moo converts the raw input string into tokens.

Required tokens:

- `number`: integer number literals
- `plus`: `+`
- `minus`: `-`
- `times`: `*`
- `divide`: `/`
- `eq`: `=`
- `neq`: `!=`
- `lparen`: `(`
- `rparen`: `)`
- `ws`: whitespace, skipped

Whitespace should not affect parsing. For example, `1+2=3` and `1 + 2 = 3` should produce equivalent meaningful token sequences.

`!=` must be tokenized before `=` so it is not split into separate characters.

## 4. Grammar Strategy

Precedence should be represented directly in the grammar.

```txt
Input           -> Comparison
                -> Additive

Comparison      -> Additive CompareOp Additive
CompareOp       -> "="
                -> "!="

Additive        -> Additive ("+" | "-") Multiplicative
                -> Multiplicative

Multiplicative  -> Multiplicative ("*" | "/") Primary
                -> Primary

Primary         -> number
                -> "(" Additive ")"
```

Expected behavior:

- `2 + 3 * 2 = 10` parses as `2 + (3 * 2) = 10`.
- `2 * (3 + 4) = 10` parses grouped addition first.
- Comparison is evaluated after arithmetic.
- Arithmetic-only input is valid and should still produce an AST.
- Comparison input is treated as a statement and evaluated to a boolean.

Grammar postprocessors should only build AST nodes. Evaluation should happen in the evaluator.

## 5. AST Schema

The AST should be clear enough to display in the React demo and simple enough to test directly.

```ts
type ArithmeticNode = NumberLiteralNode | BinaryExpressionNode;

type ASTNode = ArithmeticNode | ComparisonExpressionNode;
```

### NumberLiteral

```ts
type NumberLiteralNode = {
  type: 'NumberLiteral';
  value: number;
  raw: string;
};
```

### BinaryExpression

Used for arithmetic operators.

```ts
type BinaryExpressionNode = {
  type: 'BinaryExpression';
  operator: '+' | '-' | '*' | '/';
  left: ArithmeticNode;
  right: ArithmeticNode;
};
```

### ComparisonExpression

Used for comparison operators.

```ts
type ComparisonExpressionNode = {
  type: 'ComparisonExpression';
  operator: '=' | '!=';
  left: ArithmeticNode;
  right: ArithmeticNode;
};
```

## 6. Evaluation

The evaluator walks the AST recursively.

- `NumberLiteral` evaluates to a number.
- `BinaryExpression` evaluates to a number.
- `ComparisonExpression` evaluates both arithmetic sides and returns a boolean.

The public result required by the assignment is the boolean result for comparison statements.

Examples:

- `1 + 2 = 3` -> `true`
- `2 * 3 + 4 = 10` -> `true`
- `2 * (3 + 4) = 10` -> `false`

Arithmetic-only input is valid, but it does not need to be presented as a boolean statement.

## 7. Error Handling

Invalid input should return a friendly error object that the UI can display.

```ts
type ParserError = {
  message: string;
  explanation: string;
  index: number;
  line: number;
  column: number;
  expected?: string[];
};
```

Rules:

- Unsupported characters should point to the unsupported character.
- Syntax errors should point to the token or position where parsing failed.
- Unexpected end-of-input should point to the end of the input.
- The React UI should display the friendly error instead of raw Nearley or Moo errors.

Debug mode may include additional internal details, such as whether the failure came from the lexer or parser. Those details should not be required for normal UI rendering.

## 8. React Demo UX

The React demo should provide:

- Editable expression input.
- Parsed AST display for valid input.
- Boolean result display for valid comparison statements.
- Friendly error display for invalid input.
- Visible error location.

UX enhancements to keep:

- Show line and column for errors.
- Highlight the invalid character or token with a red underline.
- Show a caret at the end for unexpected end-of-input.
- Provide a few assignment example presets if useful.
- Keep the input implementation lightweight, such as a textarea plus a simple highlight preview.

A full code editor is not required.

## 9. Debugging Plan

Debugging support should be useful but lightweight.

Recommended helpers:

- A token dump helper for lexer debugging.
- A compact parser summary for parse attempts.
- An evaluator trace for local troubleshooting.
- A highlight calculation debug log for UI error-location work.

All debug output should be opt-in, for example behind a local `DEBUG_PARSER` flag or development-only branch.

## 10. Testing Strategy

### Required Assignment Examples

- `1 + 2 = 3` -> `true`
- `2 * 3 + 4 = 10` -> `true`
- `2 * (3 + 4) = 10` -> `false`
- `6 = 10 / 2 + 1` -> `true`
- `12 + 3 != 4 / 2 + 5` -> `true`
- `2 + 3 * 2 = 10` -> `false`
- `2 * 3 + 4 != 10` -> `false`
- `1 + (2 = 3` -> invalid with error location

### Additional Tests

- `1+2=3` -> `true`, confirms whitespace is optional.
- `(1 + 2) * 3 = 9` -> `true`, confirms parentheses override precedence.
- `10 / 2 != 6` -> `true`, confirms division and `!=`.
- `1 + * 2` -> invalid syntax with useful location.
- `1 + 2 @ 3` -> invalid character with exact location.

### Coverage Goals

Tests should verify:

- Lexer tokenization.
- AST shape for representative valid inputs.
- Operator precedence.
- Parentheses behavior.
- Boolean evaluation for comparison statements.
- Invalid input location.
- React-visible error data.

## 11. Build Workflow

Recommended project layout:

```txt
src/
  parser/
    lexer.ts
    grammar.ne
    grammar.generated.ts
    parser.ts
    ast.ts
    evaluator.ts
    errors.ts
  ui/
    ExpressionInput.tsx
    AstViewer.tsx
    ResultPanel.tsx
    ErrorDisplay.tsx
  tests/
    parser.test.ts
    evaluator.test.ts
    errors.test.ts
  App.tsx
  main.tsx
package.json
README.md
```

`grammar.ne` is the source grammar. If the app uses a generated Nearley module, generation should happen before development, test, and build commands that need it.

## Verification Checklist

- Uses Nearley and Moo.
- Supports all required operators.
- Ignores whitespace.
- Applies required precedence.
- Supports parentheses.
- Produces an AST for valid input.
- Evaluates comparison statements to `true` or `false`.
- Reports invalid input location.
- React demo shows input, AST, result, and error location.
- Includes all assignment examples as tests.
- Includes at least three additional meaningful tests.
- Keeps debug support lightweight and opt-in.
