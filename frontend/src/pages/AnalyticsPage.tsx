import { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartWrapper from '../charts/ChartWrapper';
import { buildBarOptions, buildPieOptions, buildLineOptions } from '../charts/chartConfig';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  toMonthlyBarData,
  toCategoryPieData,
  toTrendLineData,
} from '../services/analyticsTransformers';
import {
  PieChart, TrendingUp, TrendingDown, DollarSign,
  Calendar, Filter, RefreshCw,
} from 'lucide-react';
import '../dashboard.css';

// ─── Month/year selector helpers ──────────────────────────────────────────────

const now = new Date();

function monthLabel(month: number, year: number): string {
  return new Date(year, month - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data, loading, error, refetch } = useAnalytics({ month, year });

  // ── Derived chart data (memoised to avoid re-transforms on every render)
  const barData = useMemo(
    () => (data ? toMonthlyBarData(data) : undefined),
    [data],
  );
  const pieData = useMemo(
    () => (data ? toCategoryPieData(data.byCategory) : undefined),
    [data],
  );
  const lineData = useMemo(
    () => (data ? toTrendLineData(data.dailyTrend) : undefined),
    [data],
  );

  // ── Chart options (stable references)
  const barOptions = useMemo(() => buildBarOptions(), []);
  const pieOptions = useMemo(
    () => buildPieOptions({ cutout: '65%' }),
    [],
  );
  const lineOptions = useMemo(() => buildLineOptions(), []);

  // ── Previous/Next month navigation
  const goBack = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const goForward = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  // ── Insight cards (derived from summary, safe when loading/error)
  const summary = data?.summary;
  const topCategory = data?.byCategory?.[0];
  const dailyAvg =
    summary && data?.dailyTrend?.length
      ? Math.round(summary.totalExpense / data.dailyTrend.length)
      : 0;

  return (
    <DashboardLayout>
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: 900,
              letterSpacing: '-1px',
            }}
          >
            Financial <span style={{ color: '#3b82f6' }}>Analytics</span>
          </h1>
          <p
            style={{
              margin: '8px 0 0',
              color: '#6b7280',
              fontWeight: 600,
              fontSize: '15px',
            }}
          >
            Visualizing your spending patterns and financial health.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Month Navigation */}
          <button onClick={goBack} className="analytics-nav-btn" aria-label="Previous month">
            ‹
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              padding: '10px 18px',
              borderRadius: '14px',
              color: '#f3f4f6',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'default',
              minWidth: 150,
              justifyContent: 'center',
            }}
          >
            <Calendar size={16} />
            <span>{monthLabel(month, year)}</span>
          </button>
          <button onClick={goForward} className="analytics-nav-btn" aria-label="Next month">
            ›
          </button>

          {/* Refresh */}
          <button
            onClick={refetch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              padding: '10px 18px',
              borderRadius: '14px',
              color: '#f3f4f6',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            aria-label="Refresh analytics"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Insight Summary Cards ──────────────────────────────────────── */}
      <div className="analytics-summary">
        <div className="insight-card">
          <div
            className="insight-icon"
            style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
          >
            <TrendingUp size={20} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontWeight: 700 }}>
              NET SAVINGS
            </p>
            <h4 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 900 }}>
              {loading
                ? '...'
                : summary
                  ? `₹${summary.netSavings.toLocaleString('en-IN')}`
                  : '—'}
            </h4>
          </div>
        </div>

        <div className="insight-card">
          <div
            className="insight-icon"
            style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}
          >
            <TrendingDown size={20} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontWeight: 700 }}>
              TOP CATEGORY
            </p>
            <h4 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 900 }}>
              {loading
                ? '...'
                : topCategory
                  ? `${topCategory.categoryName}`
                  : '—'}
              {topCategory && summary && summary.totalExpense > 0 && (
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>
                  {' '}({Math.round((topCategory.total / summary.totalExpense) * 100)}%)
                </span>
              )}
            </h4>
          </div>
        </div>

        <div className="insight-card">
          <div
            className="insight-icon"
            style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}
          >
            <DollarSign size={20} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontWeight: 700 }}>
              DAILY AVG
            </p>
            <h4 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 900 }}>
              {loading ? '...' : `₹${dailyAvg.toLocaleString('en-IN')}`}
            </h4>
          </div>
        </div>
      </div>

      {/* ── Main Charts Row ────────────────────────────────────────────── */}
      <div className="analytics-charts">
        <ChartWrapper
          type="line"
          title="Spending Trend"
          subtitle="Daily expenses for the selected month"
          data={lineData}
          options={lineOptions}
          loading={loading}
          error={error}
          height={320}
        />
        <ChartWrapper
          type="pie"
          title="Category Distribution"
          subtitle="Spending by category"
          data={pieData}
          options={pieOptions}
          loading={loading}
          error={error}
          height={320}
        />
      </div>

      {/* ── Bottom Row ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Spending Insights Card */}
        <div className="analytics-card" style={{ minHeight: 'auto', padding: '32px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
            Spending Insights
          </h3>
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {loading ? (
              <p style={{ color: '#6b7280', fontSize: '13px' }}>Loading insights…</p>
            ) : data?.byCategory && data.byCategory.length >= 2 ? (
              <>
                <InsightRow
                  icon={<PieChart size={18} />}
                  iconBg="rgba(124, 58, 237, 0.1)"
                  iconColor="#a78bfa"
                  title={`${data.byCategory[0].categoryName} leads spending`}
                  description={`₹${data.byCategory[0].total.toLocaleString('en-IN')} across ${data.byCategory[0].count} transactions this month.`}
                />
                <InsightRow
                  icon={<TrendingDown size={18} />}
                  iconBg="rgba(16, 185, 129, 0.1)"
                  iconColor="#34d399"
                  title={`Least spent on ${data.byCategory[data.byCategory.length - 1].categoryName}`}
                  description={`Only ₹${data.byCategory[data.byCategory.length - 1].total.toLocaleString('en-IN')} — good job keeping it low!`}
                />
              </>
            ) : (
              <p style={{ color: '#6b7280', fontSize: '13px' }}>
                Not enough data to generate insights yet.
              </p>
            )}
          </div>
        </div>

        {/* Monthly income vs expense bar chart */}
        <ChartWrapper
          type="bar"
          title="Income vs Expenses"
          subtitle={monthLabel(month, year)}
          data={barData}
          options={barOptions}
          loading={loading}
          error={error}
          height={260}
        />
      </div>
    </DashboardLayout>
  );
}

// ─── Internal sub-component ─────────────────────────────────────────────────

function InsightRow({
  icon,
  iconBg,
  iconColor,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div
        style={{
          padding: '8px',
          borderRadius: '10px',
          background: iconBg,
          color: iconColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>{title}</p>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
          {description}
        </p>
      </div>
    </div>
  );
}
