import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Target, Activity, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import '../dashboard.css';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Balance', value: '₹45,250', change: '+12%', icon: Wallet, color: 'violet', bg: 'rgba(124, 58, 237, 0.1)', text: '#a78bfa' },
    { label: 'Monthly Spend', value: '₹12,840', change: '-4%', icon: ArrowDownRight, color: 'rose', bg: 'rgba(244, 63, 94, 0.1)', text: '#fb7185' },
    { label: 'Savings Goal', value: '75%', change: '+5%', icon: Target, color: 'emerald', bg: 'rgba(16, 185, 129, 0.1)', text: '#34d399' },
    { label: 'Daily Average', value: '₹428', change: '+1%', icon: Activity, color: 'blue', bg: 'rgba(59, 130, 246, 0.1)', text: '#60a5fa' },
  ];

  return (
    <DashboardLayout>
      {/* Header section with User Greeting */}
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, letterSpacing: '-1px' }}>
            Hey, <span style={{ color: '#a78bfa' }}>{user?.name?.split(' ')[0]}!</span>
          </h1>
          <p style={{ margin: '8px 0 0', color: '#6b7280', fontWeight: 600, fontSize: '15px' }}>
            Your finances are looking healthy today.
          </p>
        </div>
        
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', 
          background: '#7c3aed', color: 'white', border: 'none',
          padding: '12px 24px', borderRadius: '16px', fontWeight: 800,
          fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s',
          boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)'
        }}>
          <Plus size={20} strokeWidth={3} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Stats Grid - 4 Column Row */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="card-icon" style={{ background: stat.bg, color: stat.text, border: `1px solid ${stat.bg}` }}>
                <stat.icon size={24} />
              </div>
              <span style={{ 
                fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '8px',
                background: stat.change.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                color: stat.change.startsWith('+') ? '#10b981' : '#f43f5e'
              }}>
                {stat.change}
              </span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
              <h3 style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 900, color: '#f3f4f6' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="analytics-grid">
        <div className="analytics-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '24px', 
            background: 'rgba(124, 58, 237, 0.05)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', color: '#a78bfa',
            marginBottom: '32px'
          }}>
            <TrendingUp size={40} />
          </div>
          <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#f3f4f6' }}>Spending Insights</h3>
          <p style={{ margin: '16px 0 0', color: '#6b7280', fontSize: '15px', maxWidth: '320px', lineHeight: 1.6 }}>
            Real-time charts and data visualization will be implemented in the next phase.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="analytics-card" style={{ 
            minHeight: 'auto', background: 'linear-gradient(135deg, #7c3aed, #4338ca)', 
            border: 'none', padding: '32px', textAlign: 'center'
          }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '14px', 
              background: 'rgba(255, 255, 255, 0.2)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', color: 'white',
              margin: '0 auto 24px'
            }}>
              <Target size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'white' }}>Financial Goals</h3>
            <p style={{ margin: '12px 0 24px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Set a target and save faster.</p>
            <button style={{ 
              width: '100%', background: 'white', color: '#7c3aed', border: 'none',
              padding: '14px', borderRadius: '14px', fontWeight: 800, fontSize: '13px',
              cursor: 'pointer'
            }}>
              Set New Goal
            </button>
          </div>

          <div className="analytics-card" style={{ minHeight: '160px', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              border: '2px dashed rgba(255, 255, 255, 0.1)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', color: '#6b7280',
              margin: '0 auto 16px'
            }}>
              <Activity size={20} />
            </div>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase' }}>No recent activity</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
