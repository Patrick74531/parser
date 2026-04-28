export type ExampleOutcome = 'true' | 'false' | 'invalid';

export type ExampleExpression = {
  id: string;
  expression: string;
  expected: ExampleOutcome;
};

export const assignmentExamples: ExampleExpression[] = [
  { id: 'basic-equality', expression: '1 + 2 = 3', expected: 'true' },
  { id: 'mixed-precedence', expression: '2 * 3 + 4 = 10', expected: 'true' },
  { id: 'grouped-expression', expression: '2 * (3 + 4) = 10', expected: 'false' },
  { id: 'right-side-arithmetic', expression: '6 = 10 / 2 + 1', expected: 'true' },
  { id: 'not-equal-comparison', expression: '12 + 3 != 4 / 2 + 5', expected: 'true' },
  { id: 'precedence-false', expression: '2 + 3 * 2 = 10', expected: 'false' },
  { id: 'not-equal-false', expression: '2 * 3 + 4 != 10', expected: 'false' },
  { id: 'invalid-query', expression: '1 + (2 = 3', expected: 'invalid' }
];
