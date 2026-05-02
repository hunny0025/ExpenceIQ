/**
 * BudgetProgressCard — displays a category's spending vs. budget with a
 * colour-coded progress bar.
 *
 * | % Spent | Colour |
 * |---------|--------|
 * | < 70%   | Green  |
 * | 70–90%  | Amber  |
 * | > 90%   | Red    |
 *
 * Handles edge cases: zero budget, over-budget spending, and negative values.
 *
 * @example
 * ```tsx
 * <BudgetProgressCard category="Groceries" budget={500} spent={350} />
 * <BudgetProgressCard category="Transport" budget={200} spent={250} currency="EUR" />
 * ```
 */

import './BudgetProgressCard.css';

/** Props for the {@link BudgetProgressCard} component. */
export interface BudgetProgressCardProps {
  /** Category name displayed in the card heading. */
  category: string;
  /** Total budget amount. */
  budget: number;
  /** Amount already spent. */
  spent: number;
  /**
   * BCP 47 locale for currency formatting.
   * @default "en-US"
   */
  locale?: string;
  /**
   * ISO 4217 currency code.
   * @default "USD"
   */
  currency?: string;
  /** Extra CSS class on the root card element. */
  className?: string;
}

export default function BudgetProgressCard({
  category,
  budget,
  spent,
  locale = 'en-US',
  currency = 'USD',
  className = ''
}: BudgetProgressCardProps) {
  let percentage = 0;
  if (budget > 0) {
    percentage = (spent / budget) * 100;
  } else if (spent > 0) {
    percentage = 100;
  }

  const isOverBudget = spent > budget;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  let fillGradient = 'linear-gradient(90deg, #10B981, #059669)'; // emerald
  if (percentage >= 90 || budget === 0) {
    fillGradient = 'linear-gradient(90deg, #F43F5E, #E11D48)'; // rose
  } else if (percentage >= 70) {
    fillGradient = 'linear-gradient(90deg, #F59E0B, #D97706)'; // amber
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const remainingText = isOverBudget
    ? `${formatCurrency(Math.abs(spent - budget))} over budget`
    : `${formatCurrency(budget - Math.abs(spent))} left`;

  return (
    <div className={`card-container ${className}`}>
      <div className="header">
        <h3 className="category">{category}</h3>
        <div className="amounts">
          <span className={`spent ${isOverBudget ? 'over-budget' : ''}`}>
            {formatCurrency(spent)}
          </span>
          <span style={{ margin: '0 4px', color: '#9CA3AF' }}>/</span>
          <span>{formatCurrency(budget)}</span>
        </div>
      </div>

      <div className="track" role="progressbar" aria-valuenow={clampedPercentage} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="fill"
          style={{
            width: `${clampedPercentage}%`,
            background: fillGradient
          }}
        />
      </div>

      <div className="footer">
        <span>{percentage.toFixed(1)}% spent</span>
        <span className={`remaining ${isOverBudget ? 'over-budget' : ''}`}>
          {remainingText}
        </span>
      </div>
    </div>
  );
}
