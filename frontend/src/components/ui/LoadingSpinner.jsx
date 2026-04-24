export default function LoadingSpinner({ size = 'md' }) {
  return <span className={`ui-spinner ui-spinner--${size}`} aria-hidden="true" />;
}
