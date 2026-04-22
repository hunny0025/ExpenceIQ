import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps a route so only authenticated users can access it.
 * Redirects to /login while preserving the intended destination.
 */
export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#030712',
        }}
        aria-label="Loading…"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          style={{ animation: 'spin 0.8s linear infinite' }}
          aria-hidden="true"
        >
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <path
            d="M18 4 A14 14 0 0 1 32 18"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
