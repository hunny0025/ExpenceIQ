import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartWrapper from '../charts/ChartWrapper';
import { COLORS } from '../charts/tokens';
import { 
  PieChart, TrendingUp, TrendingDown, DollarSign, 
  ArrowUpRight, ArrowDownRight, Calendar, Filter
} from 'lucide-react';
import '../dashboard.css';

// Mock Analytics Data
const monthlyTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Expenses',
      data: [12000, 19000, 15000, 22000, 18000, 25000],
      borderColor: COLORS.primary,
      backgroundColor: COLORS.primaryAlpha,
      fill: true,
    },
    {
      label: 'Income',
      data: [30000, 30000, 32000, 30000, 35000, 32000],
      borderColor: COLORS.accent,
      backgroundColor: COLORS.accentAlpha,
      fill: true,
    }
  ]
};

const categoryData = {
  labels: ['Food', 'Rent', 'Transport', 'Shopping', 'Health', 'Other'],
  datasets: [
    {
      data: [15, 45, 10, 15, 5, 10],
      backgroundColor: [
        COLORS.primary,
        COLORS.secondary,
        COLORS.accent,
        COLORS.warning,
        COLORS.danger,
        COLORS.textMuted
      ],
      borderWidth: 0,
    }
  ]
};

const weeklyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'This Week',
      data: [450, 1200, 800, 2100, 1500, 3200, 1100],
      backgroundColor: COLORS.secondary,
      borderRadius: 8,
    }
  ]
};

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, letterSpacing: '-1px' }}>
            Financial <span style={{ color: '#3b82f6' }}>Analytics</span>
          </h1>
          <p style={{ margin: '8px 0 0', color: '#6b7280', fontWeight: 600, fontSize: '15px' }}>
            Visualizing your spending patterns and financial health.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)',
              padding: '10px 18px', borderRadius: '14px', color: '#f3f4f6',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            <Calendar size={16} />
            <span>Last 6 Months</span>
          </button>
          <button 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)',
              padding: '10px 18px', borderRadius: '14px', color: '#f3f4f6',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Analytics Insights */}
      <div className="analytics-summary">
        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontWeight: 700 }}>MONTHLY SAVINGS</p>
            <h4 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 900 }}>₹7,000 <span style={{ fontSize: '12px', color: '#10b981' }}>+12%</span></h4>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}>
            <TrendingDown size={20} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontWeight: 700 }}>HIGHEST SPEND</p>
            <h4 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 900 }}>Rent <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>(45%)</span></h4>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <DollarSign size={20} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontWeight: 700 }}>DAILY AVG</p>
            <h4 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 900 }}>₹833 <span style={{ fontSize: '12px', color: '#f43f5e' }}>-2%</span></h4>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="analytics-charts">
        <ChartWrapper 
          type="line"
          title="Cash Flow Trend"
          subtitle="Monthly Income vs Expenses"
          data={monthlyTrendData}
          height={320}
        />
        <ChartWrapper 
          type="doughnut"
          title="Category Distribution"
          subtitle="Spending by category"
          data={categoryData}
          height={320}
          options={{
            plugins: {
              legend: { position: 'bottom', align: 'center' }
            },
            cutout: '70%'
          }}
        />
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div className="analytics-card" style={{ minHeight: 'auto', padding: '32px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Spending Insights</h3>
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.1)', color: '#a78bfa' }}>
                <ArrowUpRight size={18} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Unusual Shopping Spike</p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>Your shopping spend is 25% higher than last month.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
                <ArrowDownRight size={18} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Food Savings</p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>You saved ₹1,200 on dining out this week. Great job!</p>
              </div>
            </div>
          </div>
        </div>
        
        <ChartWrapper 
          type="bar"
          title="Weekly Activity"
          subtitle="Spending per day"
          data={weeklyData}
          height={260}
        />
      </div>
    </DashboardLayout>
  );
}
