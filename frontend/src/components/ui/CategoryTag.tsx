/**
 * CategoryTag — a pill-style label that maps a category string to a
 * distinctive colour and emoji icon.
 *
 * Falls back gracefully for unknown categories using the "other" palette.
 *
 * @example
 * ```tsx
 * <CategoryTag category="food" />
 * <CategoryTag category="transport" size="sm" />
 * ```
 */

import type { CSSProperties } from 'react';
import { CATEGORY_COLORS } from '../../charts/tokens';

/** Props for the {@link CategoryTag} component. */
export interface CategoryTagProps {
  /** Category key (case-insensitive), e.g. `"food"`, `"transport"`. */
  category: string;
  /**
   * Size variant.
   * @default "md"
   */
  size?: 'sm' | 'md';
  /** Extra CSS class on the root `<span>`. */
  className?: string;
}

/** Category key → emoji icon mapping. */
const CATEGORY_ICONS: Record<string, string> = {
  food:          '🍽️',
  transport:     '🚗',
  shopping:      '🛍️',
  health:        '💊',
  entertainment: '🎬',
  utilities:     '⚡',
  housing:       '🏠',
  education:     '📚',
  travel:        '✈️',
  other:         '📦',
};

export default function CategoryTag({ category, size = 'md', className = '' }: CategoryTagProps) {
  const key    = category.toLowerCase();
  const colors = CATEGORY_COLORS[key] ?? CATEGORY_COLORS.other;
  const icon   = CATEGORY_ICONS[key]  ?? '📦';
  const label  = category.charAt(0).toUpperCase() + category.slice(1);

  const style: CSSProperties = {
    display:         'inline-flex',
    alignItems:      'center',
    gap:             size === 'sm' ? '0.25rem' : '0.375rem',
    padding:         size === 'sm' ? '0.2rem 0.55rem' : '0.3rem 0.75rem',
    borderRadius:    '9999px',
    fontSize:        size === 'sm' ? '0.7rem' : '0.78rem',
    fontWeight:      500,
    fontFamily:      "'Inter', system-ui, sans-serif",
    letterSpacing:   '0.01em',
    backgroundColor: colors.bg,
    color:           colors.text,
    border:          `1px solid ${colors.border}`,
    whiteSpace:      'nowrap',
    userSelect:      'none',
    transition:      'opacity 0.15s ease',
  };

  return (
    <span style={style} className={className} title={label}>
      <span aria-hidden="true" style={{ lineHeight: 1, fontSize: size === 'sm' ? '0.75rem' : '0.875rem' }}>
        {icon}
      </span>
      {label}
    </span>
  );
}
