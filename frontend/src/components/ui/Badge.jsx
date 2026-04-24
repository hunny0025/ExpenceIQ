export default function Badge({ children, variant = 'accent', className = '' }) {
  return <span className={`ui-badge ui-badge--${variant} ${className}`.trim()}>{children}</span>;
}
