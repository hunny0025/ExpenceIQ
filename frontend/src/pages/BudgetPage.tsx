import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Target, TrendingUp, AlertCircle, Plus, Edit2, 
  Pizza, Car, Home, ShoppingBag, Heart, Film, Zap, Package
} from 'lucide-react';
import '../dashboard.css';

// Mock Budget Data
const MOCK_BUDGETS = [
  { id: 1, category: 'Food', limit: 8000, spent: 5350, icon: Pizza, color: '#fb7185' },
  { id: 2, category: 'Rent', limit: 25000, spent: 25000, icon: Home, color: '#a78bfa' },
  { id: 3, category: 'Transport', limit: 3000, spent: 1200, icon: Car, color: '#60a5fa' },
  { id: 4, category: 'Shopping', limit: 10000, spent: 8900, icon: ShoppingBag, color: '#34d399' },
  { id: 5, category: 'Health', limit: 2000, spent: 1200, icon: Heart, color: '#fbbf24' },
  { id: 6, category: 'Entertainment', limit: 1500, spent: 649, icon: Film, color: '#f472b6' },
  { id: 7, category: 'Utilities', limit: 4000, spent: 3200, icon: Zap, color: '#22d3ee' },
  { id: 8, category: 'Other', limit: 2000, spent: 1500, icon: Package, color: '#9ca3af' },
];

export default function BudgetPage() {
  const totalBudget = MOCK_BUDGETS.reduce((acc, curr) => acc + curr.limit, 0);
  const totalSpent = MOCK_BUDGETS.reduce((acc, curr) => acc + curr.spent, 0);
  const savingsPercent = Math.round(((totalBudget - totalSpent) / totalBudget) * 100);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, letterSpacing: '-1px' }}>
            Budget <span style={{ color: '#10b981' }}>Planner</span>
          </h1>
          <p style={{ margin: '8px 0 0', color: '#6b7280', fontWeight: 600, fontSize: '15px' }}>
            Set limits and manage your spending habits.
          </p>
        </div>
        
        <button 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: '#10b981', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '16px', fontWeight: 800,
            fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
          }}
        >
          <Plus size={20} strokeWidth={3} />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '40px' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Monthly Budget</p>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 900, color: '#f3f4f6' }}>₹{totalBudget.toLocaleString('en-IN')}</h3>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #f43f5e' }}>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Spent</p>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 900, color: '#f3f4f6' }}>₹{totalSpent.toLocaleString('en-IN')}</h3>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Remaining Balance</p>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 900, color: '#f3f4f6' }}>₹{(totalBudget - totalSpent).toLocaleString('en-IN')}</h3>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #fbbf24' }}>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Savings Potential</p>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 900, color: '#f3f4f6' }}>{savingsPercent}%</h3>
        </div>
      </div>

      {/* Budget Grid */}
      <div className="budget-grid">
        {MOCK_BUDGETS.map((budget) => {
          const percent = Math.min((budget.spent / budget.limit) * 100, 100);
          const isOver = budget.spent >= budget.limit;
          const isWarning = percent > 80 && !isOver;

          return (
            <div key={budget.id} className="budget-card">
              <div className="budget-header">
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '16px', 
                  background: `${budget.color}15`, color: budget.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <budget.icon size={24} />
                </div>
                <button className="action-btn" title="Edit Budget">
                  <Edit2 size={16} />
                </button>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{budget.category}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  {isOver && <AlertCircle size={14} color="#f43f5e" />}
                  <span style={{ 
                    fontSize: '12px', fontWeight: 700, 
                    color: isOver ? '#f43f5e' : isWarning ? '#fbbf24' : '#6b7280'
                  }}>
                    {isOver ? 'Over Budget' : isWarning ? 'Near Limit' : 'On Track'}
                  </span>
                </div>
              </div>

              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${percent}%`, 
                    background: isOver ? '#f43f5e' : isWarning ? '#fbbf24' : budget.color,
                    boxShadow: `0 0 12px ${isOver ? '#f43f5e40' : isWarning ? '#fbbf2440' : budget.color + '40'}`
                  }}
                />
              </div>

              <div className="budget-info">
                <div>
                  <p style={{ margin: 0 }}>Spent</p>
                  <span className="value">₹{budget.spent.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0 }}>Budget</p>
                  <span className="value">₹{budget.limit.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
