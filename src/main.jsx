import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Note: StrictMode is intentionally omitted — react-chartjs-2 v5 does not
// support React 18 StrictMode double-mount (causes "canvas already in use" error).
createRoot(document.getElementById('root')).render(<App />)
