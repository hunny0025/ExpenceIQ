// Public API for the UI component library

// ── Legacy JS components ──────────────────────────────────────────────────────
export { default as Badge }            from './Badge';
export { default as Button }           from './Button';
export { default as Card }             from './Card';
export { default as Input }            from './Input';
export { default as LoadingSpinner }   from './LoadingSpinner';

// ── TypeScript components ─────────────────────────────────────────────────────
export { default as CategoryTag }      from './CategoryTag';
export type { CategoryTagProps }       from './CategoryTag';

export { default as AmountBadge }      from './AmountBadge';
export type { AmountBadgeProps }       from './AmountBadge';

export { default as DateRangePicker }  from './DateRangePicker';
export type { DateRangePickerProps }   from './DateRangePicker';

export { default as Tooltip }          from './Tooltip';
export type { TooltipProps, TooltipPlacement } from './Tooltip';

export { default as AdvancedFilterBar, createDefaultFilters } from './AdvancedFilterBar';
export type {
  AdvancedFilterBarProps,
  FilterState,
  SortOption,
  SortField,
  SortDirection,
} from './AdvancedFilterBar';

export { default as BudgetProgressCard } from './BudgetProgressCard';
export type { BudgetProgressCardProps }  from './BudgetProgressCard';

export { default as NotificationBell }   from './NotificationBell';
export type { NotificationBellProps }    from './NotificationBell';

export { default as Modal }              from './Modal';
export type { ModalProps }               from './Modal';

export { default as ExportButton }       from './ExportButton';
export type { ExportButtonProps }        from './ExportButton';

export { default as MonthlyCalendarHeatmap } from './MonthlyCalendarHeatmap';
export type { MonthlyCalendarHeatmapProps, HeatmapData } from './MonthlyCalendarHeatmap';
