import type { ParserError } from '../parser/errors';

type ErrorDisplayProps = {
  error: ParserError | null;
};

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <section className="panel output-panel error-panel" aria-labelledby="error-title">
      <h2 id="error-title" className="panel-title">
        Error
      </h2>
      {error ? (
        <>
          <p className="error-message">{error.message}</p>
          <p className="error-detail">
            {error.explanation} Location: line {error.line}, column {error.column}.
          </p>
        </>
      ) : (
        <p className="muted">No parser error.</p>
      )}
    </section>
  );
}
