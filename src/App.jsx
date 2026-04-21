/**
 * App.jsx — ExpenseIQ Analytics Dashboard
 *
 * Demonstrates ChartWrapper with:
 *  - normal (data-loaded) state
 *  - loading state
 *  - error state
 *  - empty state
 *  - Line and Bar chart types
 */

import { useState } from 'react';
import './App.css';

import { ChartWrapper, buildLineOptions, buildBarOptions } from './charts';
import { Badge, Button, Card, Input } from './components/ui';
import {
  monthlySpendingData,
  categoryBreakdownData,
  savingsComparisonData,
} from './data/sampleData';

// ─── KPI data ────────────────────────────────────────────────────────────────
const KPIs = [
  { label: 'Total Income',   value: '$42,500', delta: '+8.4%',  dir: 'up',   emoji: '💰' },
  { label: 'Total Expenses', value: '$18,450', delta: '+3.1%',  dir: 'down', emoji: '💸' },
  { label: 'Net Savings',    value: '$24,050', delta: '+14.2%', dir: 'up',   emoji: '📈' },
  { label: 'Avg / Month',    value: '$1,537',  delta: '-2.3%',  dir: 'up',   emoji: '📅' },
];

// ─── Demo state options ──────────────────────────────────────────────────────
const STATES = ['normal', 'loading', 'error', 'empty'];

// ─── Pre-built chart options ─────────────────────────────────────────────────
const lineOpts = buildLineOptions();
const barOpts  = buildBarOptions();

// ─── Component ───────────────────────────────────────────────────────────────
export default function App() {
  const [demoState, setDemoState] = useState('normal');

  const isLoading = demoState === 'loading';
  const error     = demoState === 'error'   ? 'Failed to fetch expense data. Please try again.' : null;
  const isNormal  = demoState === 'normal';

  return (
    <div className="app">
      {/* ── Navbar ── */}
      <nav className="navbar" aria-label="Primary navigation">
        <a href="/" className="navbar__brand">
          <div className="navbar__brand-icon" aria-hidden="true">💡</div>
          ExpenseIQ
        </a>
        <Badge>Analytics</Badge>
      </nav>

      {/* ── Main ── */}
      <main className="main">

        {/* Page header */}
        <header className="page-header">
          <p className="page-header__eyebrow">Financial Overview</p>
          <h1 className="page-header__title">Expense Analytics</h1>
          <p className="page-header__desc">
            Monitor your spending patterns, track savings, and get insights
            across all expense categories — all in one place.
          </p>
        </header>

        {/* KPI strip */}
        <section aria-label="Key metrics" className="kpi-strip">
          {KPIs.map((k) => (
            <Card key={k.label} className="kpi-card">
              <p className="kpi-card__label">{k.label}</p>
              <p className="kpi-card__value">{k.value}</p>
              <p className={`kpi-card__delta kpi-card__delta--${k.dir}`}>
                {k.delta} vs last year
              </p>
              <span className="kpi-card__accent" aria-hidden="true">{k.emoji}</span>
            </Card>
          ))}
        </section>

        {/* ── Demo controls ── */}
        <div className="controls-search">
          <Input label="Quick filter" placeholder="Search category, month, or metric..." />
        </div>
        <div className="demo-controls" role="group" aria-label="Chart display state demo">
          <span className="demo-controls__label">Demo state:</span>
          {STATES.map((s) => (
            <Button
              key={s}
              id={`demo-btn-${s}`}
              variant={demoState === s ? 'secondary' : 'ghost'}
              className="demo-btn"
              onClick={() => setDemoState(s)}
              aria-pressed={demoState === s}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>

        {/* ── Full-width: Monthly Spending Line chart ── */}
        <div className="charts-grid charts-grid--full">
          <ChartWrapper
            id="monthly-spending-chart"
            type="line"
            title="Monthly Cash Flow"
            subtitle="Jan – Dec 2024"
            data={isNormal ? monthlySpendingData : (demoState === 'empty' ? null : monthlySpendingData)}
            options={lineOpts}
            loading={isLoading}
            error={error}
            height={300}
          />
        </div>

        {/* Section divider */}
        <div className="section-divider" aria-hidden="true">
          <span className="section-divider__title">Category breakdown</span>
          <div className="section-divider__line" />
        </div>

        {/* ── Half-width: Category Bar + Savings Bar ── */}
        <div className="charts-grid charts-grid--halves">
          <ChartWrapper
            id="category-breakdown-chart"
            type="bar"
            title="Spending by Category"
            subtitle="Current month"
            data={isNormal ? categoryBreakdownData : (demoState === 'empty' ? { labels: [], datasets: [] } : categoryBreakdownData)}
            options={barOpts}
            loading={isLoading}
            error={error}
            height={260}
          />

          <ChartWrapper
            id="savings-comparison-chart"
            type="bar"
            title="Savings: Target vs Actual"
            subtitle="Q1 2024"
            data={isNormal ? savingsComparisonData : (demoState === 'empty' ? { labels: [], datasets: [] } : savingsComparisonData)}
            options={buildBarOptions({ indexAxis: 'y' })}
            loading={isLoading}
            error={error}
            height={260}
          />
        </div>

      </main>
    </div>
  );
}
