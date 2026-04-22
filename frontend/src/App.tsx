import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-load pages for better initial load performance
const LoginPage     = lazy(() => import('./pages/LoginPage'));
const SignupPage    = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Full-screen spinner shown while a lazy chunk is loading
function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#030712',
      }}
      aria-label="Loading page…"
    >
      <svg width="36" height="36" viewBox="0 0 36 36" style={{ animation: 'spin 0.8s linear infinite' }} aria-hidden="true">
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <path d="M18 4 A14 14 0 0 1 32 18" fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirect to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
