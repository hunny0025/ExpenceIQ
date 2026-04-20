/**
 * sampleData.js
 *
 * Demo datasets for the ChartWrapper example page.
 * Replace with real API data in production.
 */

import { COLORS } from '../charts/tokens';

// ─── Monthly spending – Line chart ──────────────────────────────────────────
export const monthlySpendingData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Expenses',
      data: [1200, 980, 1450, 1100, 1780, 1350, 2100, 1650, 1900, 1400, 2200, 1800],
      borderColor: COLORS.primary,
      backgroundColor: COLORS.primaryAlpha,
      fill: true,
      pointBackgroundColor: COLORS.primary,
    },
    {
      label: 'Income',
      data: [3000, 3000, 3200, 3000, 3500, 3200, 3800, 3500, 3600, 3200, 4000, 3800],
      borderColor: COLORS.accent,
      backgroundColor: COLORS.accentAlpha,
      fill: true,
      pointBackgroundColor: COLORS.accent,
    },
  ],
};

// ─── Category breakdown – Bar chart ─────────────────────────────────────────
export const categoryBreakdownData = {
  labels: ['Food', 'Rent', 'Transport', 'Shopping', 'Health', 'Entertainment'],
  datasets: [
    {
      label: 'This Month',
      data: [420, 1200, 180, 340, 95, 215],
      backgroundColor: [
        COLORS.primary,
        COLORS.secondary,
        COLORS.accent,
        COLORS.success,
        COLORS.warning,
        COLORS.danger,
      ],
      borderWidth: 0,
    },
  ],
};

// ─── Q1 savings comparison – Bar chart ──────────────────────────────────────
export const savingsComparisonData = {
  labels: ['January', 'February', 'March'],
  datasets: [
    {
      label: 'Target Savings',
      data: [600, 700, 750],
      backgroundColor: COLORS.primaryAlpha,
      borderColor: COLORS.primary,
      borderWidth: 2,
    },
    {
      label: 'Actual Savings',
      data: [480, 720, 610],
      backgroundColor: COLORS.secondaryAlpha,
      borderColor: COLORS.secondary,
      borderWidth: 2,
    },
  ],
};
