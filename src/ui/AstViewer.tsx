import type { ASTNode } from '../parser/ast';

type AstViewerProps = {
  ast: ASTNode | null;
};

export function AstViewer({ ast }: AstViewerProps) {
  return (
    <section className="panel output-panel" aria-labelledby="ast-title">
      <h2 id="ast-title" className="panel-title">
        AST
      </h2>
      {ast ? (
        <pre>{JSON.stringify(ast, null, 2)}</pre>
      ) : (
        <p className="muted">AST output will appear here after parser implementation.</p>
      )}
    </section>
  );
}
