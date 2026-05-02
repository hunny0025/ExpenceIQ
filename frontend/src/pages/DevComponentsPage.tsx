/**
 * DevComponentsPage — developer showcase of all reusable UI components.
 *
 * Accessible at `/dev/components`. Renders each component with live
 * examples, inline code snippets, and a props table.
 *
 * **Not** behind ProtectedRoute — available without login for easy
 * review during development.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// UI components
import {
  CategoryTag,
  AmountBadge,
  Tooltip,
  BudgetProgressCard,
  NotificationBell,
} from '../components/ui';
import ExportButton from '../components/ui/ExportButton';
import Modal from '../components/ui/Modal';

// Charts
import { ChartWrapper, buildLineOptions, buildBarOptions, buildPieOptions } from '../charts';

import './DevComponentsPage.css';

// ── Mock data ─────────────────────────────────────────────────────────────────

const SAMPLE_LINE_DATA = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Spending',
      data: [120, 85, null, 200, 65, undefined, 180],
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124,58,237,0.18)',
      fill: true,
    },
  ],
};

const SAMPLE_BAR_DATA = {
  labels: ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment'],
  datasets: [
    {
      label: 'Budget Used',
      data: [350, 120, 280, 90, 150],
      backgroundColor: [
        'rgba(245,158,11,0.6)',
        'rgba(14,165,233,0.6)',
        'rgba(124,58,237,0.6)',
        'rgba(16,185,129,0.6)',
        'rgba(244,63,94,0.6)',
      ],
      borderRadius: 6,
    },
  ],
};

const SAMPLE_PIE_DATA = {
  labels: ['Food', 'Transport', 'Shopping', 'Other'],
  datasets: [
    {
      data: [35, 20, 30, 15],
      backgroundColor: ['#F59E0B', '#0EA5E9', '#7C3AED', '#9CA3AF'],
      borderWidth: 0,
    },
  ],
};

const EMPTY_DATA = { labels: [], datasets: [] };

const EXPORT_SAMPLE = [
  { date: '2026-04-01', category: 'Food', amount: 42.5 },
  { date: '2026-04-02', category: 'Transport', amount: 15 },
  { date: '2026-04-03', category: 'Shopping', amount: 89.99 },
];

// ── Helper: code snippet renderer ─────────────────────────────────────────────

function Code({ children }: { children: string }) {
  return (
    <div className="dev-code">
      <pre>{children}</pre>
    </div>
  );
}

/** Props table row */
interface PropRow {
  name: string;
  type: string;
  def: string;
  desc: string;
}

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <table className="dev-props-table">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td>{r.name}</td>
            <td>{r.type}</td>
            <td>{r.def}</td>
            <td>{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Page component ────────────────────────────────────────────────────────────

export default function DevComponentsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="dev-page">
      <div className="dev-page__header">
        <Link to="/dashboard" className="dev-page__back">
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
        <h1 className="dev-page__title">Component Library</h1>
        <p className="dev-page__subtitle">
          Live showcase of all reusable UI components · ExpenceIQ Design System
        </p>
      </div>

      <div className="dev-sections">

        {/* ──────────────────────────────────────────────────────────
            CategoryTag
           ────────────────────────────────────────────────────────── */}
        <section className="dev-section" id="dev-category-tag">
          <div className="dev-section__header">
            <h2 className="dev-section__name">CategoryTag</h2>
            <p className="dev-section__desc">
              Pill-style label with colour-coded icon per expense category.
            </p>
          </div>
          <div className="dev-section__body">
            <div className="dev-preview-row">
              {['food', 'transport', 'shopping', 'health', 'entertainment', 'utilities', 'housing', 'education', 'travel', 'other'].map((cat) => (
                <CategoryTag key={cat} category={cat} />
              ))}
            </div>
            <div className="dev-preview-row" style={{ marginTop: 12 }}>
              <CategoryTag category="food" size="sm" />
              <CategoryTag category="transport" size="sm" />
              <CategoryTag category="shopping" size="sm" />
            </div>
            <Code>{`<CategoryTag category="food" />\n<CategoryTag category="transport" size="sm" />`}</Code>
            <PropsTable rows={[
              { name: 'category', type: 'string', def: '—', desc: 'Category key (case-insensitive)' },
              { name: 'size', type: '"sm" | "md"', def: '"md"', desc: 'Size variant' },
              { name: 'className', type: 'string', def: '""', desc: 'Extra CSS class' },
            ]} />
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            AmountBadge
           ────────────────────────────────────────────────────────── */}
        <section className="dev-section" id="dev-amount-badge">
          <div className="dev-section__header">
            <h2 className="dev-section__name">AmountBadge</h2>
            <p className="dev-section__desc">
              Colour-coded monetary value — green for income, red for expense, muted for zero.
            </p>
          </div>
          <div className="dev-section__body">
            <div className="dev-preview-row">
              <AmountBadge value={1250.75} />
              <AmountBadge value={-89.99} />
              <AmountBadge value={0} />
              <AmountBadge value={500} size="sm" />
              <AmountBadge value={-25} size="lg" currency="EUR" locale="de-DE" />
            </div>
            <Code>{`<AmountBadge value={1250.75} />\n<AmountBadge value={-89.99} />\n<AmountBadge value={0} />\n<AmountBadge value={-25} size="lg" currency="EUR" locale="de-DE" />`}</Code>
            <PropsTable rows={[
              { name: 'value', type: 'number', def: '—', desc: 'Monetary value (+/−)' },
              { name: 'currency', type: 'string', def: '"USD"', desc: 'ISO 4217 currency code' },
              { name: 'locale', type: 'string', def: '"en-US"', desc: 'BCP 47 locale' },
              { name: 'size', type: '"sm" | "md" | "lg"', def: '"md"', desc: 'Size variant' },
              { name: 'showSign', type: 'boolean', def: 'true', desc: 'Show +/− prefix' },
            ]} />
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            Tooltip
           ────────────────────────────────────────────────────────── */}
        <section className="dev-section" id="dev-tooltip">
          <div className="dev-section__header">
            <h2 className="dev-section__name">Tooltip</h2>
            <p className="dev-section__desc">
              Accessible hover/focus tooltip with configurable placement and delay.
            </p>
          </div>
          <div className="dev-section__body">
            <div className="dev-preview-row">
              <Tooltip content="Top tooltip (default)" placement="top">
                <button style={pillBtnStyle}>Hover me (top)</button>
              </Tooltip>
              <Tooltip content="Bottom tooltip" placement="bottom">
                <button style={pillBtnStyle}>Hover me (bottom)</button>
              </Tooltip>
              <Tooltip content="Left tooltip" placement="left">
                <button style={pillBtnStyle}>Hover me (left)</button>
              </Tooltip>
              <Tooltip content="Right tooltip" placement="right">
                <button style={pillBtnStyle}>Hover me (right)</button>
              </Tooltip>
            </div>
            <Code>{`<Tooltip content="Top tooltip" placement="top">\n  <button>Hover me</button>\n</Tooltip>`}</Code>
            <PropsTable rows={[
              { name: 'content', type: 'ReactNode', def: '—', desc: 'Tooltip content' },
              { name: 'placement', type: '"top" | "bottom" | "left" | "right"', def: '"top"', desc: 'Position relative to trigger' },
              { name: 'delay', type: 'number', def: '200', desc: 'ms before showing' },
              { name: 'maxWidth', type: 'number', def: '220', desc: 'Max width in px' },
              { name: 'children', type: 'ReactNode', def: '—', desc: 'Trigger element' },
            ]} />
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            BudgetProgressCard
           ────────────────────────────────────────────────────────── */}
        <section className="dev-section" id="dev-budget-progress">
          <div className="dev-section__header">
            <h2 className="dev-section__name">BudgetProgressCard</h2>
            <p className="dev-section__desc">
              Colour-coded progress bar: green (&lt;70%), amber (70–90%), red (&gt;90%).
            </p>
          </div>
          <div className="dev-section__body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              <BudgetProgressCard category="Groceries" budget={500} spent={250} />
              <BudgetProgressCard category="Transport" budget={200} spent={160} />
              <BudgetProgressCard category="Dining" budget={300} spent={310} />
              <BudgetProgressCard category="Entertainment" budget={0} spent={50} />
            </div>
            <Code>{`<BudgetProgressCard category="Groceries" budget={500} spent={250} />\n<BudgetProgressCard category="Dining" budget={300} spent={310} />`}</Code>
            <PropsTable rows={[
              { name: 'category', type: 'string', def: '—', desc: 'Category name' },
              { name: 'budget', type: 'number', def: '—', desc: 'Total budget' },
              { name: 'spent', type: 'number', def: '—', desc: 'Amount spent' },
              { name: 'locale', type: 'string', def: '"en-US"', desc: 'Locale for formatting' },
              { name: 'currency', type: 'string', def: '"USD"', desc: 'Currency code' },
            ]} />
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            NotificationBell
           ────────────────────────────────────────────────────────── */}
        <section className="dev-section" id="dev-notification-bell">
          <div className="dev-section__header">
            <h2 className="dev-section__name">NotificationBell</h2>
            <p className="dev-section__desc">
              Bell icon with unread badge, dropdown list, and mark-as-read.
              Fetches from API — will show error/empty state here (expected in dev).
            </p>
          </div>
          <div className="dev-section__body">
            <div className="dev-preview-row">
              <NotificationBell />
              <NotificationBell maxBadge={99} />
            </div>
            <Code>{`<NotificationBell />\n<NotificationBell maxBadge={99} />`}</Code>
            <PropsTable rows={[
              { name: 'maxBadge', type: 'number', def: '9', desc: 'Max count before "N+"' },
            ]} />
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            Modal
           ────────────────────────────────────────────────────────── */}
        <section className="dev-section" id="dev-modal">
          <div className="dev-section__header">
            <h2 className="dev-section__name">Modal</h2>
            <p className="dev-section__desc">
              Centred overlay dialog with title bar and close button.
            </p>
          </div>
          <div className="dev-section__body">
            <button style={pillBtnStyle} onClick={() => setModalOpen(true)}>
              Open Modal
            </button>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal">
              <p style={{ color: '#9ca3af', fontSize: 14 }}>
                This is the modal body. It supports any React children.
              </p>
            </Modal>
            <Code>{`<Modal isOpen={open} onClose={() => setOpen(false)} title="Title">\n  <p>Body content</p>\n</Modal>`}</Code>
            <PropsTable rows={[
              { name: 'isOpen', type: 'boolean', def: '—', desc: 'Visibility state' },
              { name: 'onClose', type: '() => void', def: '—', desc: 'Close callback' },
              { name: 'title', type: 'string', def: '—', desc: 'Header heading text' },
              { name: 'children', type: 'ReactNode', def: '—', desc: 'Body content' },
            ]} />
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            ExportButton
           ────────────────────────────────────────────────────────── */}
        <section className="dev-section" id="dev-export-button">
          <div className="dev-section__header">
            <h2 className="dev-section__name">ExportButton</h2>
            <p className="dev-section__desc">
              Downloads data as a CSV file with auto-generated filename.
            </p>
          </div>
          <div className="dev-section__body">
            <div className="dev-preview-row">
              <ExportButton data={EXPORT_SAMPLE} filenamePrefix="demo" />
              <ExportButton data={[]} buttonText="No Data" />
            </div>
            <Code>{`<ExportButton data={expenses} filenamePrefix="report" />`}</Code>
            <PropsTable rows={[
              { name: 'data', type: 'T[]', def: '—', desc: 'Rows to export' },
              { name: 'dateRange', type: 'DateRange | string', def: '—', desc: 'For filename' },
              { name: 'filenamePrefix', type: 'string', def: '"expenses"', desc: 'CSV filename prefix' },
              { name: 'buttonText', type: 'string', def: '"Export to CSV"', desc: 'Button label' },
            ]} />
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            ChartWrapper — Line
           ────────────────────────────────────────────────────────── */}
        <section className="dev-section" id="dev-chart-line">
          <div className="dev-section__header">
            <h2 className="dev-section__name">ChartWrapper — Line</h2>
            <p className="dev-section__desc">
              Line chart with data containing null/undefined values (sanitised automatically).
            </p>
          </div>
          <div className="dev-section__body">
            <ChartWrapper
              type="line"
              data={SAMPLE_LINE_DATA}
              options={buildLineOptions()}
              title="Weekly Spending"
              subtitle="With null/undefined data points → auto-replaced with 0"
              height={250}
            />
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            ChartWrapper — Bar
           ────────────────────────────────────────────────────────── */}
        <section className="dev-section" id="dev-chart-bar">
          <div className="dev-section__header">
            <h2 className="dev-section__name">ChartWrapper — Bar</h2>
            <p className="dev-section__desc">
              Bar chart for category breakdown.
            </p>
          </div>
          <div className="dev-section__body">
            <ChartWrapper
              type="bar"
              data={SAMPLE_BAR_DATA}
              options={buildBarOptions()}
              title="Budget by Category"
              height={250}
            />
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            ChartWrapper — Pie
           ────────────────────────────────────────────────────────── */}
        <section className="dev-section" id="dev-chart-pie">
          <div className="dev-section__header">
            <h2 className="dev-section__name">ChartWrapper — Pie</h2>
            <p className="dev-section__desc">
              Pie chart for proportion view.
            </p>
          </div>
          <div className="dev-section__body">
            <ChartWrapper
              type="pie"
              data={SAMPLE_PIE_DATA}
              options={buildPieOptions()}
              title="Category Split"
              height={280}
            />
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            ChartWrapper — States
           ────────────────────────────────────────────────────────── */}
        <section className="dev-section" id="dev-chart-states">
          <div className="dev-section__header">
            <h2 className="dev-section__name">ChartWrapper — States</h2>
            <p className="dev-section__desc">
              Loading, error, and empty states rendered by ChartWrapper.
            </p>
          </div>
          <div className="dev-section__body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              <ChartWrapper title="Loading" loading={true} />
              <ChartWrapper title="Error" error="Failed to fetch analytics data" />
              <ChartWrapper title="Empty" data={EMPTY_DATA} />
            </div>
            <Code>{`<ChartWrapper loading={true} />\n<ChartWrapper error="Failed to fetch" />\n<ChartWrapper data={{ labels: [], datasets: [] }} />`}</Code>
          </div>
        </section>

      </div>
    </div>
  );
}

// ── Shared demo styles ────────────────────────────────────────────────────────

const pillBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '10px 20px',
  color: '#9ca3af',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
};
