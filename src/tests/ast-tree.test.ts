import { describe, expect, it } from 'vitest';
import { parse } from '../parser/parser';
import { buildAstTree } from '../ui/astTree';

describe('AST tree view model', () => {
  it('builds a readable tree from a comparison AST', () => {
    const result = parse('1 + 2 = 3');

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(buildAstTree(result.ast)).toEqual({
      id: 'root',
      label: 'Root',
      detail: 'ComparisonExpression (=)',
      children: [
        {
          id: 'root.left',
          label: 'Left',
          detail: 'BinaryExpression (+)',
          children: [
            {
              id: 'root.left.left',
              label: 'Left',
              detail: 'NumberLiteral 1',
              children: []
            },
            {
              id: 'root.left.right',
              label: 'Right',
              detail: 'NumberLiteral 2',
              children: []
            }
          ]
        },
        {
          id: 'root.right',
          label: 'Right',
          detail: 'NumberLiteral 3',
          children: []
        }
      ]
    });
  });
});
