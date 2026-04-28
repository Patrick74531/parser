import type { ExampleOutcome } from './assignmentExamples';

type ResultPanelProps = {
  expected?: ExampleOutcome;
  isValid: boolean;
  result?: boolean;
};

export function ResultPanel({ expected, isValid, result }: ResultPanelProps) {
  const hasBooleanResult = typeof result === 'boolean';
  const actual = hasBooleanResult ? String(result) : isValid ? 'arithmetic' : 'invalid';

  return (
    <section className="panel output-panel result-panel" aria-labelledby="result-title">
      <h2 id="result-title" className="panel-title">
        Result
      </h2>
      {hasBooleanResult ? (
        <p className={`result-value ${result ? 'result-true' : 'result-false'}`}>
          Result: {String(result)}
        </p>
      ) : isValid ? (
        <p className="muted">Valid arithmetic expression.</p>
      ) : (
        <p className="muted">Cannot evaluate invalid input.</p>
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
