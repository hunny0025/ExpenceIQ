export default function Input({ label, id, className = '', ...props }) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`;

  return (
    <div className={`ui-input-wrap ${className}`.trim()}>
      {label ? (
        <label htmlFor={inputId} className="ui-input__label">
          {label}
        </label>
      ) : null}
      <input id={inputId} className="ui-input" {...props} />
    </div>
  );
}
