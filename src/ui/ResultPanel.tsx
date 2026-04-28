import type { ExampleOutcome } from './assignmentExamples';

type ResultPanelProps = {
  expected?: ExampleOutcome;
  result?: boolean;
};

export function ResultPanel({ expected, result }: ResultPanelProps) {
  const hasBooleanResult = typeof result === 'boolean';
  const actual = hasBooleanResult ? String(result) : 'arithmetic';

  return (
    <section className="panel output-panel result-panel" aria-labelledby="result-title">
      <h2 id="result-title" className="panel-title">
        Result
      </h2>
      {hasBooleanResult ? (
        <p className={`result-value ${result ? 'result-true' : 'result-false'}`}>
          Result: {String(result)}
        </p>
      ) : (
        <p className="muted">Valid arithmetic expression.</p>
      )}
      {expected ? (
        <dl className="result-comparison" aria-label="Expected and actual result">
          <div>
            <dt>Expected</dt>
            <dd>{expected}</dd>
          </div>
          <div>
            <dt>Actual</dt>
            <dd>{actual}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
