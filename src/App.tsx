import { useMemo, useState } from 'react';
import { parse } from './parser/parser';
import { AstViewer } from './ui/AstViewer';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { ExpressionInput } from './ui/ExpressionInput';
import { ResultPanel } from './ui/ResultPanel';

const initialExpression = '1 + 2 = 3';

export default function App() {
  const [expression, setExpression] = useState(initialExpression);
  const parseResult = useMemo(() => parse(expression), [expression]);

  return (
    <main className="app-shell">
      <section className="workspace" aria-labelledby="app-title">
        <header className="app-header">
          <p className="eyebrow">Nearley + Moo</p>
          <h1 id="app-title">Mathematical Equation Parser</h1>
        </header>

        <ExpressionInput value={expression} onChange={setExpression} />

        <div className="output-grid">
          <AstViewer ast={parseResult.ok ? parseResult.ast : null} />
          <ResultPanel result={parseResult.ok ? parseResult.result : undefined} />
          <ErrorDisplay error={parseResult.ok ? null : parseResult.error} />
        </div>
      </section>
    </main>
  );
}
