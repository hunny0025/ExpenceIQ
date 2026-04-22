import { LogOut, TrendingUp, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Dashboard — placeholder page shown after login/register.
 * Task 03 scope ends here; full dashboard content is Task 04+.
 */
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully.');
    navigate('/login', { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#030712',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Top nav */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(17,24,39,0.8)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg,#7c3aed,#10b981)',
              color: '#fff',
            }}
          >
            <TrendingUp size={18} strokeWidth={2.4} />
          </span>
          <span
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              background: 'linear-gradient(90deg,#a78bfa,#34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            ExpenceIQ
          </span>
        </div>

        {/* User + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'rgba(124,58,237,0.2)',
                border: '1px solid rgba(124,58,237,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a78bfa',
              }}
            >
              <User size={14} />
            </span>
            <span style={{ fontSize: '0.85rem', color: '#d1d5db', fontWeight: 500 }}>
              {user?.name}
            </span>
          </div>
          <button
            id="dashboard-logout-btn"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.5rem',
              background: 'transparent',
              color: '#9ca3af',
              fontSize: '0.8rem',
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#f43f5e';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(244,63,94,0.3)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </nav>

      {/* Body */}
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 65px)', padding: '2rem', textAlign: 'center' }}>
        <div
          style={{
            background: 'rgba(17,24,39,0.8)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '1.25rem',
            padding: '3rem 2.5rem',
            maxWidth: 460,
            boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f9fafb', marginBottom: '0.5rem' }}>
            Welcome, {user?.name?.split(' ')[0]}!
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6 }}>
            You're successfully logged in to <strong style={{ color: '#a78bfa' }}>ExpenceIQ</strong>.
            The full dashboard is coming in Task 04.
          </p>
          <div
            style={{
              marginTop: '1.75rem',
              padding: '0.85rem 1rem',
              background: 'rgba(124,58,237,0.08)',
              border: '1px solid rgba(124,58,237,0.18)',
              borderRadius: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              fontSize: '0.8rem',
            }}
          >
            <div>
              <p style={{ color: '#6b7280', marginBottom: '0.2rem' }}>Email</p>
              <p style={{ color: '#d1d5db', fontWeight: 500 }}>{user?.email}</p>
            </div>
            <div>
              <p style={{ color: '#6b7280', marginBottom: '0.2rem' }}>Currency</p>
              <p style={{ color: '#d1d5db', fontWeight: 500 }}>{user?.currency ?? 'INR'}</p>
            </div>
            <div>
              <p style={{ color: '#6b7280', marginBottom: '0.2rem' }}>Status</p>
              <p style={{ color: '#10b981', fontWeight: 500 }}>✓ Active</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
