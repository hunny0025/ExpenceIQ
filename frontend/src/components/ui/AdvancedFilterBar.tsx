/**
 * AdvancedFilterBar.tsx
 *
 * A fully-controlled, composable filter bar for expense-tracking UIs.
 *
 * Filters:
 *   • Multi-select Category (chips with dropdown)
 *   • Amount range slider (min – max)
 *   • Date range picker (start / end)
 *   • Sort dropdown (date, amount, category)
 *
 * All filters combine into a single `FilterState` object.
 *
 * Props:
 *   filters  – the current FilterState (controlled)
 *   onChange – called with the updated FilterState on every change
 *   categories – optional list of available category strings
 *   amountBounds – optional [min, max] for the amount slider
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { CATEGORY_COLORS } from '../../charts/tokens';
import DateRangePicker from './DateRangePicker';
import './AdvancedFilterBar.css';

/* ── Types ───────────────────────────────────────────────────────── */

export type SortField = 'date' | 'amount' | 'category';
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

export interface FilterState {
  categories:  string[];
  amountMin:   number;
  amountMax:   number;
  dateStart:   Date | null;
  dateEnd:     Date | null;
  sort:        SortOption;
}

export interface AdvancedFilterBarProps {
  filters:       FilterState;
  onChange:       (next: FilterState) => void;
  /** Available categories to choose from */
  categories?:   string[];
  /** Absolute min/max bounds for the amount slider */
  amountBounds?: [number, number];
  /** Optional extra class on the root element */
  className?:    string;
}

/* ── Defaults ────────────────────────────────────────────────────── */

const DEFAULT_CATEGORIES = Object.keys(CATEGORY_COLORS);
const DEFAULT_BOUNDS: [number, number] = [0, 10_000];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'date-desc',     label: 'Date ↓  (newest)' },
  { value: 'date-asc',      label: 'Date ↑  (oldest)' },
  { value: 'amount-desc',   label: 'Amount ↓  (high → low)' },
  { value: 'amount-asc',    label: 'Amount ↑  (low → high)' },
  { value: 'category-asc',  label: 'Category  A → Z' },
  { value: 'category-desc', label: 'Category  Z → A' },
];

/* ── Helper: format currency shorthand ───────────────────────────── */
const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;

/* ── Helper: build initial (default) filter state ────────────────── */
export function createDefaultFilters(bounds: [number, number] = DEFAULT_BOUNDS): FilterState {
  return {
    categories: [],
    amountMin:  bounds[0],
    amountMax:  bounds[1],
    dateStart:  null,
    dateEnd:    null,
    sort:       { field: 'date', direction: 'desc' },
  };
}

/* ═══════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════ */

export default function AdvancedFilterBar({
  filters,
  onChange,
  categories = DEFAULT_CATEGORIES,
  amountBounds = DEFAULT_BOUNDS,
  className = '',
}: AdvancedFilterBarProps) {

  /* ── Helpers to emit partial updates ──────────────────────────── */
  const patch = useCallback(
    (partial: Partial<FilterState>) => onChange({ ...filters, ...partial }),
    [filters, onChange],
  );

  /* ────────────────────────────────────────────────────────────────
     Category multi-select
     ──────────────────────────────────────────────────────────────── */
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!catOpen) return;
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [catOpen]);

  const toggleCategory = (cat: string) => {
    const set = new Set(filters.categories);
    set.has(cat) ? set.delete(cat) : set.add(cat);
    patch({ categories: [...set] });
  };

  const removeCategory = (cat: string) => {
    patch({ categories: filters.categories.filter((c) => c !== cat) });
  };

  /* ────────────────────────────────────────────────────────────────
     Amount range (two overlapping native range inputs)
     ──────────────────────────────────────────────────────────────── */
  const [min, max] = amountBounds;

  const handleMinChange = (val: number) => {
    patch({ amountMin: Math.min(val, filters.amountMax) });
  };

  const handleMaxChange = (val: number) => {
    patch({ amountMax: Math.max(val, filters.amountMin) });
  };

  const fillLeft  = ((filters.amountMin - min) / (max - min)) * 100;
  const fillRight = ((max - filters.amountMax) / (max - min)) * 100;

  /* ────────────────────────────────────────────────────────────────
     Sort dropdown
     ──────────────────────────────────────────────────────────────── */
  const sortValue = `${filters.sort.field}-${filters.sort.direction}`;

  const handleSortChange = (val: string) => {
    const [field, direction] = val.split('-') as [SortField, SortDirection];
    patch({ sort: { field, direction } });
  };

  /* ────────────────────────────────────────────────────────────────
     Reset
     ──────────────────────────────────────────────────────────────── */
  const isDefault =
    filters.categories.length === 0 &&
    filters.amountMin === min &&
    filters.amountMax === max &&
    filters.dateStart === null &&
    filters.dateEnd === null &&
    filters.sort.field === 'date' &&
    filters.sort.direction === 'desc';

  const handleReset = () => onChange(createDefaultFilters(amountBounds));

  /* ────────────────────────────────────────────────────────────────
     Render
     ──────────────────────────────────────────────────────────────── */
  return (
    <div className={`afb-root ${className}`.trim()} id="advanced-filter-bar">

      {/* ── Category multi-select ─────────────────────────────── */}
      <div className="afb-field afb-field--grow afb-multiselect" ref={catRef}>
        <span className="afb-label">Category</span>

        <div
          className={`afb-multiselect__trigger ${catOpen ? 'afb-multiselect__trigger--open' : ''}`}
          role="listbox"
          aria-label="Filter by category"
          aria-multiselectable="true"
          tabIndex={0}
          onClick={() => setCatOpen((v) => !v)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCatOpen((v) => !v); } }}
        >
          {filters.categories.length === 0 && (
            <span className="afb-multiselect__placeholder">All categories</span>
          )}
          {filters.categories.map((cat) => {
            const colors = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.other;
            return (
              <span
                key={cat}
                className="afb-multiselect__chip"
                style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                <button
                  type="button"
                  className="afb-multiselect__chip-remove"
                  aria-label={`Remove ${cat}`}
                  onClick={(e) => { e.stopPropagation(); removeCategory(cat); }}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>

        {catOpen && (
          <div className="afb-multiselect__dropdown" role="listbox">
            {categories.map((cat) => {
              const active = filters.categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  className={`afb-multiselect__option ${active ? 'afb-multiselect__option--selected' : ''}`}
                  role="option"
                  aria-selected={active}
                  onClick={() => toggleCategory(cat)}
                >
                  <span className={`afb-multiselect__check ${active ? 'afb-multiselect__check--active' : ''}`}>
                    {active && '✓'}
                  </span>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Amount range ──────────────────────────────────────── */}
      <div className="afb-field afb-field--grow">
        <span className="afb-label">Amount Range</span>
        <div className="afb-range">
          <div className="afb-range__values">
            <span>{fmt(filters.amountMin)}</span>
            <span>{fmt(filters.amountMax)}</span>
          </div>
          <div className="afb-range__track">
            <div
              className="afb-range__fill"
              style={{ left: `${fillLeft}%`, right: `${fillRight}%` }}
            />
            <input
              type="range"
              className="afb-range__slider"
              min={min}
              max={max}
              step={10}
              value={filters.amountMin}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              aria-label="Minimum amount"
            />
            <input
              type="range"
              className="afb-range__slider"
              min={min}
              max={max}
              step={10}
              value={filters.amountMax}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              aria-label="Maximum amount"
            />
          </div>
        </div>
      </div>

      {/* ── Date range ────────────────────────────────────────── */}
      <div className="afb-field afb-field--date">
        <span className="afb-label">Date Range</span>
        <DateRangePicker
          startDate={filters.dateStart}
          endDate={filters.dateEnd}
          onChange={(s, e) => patch({ dateStart: s, dateEnd: e })}
          placeholder="Any date"
        />
      </div>

      {/* ── Sort ──────────────────────────────────────────────── */}
      <div className="afb-field" style={{ minWidth: 170 }}>
        <span className="afb-label">Sort By</span>
        <select
          className="afb-select"
          value={sortValue}
          onChange={(e) => handleSortChange(e.target.value)}
          aria-label="Sort expenses by"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* ── Reset ─────────────────────────────────────────────── */}
      {!isDefault && (
        <button
          type="button"
          className="afb-reset"
          onClick={handleReset}
          aria-label="Reset all filters"
        >
          ✕ Reset
        </button>
      )}
    </div>
  );
}
