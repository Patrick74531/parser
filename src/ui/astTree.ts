import type { ASTNode } from '../parser/ast';

export type AstTreeItem = {
  id: string;
  label: string;
  detail: string;
  children: AstTreeItem[];
};

export function buildAstTree(node: ASTNode, label = 'Root', id = 'root'): AstTreeItem {
  if (node.type === 'NumberLiteral') {
    return {
      id,
      label,
      detail: `NumberLiteral ${node.raw}`,
      children: []
    };
  }

  if (node.type === 'BinaryExpression') {
    return {
      id,
      label,
      detail: `BinaryExpression (${node.operator})`,
      children: [
        buildAstTree(node.left, 'Left', `${id}.left`),
        buildAstTree(node.right, 'Right', `${id}.right`)
      ]
    };
  }

  return {
    id,
    label,
    detail: `ComparisonExpression (${node.operator})`,
    children: [
      buildAstTree(node.left, 'Left', `${id}.left`),
      buildAstTree(node.right, 'Right', `${id}.right`)
    ]
  };
}
