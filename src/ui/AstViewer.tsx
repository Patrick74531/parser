import { useState } from 'react';
import type { ASTNode } from '../parser/ast';
import { buildAstTree, type AstTreeItem } from './astTree';

type AstViewerProps = {
  ast: ASTNode | null;
};

type AstViewMode = 'tree' | 'json';

export function AstViewer({ ast }: AstViewerProps) {
  const [viewMode, setViewMode] = useState<AstViewMode>('tree');

  return (
    <section className="panel output-panel ast-panel" aria-labelledby="ast-title">
      <div className="panel-header">
        <h2 id="ast-title" className="panel-title">
          AST
        </h2>
        <div className="segmented-control" aria-label="AST display mode">
          <button
            className="segment-button"
            type="button"
            aria-pressed={viewMode === 'tree'}
            onClick={() => setViewMode('tree')}
          >
            Tree
          </button>
          <button
            className="segment-button"
            type="button"
            aria-pressed={viewMode === 'json'}
            onClick={() => setViewMode('json')}
          >
            JSON
          </button>
        </div>
      </div>
      {ast ? (
        viewMode === 'tree' ? (
          <ol className="ast-tree">
            <AstTreeNode item={buildAstTree(ast)} />
          </ol>
        ) : (
          <pre className="ast-json">{JSON.stringify(ast, null, 2)}</pre>
        )
      ) : (
        <p className="muted">No AST available.</p>
      )}
    </section>
  );
}

function AstTreeNode({ item }: { item: AstTreeItem }) {
  return (
    <li className="ast-tree-item">
      <div className="ast-tree-row">
        <span className="ast-tree-label">{item.label}</span>
        <span className="ast-tree-detail">{item.detail}</span>
      </div>
      {item.children.length > 0 ? (
        <ol className="ast-tree-children">
          {item.children.map((child) => (
            <AstTreeNode key={child.id} item={child} />
          ))}
        </ol>
      ) : null}
    </li>
  );
}
