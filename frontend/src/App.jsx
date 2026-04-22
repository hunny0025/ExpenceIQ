import { Routes, Route, Navigate } from 'react-router-dom'

// Pages — to be built in Day 3–7
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ExpensesPage from './pages/ExpensesPage.jsx'
import BudgetPage from './pages/BudgetPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'

// Auth guard placeholder — full implementation in context (Day 3)
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Private routes */}
      <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/expenses" element={<PrivateRoute><ExpensesPage /></PrivateRoute>} />
      <Route path="/budget" element={<PrivateRoute><BudgetPage /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
