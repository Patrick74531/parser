import { useMemo, useState } from 'react';
import { parse } from './parser/parser';
import { AstViewer } from './ui/AstViewer';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { ExpressionInput } from './ui/ExpressionInput';
import { ResultPanel } from './ui/ResultPanel';
import { assignmentExamples } from './ui/assignmentExamples';

const initialExpression = assignmentExamples[0].expression;

export default function App() {
  const [expression, setExpression] = useState(initialExpression);
  const parseResult = useMemo(() => parse(expression), [expression]);
  const parserError = parseResult.ok ? null : parseResult.error;
  const selectedExample = useMemo(
    () => assignmentExamples.find((example) => example.expression === expression),
    [expression]
  );

  return (
    <main className="app-shell">
      <section className="workspace" aria-labelledby="app-title">
        <header className="app-header">
          <p className="eyebrow">Nearley + Moo</p>
          <h1 id="app-title">Mathematical Equation Parser</h1>
          <p className="app-subtitle">
            Supports whole numbers, +, -, *, /, =, !=, parentheses, and optional whitespace.
          </p>
        </header>

        <div className="demo-grid">
          <div className="workflow-column">
            <ExpressionInput
              value={expression}
              error={parserError}
              examples={assignmentExamples}
              onChange={setExpression}
            />
            {parserError ? <ErrorDisplay error={parserError} /> : null}
            {parseResult.ok ? (
              <ResultPanel expected={selectedExample?.expected} result={parseResult.result} />
            ) : null}
          </div>
          <AstViewer ast={parseResult.ok ? parseResult.ast : null} />
        </div>
      </section>
    </main>
  );
}
