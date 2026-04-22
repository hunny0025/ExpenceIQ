/* eslint-disable no-unused-vars */
import { Routes, Route, Navigate } from 'react-router-dom'

// Pages — to be implemented in Day 3–7 by Mehul & Kavinraj
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ExpensesPage from './pages/ExpensesPage.jsx'
import BudgetPage from './pages/BudgetPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
/* eslint-enable no-unused-vars */

// Auth guard — checks localStorage token; full context added in Day 3
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Private */}
      <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/expenses" element={<PrivateRoute><ExpensesPage /></PrivateRoute>} />
      <Route path="/budget" element={<PrivateRoute><BudgetPage /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
