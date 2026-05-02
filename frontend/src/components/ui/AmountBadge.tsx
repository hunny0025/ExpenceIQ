/**
 * AmountBadge — displays a monetary value with colour-coded semantics.
 *
 * | Value    | Colour  | Arrow |
 * |----------|---------|-------|
 * | Positive | Green   | ▲     |
 * | Negative | Red     | ▼     |
 * | Zero     | Muted   | —     |
 *
 * @example
 * ```tsx
 * <AmountBadge value={120.50} />
 * <AmountBadge value={-45} currency="EUR" locale="de-DE" size="lg" />
 * <AmountBadge value={0} showSign={false} />
 * ```
 */

import type { CSSProperties } from 'react';

/** Props for the {@link AmountBadge} component. */
export interface AmountBadgeProps {
  /** Monetary value. Positive → income (green), negative → expense (red). */
  value: number;
  /**
   * ISO 4217 currency code.
   * @default "USD"
   */
  currency?: string;
  /**
   * BCP 47 locale for number formatting.
   * @default "en-US"
   */
  locale?: string;
  /**
   * Size variant.
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether to prefix the value with `+` or `−`.
   * @default true
   */
  showSign?: boolean;
  /** Extra CSS class on the root `<span>`. */
  className?: string;
}

const SIZE_MAP = {
  sm: { fontSize: '0.75rem',  padding: '0.15rem 0.5rem',  gap: '0.2rem'  },
  md: { fontSize: '0.875rem', padding: '0.25rem 0.65rem', gap: '0.25rem' },
  lg: { fontSize: '1.05rem',  padding: '0.3rem 0.85rem',  gap: '0.3rem'  },
};

export default function AmountBadge({
  value,
  currency  = 'USD',
  locale    = 'en-US',
  size      = 'md',
  showSign  = true,
  className = '',
}: AmountBadgeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isZero     = value === 0;

  const color =
    isPositive ? '#10B981' :
    isNegative ? '#F43F5E' :
    '#9CA3AF';

  const bgColor =
    isPositive ? 'rgba(16,185,129,0.12)' :
    isNegative ? 'rgba(244,63,94,0.12)'  :
    'rgba(156,163,175,0.10)';

  const borderColor =
    isPositive ? 'rgba(16,185,129,0.25)' :
    isNegative ? 'rgba(244,63,94,0.25)'  :
    'rgba(156,163,175,0.20)';

  const formatted = new Intl.NumberFormat(locale, {
    style:    'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));

  const arrow  = isPositive ? '▲' : isNegative ? '▼' : '—';
  const prefix =
    isZero  ? '' :
    showSign
      ? (isPositive ? '+' : '−')
      : '';

  const { fontSize, padding, gap } = SIZE_MAP[size];

  const style: CSSProperties = {
    display:         'inline-flex',
    alignItems:      'center',
    gap,
    padding,
    borderRadius:    '9999px',
    fontSize,
    fontWeight:      600,
    fontFamily:      "'Inter', system-ui, sans-serif",
    fontVariantNumeric: 'tabular-nums',
    letterSpacing:   '0.01em',
    backgroundColor: bgColor,
    color,
    border:          `1px solid ${borderColor}`,
    whiteSpace:      'nowrap',
    userSelect:      'none',
    transition:      'opacity 0.15s ease',
  };

  return (
    <span style={style} className={className} aria-label={`${isPositive ? 'Income' : 'Expense'}: ${formatted}`}>
      {!isZero && (
        <span aria-hidden="true" style={{ fontSize: '0.65em', lineHeight: 1 }}>
          {arrow}
        </span>
      )}
      {prefix}{formatted}
    </span>
  );
}
