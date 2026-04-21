export default function Card({ title, subtitle, className = '', children }) {
  return (
    <article className={`ui-card ${className}`.trim()}>
      {(title || subtitle) && (
        <header className="ui-card__header">
          {title ? <h3 className="ui-card__title">{title}</h3> : null}
          {subtitle ? <p className="ui-card__subtitle">{subtitle}</p> : null}
        </header>
      )}
      {children}
    </article>
  );
}
