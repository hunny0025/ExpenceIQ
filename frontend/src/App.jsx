/* eslint-disable react-refresh/only-export-components */
import { Routes, Route, Navigate } from 'react-router-dom'

// Pages — implemented by Mehul & Kavinraj from Day 3 onwards
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ExpensesPage from './pages/ExpensesPage.jsx'
import BudgetPage from './pages/BudgetPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'

// Auth guard — tokens are stored in localStorage; full context wired in Day 3
// NOTE: PrivateRoute IS used below in JSX; ESLint base rule misses JSX references
// eslint-disable-next-line no-unused-vars
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Private — wrapped in auth guard */}
      <Route path="/"          element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/expenses"  element={<PrivateRoute><ExpensesPage /></PrivateRoute>} />
      <Route path="/budget"    element={<PrivateRoute><BudgetPage /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
