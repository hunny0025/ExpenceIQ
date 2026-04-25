/**
 * BudgetProgressCard.tsx
 * 
 * Displays a clean, premium card with budget progress info.
 * 
 * Props:
 *   category:  Category name (e.g. "Groceries")
 *   budget:    Total budget amount
 *   spent:     Amount already spent
 *   locale?:   Locale for currency formatting (default: 'en-US')
 *   currency?: Currency string (default: 'USD')
 *   className?: Custom classes
 * 
 * Example usage:
 * <BudgetProgressCard category="Groceries" budget={500} spent={350} />
 */

import React from 'react';
import './BudgetProgressCard.css';

export interface BudgetProgressCardProps {
  category: string;
  budget: number;
  spent: number;
  locale?: string;
  currency?: string;
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
  // Edge Case Handling: Budget is 0
  let percentage = 0;
  if (budget > 0) {
    percentage = (spent / budget) * 100;
  } else if (spent > 0) {
    // If budget is 0 but we spent something, it's effectively 100% (max overage indicator)
    percentage = 100;
  }

  const isOverBudget = spent > budget;
  
  // Cap the visual progress bar width at 100% 
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Status colors based on thresholds
  // green (<70%), amber (70-90%), red (>90%)
  // Using premium shades
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
