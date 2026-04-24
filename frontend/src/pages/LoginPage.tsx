import { useState, useId, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './auth.css';

// ── Validation ────────────────────────────────────────────────────────────────
interface LoginErrors {
  email?: string;
  password?: string;
}

function validate(email: string, password: string): LoginErrors {
  const errs: LoginErrors = {};
  if (!email.trim()) {
    errs.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errs.email = 'Enter a valid email address.';
  }
  if (!password) {
    errs.password = 'Password is required.';
  } else if (password.length < 6) {
    errs.password = 'Password must be at least 6 characters.';
  }
  return errs;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const id = useId();

  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [rememberMe, setRememberMe]   = useState(false);
  const [showPwd, setShowPwd]         = useState(false);

  const [touched, setTouched]         = useState({ email: false, password: false });
  const [submitting, setSubmitting]   = useState(false);
  const [serverError, setServerError] = useState('');

  // Live‑validate once a field has been touched
  const liveErrors =
    touched.email || touched.password ? validate(email, password) : {};

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate(email, password);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setServerError('');
    try {
      await login(email, password);
      if (rememberMe) localStorage.setItem('eq_remember', email);
      toast.success('Welcome back! 👋');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string; message?: string } } })
          ?.response?.data?.error ??
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ??
        'Invalid email or password.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-root">
      {/* Background blobs */}
      <div className="auth-blob auth-blob--violet" aria-hidden="true" />
      <div className="auth-blob auth-blob--emerald" aria-hidden="true" />

      <div className="auth-card" role="main">

        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo__icon" aria-hidden="true">
            <TrendingUp size={22} strokeWidth={2.4} />
          </span>
          <span className="auth-logo__text">ExpenceIQ</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {/* Server‑level error banner */}
        {serverError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <span>⚠ {serverError}</span>
          </div>
        )}

        <form id={`${id}-form`} onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor={`${id}-email`} className="auth-label">
              Email address
            </label>
            <div className={`auth-input-wrap ${liveErrors.email ? 'auth-input-wrap--error' : ''}`}>
              <Mail size={16} className="auth-input-icon" aria-hidden="true" />
              <input
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                aria-invalid={!!liveErrors.email}
                aria-describedby={liveErrors.email ? `${id}-email-err` : undefined}
              />
            </div>
            {liveErrors.email && (
              <p id={`${id}-email-err`} className="auth-error-msg" role="alert">
                {liveErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor={`${id}-password`} className="auth-label">
              Password
            </label>
            <div className={`auth-input-wrap ${liveErrors.password ? 'auth-input-wrap--error' : ''}`}>
              <Lock size={16} className="auth-input-icon" aria-hidden="true" />
              <input
                id={`${id}-password`}
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className="auth-input auth-input--with-action"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                aria-invalid={!!liveErrors.password}
                aria-describedby={liveErrors.password ? `${id}-pwd-err` : undefined}
              />
              <button
                type="button"
                className="auth-reveal-btn"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {liveErrors.password && (
              <p id={`${id}-pwd-err`} className="auth-error-msg" role="alert">
                {liveErrors.password}
              </p>
            )}
          </div>

          {/* Remember me + Forgot */}
          <div className="auth-row">
            <label className="auth-checkbox-label" htmlFor={`${id}-remember`}>
              <input
                id={`${id}-remember`}
                type="checkbox"
                className="auth-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="auth-link auth-link--muted">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            id={`${id}-submit`}
            className="auth-btn"
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={17} className="auth-btn__spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
