import { useState } from 'react';
import { ChartWrapper, buildLineOptions, buildBarOptions, COLORS } from './charts';
import { CategoryTag, AmountBadge, DateRangePicker, Tooltip } from './components/ui';
import type { ChartData } from 'chart.js';

// ── Demo data ──────────────────────────────────────────────────────────────────
const lineData: ChartData<'line'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Income',
      data:  [3200, 4100, 3800, 5200, 4700, 6100],
      borderColor:     COLORS.accent,
      backgroundColor: COLORS.accentAlpha,
      fill: true,
    },
    {
      label: 'Expenses',
      data:  [2100, 2800, 3100, 2600, 3200, 2900],
      borderColor:     COLORS.danger,
      backgroundColor: COLORS.dangerAlpha,
      fill: true,
    },
  ],
};

const barData: ChartData<'bar'> = {
  labels: ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Utilities'],
  datasets: [
    {
      label: 'Spending',
      data:  [540, 210, 820, 160, 380, 290],
      backgroundColor: [
        COLORS.warning,
        COLORS.secondary,
        COLORS.primary,
        COLORS.accent,
        COLORS.danger,
        COLORS.info,
      ],
      borderRadius: 6,
    },
  ],
};

export default function App() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate,   setEndDate]   = useState<Date | null>(null);

  const handleDateChange = (s: Date | null, e: Date | null) => {
    setStartDate(s);
    setEndDate(e);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', padding: '2rem', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Page heading */}
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f9fafb', margin: 0 }}>
          ExpenceIQ{' '}
          <span style={{ background: 'linear-gradient(90deg,#7c3aed,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Component Library
          </span>
        </h1>
        <p style={{ color: '#6b7280', marginTop: '0.4rem', fontSize: '0.875rem' }}>
          Charts · CategoryTag · AmountBadge · DateRangePicker · Tooltip
        </p>
      </header>

      {/* ── Task 1: Charts ─────────────────────────────────────────── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          Task 1 — Chart Components
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          <ChartWrapper title="Income vs Expenses" subtitle="Last 6 months" type="line" data={lineData} options={buildLineOptions()} height={260} />
          <ChartWrapper title="Spending by Category" subtitle="Current month" type="bar"  data={barData}  options={buildBarOptions()}  height={260} />
          <ChartWrapper title="Loading State"  loading={true} height={180} />
          <ChartWrapper title="Error State"    error="Failed to fetch transaction data." height={180} />
          <ChartWrapper title="Empty State"    data={{ labels: [], datasets: [] }} height={180} />
        </div>
      </section>

      {/* ── Task 2: UI Components ──────────────────────────────────── */}
      <section>
        <h2 style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          Task 2 — UI Components
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>

          {/* CategoryTag */}
          <div style={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>CategoryTag</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['food','transport','shopping','health','entertainment','utilities','housing','education','travel','other'].map(c => (
                <CategoryTag key={c} category={c} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <CategoryTag category="food" size="sm" />
              <CategoryTag category="shopping" size="sm" />
              <CategoryTag category="travel" size="sm" />
            </div>
          </div>

          {/* AmountBadge */}
          <div style={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>AmountBadge</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <AmountBadge value={4200}  currency="USD" />
              <AmountBadge value={-1350} currency="USD" />
              <AmountBadge value={0}     currency="USD" />
              <AmountBadge value={99.99} currency="EUR" locale="de-DE" />
              <AmountBadge value={4200}  size="sm" />
              <AmountBadge value={-1350} size="sm" />
              <AmountBadge value={4200}  size="lg" />
            </div>
          </div>

          {/* DateRangePicker */}
          <div style={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>DateRangePicker</p>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              placeholder="Pick a date range…"
            />
            {startDate && endDate && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#10b981' }}>
                ✓ {startDate.toLocaleDateString()} → {endDate.toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Tooltip */}
          <div style={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>Tooltip</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              {(['top','bottom','left','right'] as const).map((placement) => (
                <Tooltip key={placement} content={`${placement} tooltip — hover active!`} placement={placement}>
                  <button style={{ padding: '0.4rem 0.85rem', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '0.5rem', color: '#a78bfa', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit' }}>
                    {placement}
                  </button>
                </Tooltip>
              ))}
              <Tooltip content={<span>Supports <strong>rich</strong> content &amp; line wrapping for longer descriptions.</span>} maxWidth={180}>
                <span style={{ color: '#38bdf8', fontSize: '0.85rem', borderBottom: '1px dashed rgba(56,189,248,0.4)', cursor: 'help' }}>
                  rich content ℹ
                </span>
              </Tooltip>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
