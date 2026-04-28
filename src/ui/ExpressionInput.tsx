import { useEffect, useMemo } from 'react';
import { DEBUG_PARSER } from '../parser/debug';
import type { ParserError } from '../parser/errors';
import type { ExampleExpression } from './assignmentExamples';
import { buildErrorHighlight } from './errorHighlight';

type ExpressionInputProps = {
  value: string;
  error: ParserError | null;
  examples: ExampleExpression[];
  onChange: (value: string) => void;
};

const customExampleValue = 'custom';

export function ExpressionInput({ value, error, examples, onChange }: ExpressionInputProps) {
  const highlight = useMemo(() => (error ? buildErrorHighlight(value, error) : null), [error, value]);
  const selectedExampleId =
    examples.find((example) => example.expression === value)?.id ?? customExampleValue;
  const describedBy = error ? 'parser-error-message error-location-preview' : undefined;

  useEffect(() => {
    if (!import.meta.env.DEV || !DEBUG_PARSER || !highlight) {
      return;
    }

    console.debug('Error highlight:', {
      inputLength: value.length,
      errorIndex: error?.index,
      isEndOfInput: highlight.isEndOfInput
    });
  }, [error?.index, highlight, value.length]);

  function handleExampleChange(exampleId: string): void {
    const selectedExample = examples.find((example) => example.id === exampleId);

    if (selectedExample) {
      onChange(selectedExample.expression);
    }
  }

  return (
    <section className="panel input-panel" aria-labelledby="input-title">
      <div className="input-toolbar">
        <h2 id="input-title" className="panel-title">
          Input
        </h2>
        <div className="example-control">
          <label className="field-label" htmlFor="example-select">
            Examples
          </label>
          <select
            id="example-select"
            className="example-select"
            value={selectedExampleId}
            onChange={(event) => handleExampleChange(event.target.value)}
          >
            <option
              value={customExampleValue}
              disabled={selectedExampleId !== customExampleValue}
            >
              Custom expression
            </option>
            {examples.map((example) => (
              <option key={example.id} value={example.id}>
                {example.expression} -&gt; {example.expected}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="expression-field">
        <label id="expression-label" className="field-label" htmlFor="expression">
          Expression
        </label>
        <textarea
          id="expression"
          className="expression-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          spellCheck={false}
        />
      </div>
      {highlight ? (
        <div
          id="error-location-preview"
          className="highlight-preview"
          aria-label="Error location preview"
        >
          <span className="line-badge">Line {highlight.lineNumber}</span>
          <code className="highlight-line">
            <span>{highlight.before}</span>
            {highlight.isEndOfInput ? (
              <span className="error-caret" aria-label="Unexpected end of input" />
            ) : (
              <span className="error-token">{highlight.marker}</span>
            )}
            <span>{highlight.after}</span>
          </code>
        </div>
      ) : null}
    </section>
  );
}
