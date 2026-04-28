import type { ParserError } from '../parser/errors';

type ErrorDisplayProps = {
  error: ParserError | null;
};

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <section
      className={`panel output-panel error-panel ${error ? 'error-panel-active' : 'error-panel-clear'}`}
      aria-labelledby="error-title"
      aria-live="polite"
    >
      <h2 id="error-title" className="panel-title">
        Error
      </h2>
      {error ? (
        <>
          <p id="parser-error-message" className="error-message">
            {error.message}
          </p>
          <p className="error-detail">
            {error.explanation}
          </p>
          <p className="error-note">First error shown. Fix it and parse again.</p>
          <dl className="error-location">
            <div>
              <dt>Line</dt>
              <dd>{error.line}</dd>
            </div>
            <div>
              <dt>Column</dt>
              <dd>{error.column}</dd>
            </div>
            <div>
              <dt>Index</dt>
              <dd>{error.index}</dd>
            </div>
          </dl>
          {error.expected ? (
            <p className="expected-tokens">Expected: {error.expected.join(', ')}</p>
          ) : null}
        </>
      ) : (
        <p className="muted">No parser error.</p>
      )}
    </section>
  );
}
