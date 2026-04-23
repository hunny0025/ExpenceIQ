import { LayoutDashboard, Receipt, Target, PieChart, LogOut, ChevronRight } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../dashboard.css';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Expenses', icon: Receipt, path: '/expenses' },
  { name: 'Budget', icon: Target, path: '/budget' },
  { name: 'Analytics', icon: PieChart, path: '/analytics' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '36px', height: '36px', borderRadius: '10px', 
            background: 'linear-gradient(135deg, #7c3aed, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(124, 58, 237, 0.2)'
          }}>
            <LayoutDashboard size={18} color="white" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Expence<span style={{ color: '#a78bfa' }}>IQ</span>
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
            <ChevronRight size={14} className="chevron" style={{ marginLeft: 'auto', opacity: 0.3 }} />
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="profile-card">
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '12px', 
            background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#a78bfa', fontWeight: 'bold'
          }}>
            {user?.name?.[0] || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#f3f4f6' }}>{user?.name}</p>
            <p style={{ margin: 0, fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: '16px', width: '100%', background: 'transparent', border: '1px solid transparent',
            color: '#6b7280', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '12px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#f43f5e'; e.currentTarget.style.background = 'rgba(244, 63, 94, 0.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
