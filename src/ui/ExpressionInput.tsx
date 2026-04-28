type ExpressionInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ExpressionInput({ value, onChange }: ExpressionInputProps) {
  return (
    <section className="panel input-panel" aria-labelledby="expression-label">
      <label id="expression-label" className="field-label" htmlFor="expression">
        Expression
      </label>
      <textarea
        id="expression"
        className="expression-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
      />
    </section>
  );
}
