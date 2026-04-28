type ResultPanelProps = {
  result?: boolean;
};

export function ResultPanel({ result }: ResultPanelProps) {
  return (
    <section className="panel output-panel" aria-labelledby="result-title">
      <h2 id="result-title" className="panel-title">
        Result
      </h2>
      {typeof result === 'boolean' ? (
        <p className="result-value">{String(result)}</p>
      ) : (
        <p className="muted">Boolean comparison result will appear here.</p>
      )}
    </section>
  );
}
