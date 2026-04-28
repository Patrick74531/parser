import type { ParserError } from '../parser/errors';
import { formatErrorLocation, formatExpectedInput, getErrorGuidance } from './errorDetails';

type ErrorDisplayProps = {
  error: ParserError;
};

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  const guidance = getErrorGuidance(error);
  const expectedInput = formatExpectedInput(error);

  return (
    <section
      className="panel error-panel"
      aria-labelledby="error-title"
      aria-live="polite"
    >
      <h2 id="error-title" className="panel-title">
        Error
      </h2>
      <div className="error-summary">
        <span className="error-icon" aria-hidden="true">
          !
        </span>
        <div>
          <p id="parser-error-message" className="error-message">
            {error.message}
          </p>
          <p className="error-location-text">{formatErrorLocation(error)}</p>
        </div>
      </div>
      <p className="error-detail">{error.explanation}</p>
      {expectedInput ? (
        <p className="error-expected">
          <span className="error-expected-label">Expected</span>
          {expectedInput}
        </p>
      ) : null}
      {guidance ? (
        <p className="error-guidance">
          <span className="error-guidance-label">Tip</span>
          {guidance}
        </p>
      ) : null}
    </section>
  );
}
