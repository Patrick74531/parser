import type { ASTNode } from './ast';

export type EvaluationResult = number | boolean;

export function evaluate(_ast: ASTNode): EvaluationResult {
  throw new Error('Evaluator is not implemented in Step 1.');
}
