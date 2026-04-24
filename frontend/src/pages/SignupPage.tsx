import { useState, useId, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Loader2, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './auth.css';

// ── Password strength ─────────────────────────────────────────────────────────
function getStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8)            score++;
  if (/[A-Z]/.test(pwd))          score++;
  if (/[0-9]/.test(pwd))          score++;
  if (/[^A-Za-z0-9]/.test(pwd))   score++;

  const map = [
    { label: 'Too short',  color: '#f43f5e' },
    { label: 'Weak',       color: '#f43f5e' },
    { label: 'Fair',       color: '#f59e0b' },
    { label: 'Good',       color: '#10b981' },
    { label: 'Strong',     color: '#10b981' },
  ] as const;

  return { score, ...map[score] };
}

// ── Validation ────────────────────────────────────────────────────────────────
interface SignupErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(name: string, email: string, password: string, confirmPassword: string): SignupErrors {
  const errs: SignupErrors = {};
  if (!name.trim())
    errs.name = 'Name is required.';
  else if (name.trim().length > 50)
    errs.name = 'Name must be 50 characters or fewer.';

  if (!email.trim())
    errs.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = 'Enter a valid email address.';

  if (!password)
    errs.password = 'Password is required.';
  else if (password.length < 6)
    errs.password = 'Password must be at least 6 characters.';

  if (!confirmPassword)
    errs.confirmPassword = 'Please confirm your password.';
  else if (confirmPassword !== password)
    errs.confirmPassword = 'Passwords do not match.';

  return errs;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const id = useId();

  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPwd]    = useState('');
  const [showPwd, setShowPwd]               = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [serverError, setServerError]       = useState('');
  const [touched, setTouched]               = useState({
    name: false, email: false, password: false, confirmPassword: false,
  });

  const touch = (field: keyof typeof touched) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const anyTouched = Object.values(touched).some(Boolean);
  const liveErrors = anyTouched ? validate(name, email, password, confirmPassword) : {};
  const strength   = password ? getStrength(password) : null;

  const passwordRequirements = [
    { label: 'At least 6 characters',      met: password.length >= 6 },
    { label: 'Contains uppercase letter',  met: /[A-Z]/.test(password) },
    { label: 'Contains a number',          met: /[0-9]/.test(password) },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    const errs = validate(name, email, password, confirmPassword);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setServerError('');
    try {
      await register(name.trim(), email, password);
      toast.success('Account created! Welcome to ExpenceIQ 🎉');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Registration failed. Please try again.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-blob auth-blob--violet" aria-hidden="true" />
      <div className="auth-blob auth-blob--emerald auth-blob--right" aria-hidden="true" />

      <div className="auth-card auth-card--wide" role="main">

        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo__icon" aria-hidden="true">
            <TrendingUp size={22} strokeWidth={2.4} />
          </span>
          <span className="auth-logo__text">ExpenceIQ</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start tracking expenses smarter — it's free</p>

        {serverError && (
          <div className="auth-alert auth-alert--error" role="alert">
            ⚠ {serverError}
          </div>
        )}

        <form id={`${id}-form`} onSubmit={handleSubmit} noValidate>

          {/* Full name */}
          <div className="auth-field">
            <label htmlFor={`${id}-name`} className="auth-label">Full name</label>
            <div className={`auth-input-wrap ${liveErrors.name ? 'auth-input-wrap--error' : ''}`}>
              <User size={16} className="auth-input-icon" aria-hidden="true" />
              <input
                id={`${id}-name`}
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => touch('name')}
                aria-invalid={!!liveErrors.name}
                aria-describedby={liveErrors.name ? `${id}-name-err` : undefined}
              />
            </div>
            {liveErrors.name && (
              <p id={`${id}-name-err`} className="auth-error-msg" role="alert">{liveErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor={`${id}-email`} className="auth-label">Email address</label>
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
                onBlur={() => touch('email')}
                aria-invalid={!!liveErrors.email}
                aria-describedby={liveErrors.email ? `${id}-email-err` : undefined}
              />
            </div>
            {liveErrors.email && (
              <p id={`${id}-email-err`} className="auth-error-msg" role="alert">{liveErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor={`${id}-password`} className="auth-label">Password</label>
            <div className={`auth-input-wrap ${liveErrors.password ? 'auth-input-wrap--error' : ''}`}>
              <Lock size={16} className="auth-input-icon" aria-hidden="true" />
              <input
                id={`${id}-password`}
                type={showPwd ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                className="auth-input auth-input--with-action"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => touch('password')}
                aria-invalid={!!liveErrors.password}
                aria-describedby={`${id}-pwd-hints`}
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

            {/* Strength bar */}
            {password && strength && (
              <div className="auth-strength" aria-live="polite">
                <div className="auth-strength__bar">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="auth-strength__seg"
                      style={{ background: i < strength.score ? strength.color : undefined }}
                    />
                  ))}
                </div>
                <span className="auth-strength__label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}

            {/* Requirement checklist */}
            {(touched.password || password) && (
              <ul id={`${id}-pwd-hints`} className="auth-hints">
                {passwordRequirements.map((r) => (
                  <li key={r.label} className={`auth-hint ${r.met ? 'auth-hint--met' : ''}`}>
                    {r.met
                      ? <CheckCircle2 size={12} aria-hidden="true" />
                      : <XCircle size={12} aria-hidden="true" />}
                    {r.label}
                  </li>
                ))}
              </ul>
            )}

            {liveErrors.password && (
              <p id={`${id}-pwd-err`} className="auth-error-msg" role="alert">{liveErrors.password}</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="auth-field">
            <label htmlFor={`${id}-confirm`} className="auth-label">Confirm password</label>
            <div className={`auth-input-wrap ${liveErrors.confirmPassword ? 'auth-input-wrap--error' : ''}`}>
              <Lock size={16} className="auth-input-icon" aria-hidden="true" />
              <input
                id={`${id}-confirm`}
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                className="auth-input auth-input--with-action"
                value={confirmPassword}
                onChange={(e) => setConfirmPwd(e.target.value)}
                onBlur={() => touch('confirmPassword')}
                aria-invalid={!!liveErrors.confirmPassword}
                aria-describedby={liveErrors.confirmPassword ? `${id}-confirm-err` : undefined}
              />
              <button
                type="button"
                className="auth-reveal-btn"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {liveErrors.confirmPassword && (
              <p id={`${id}-confirm-err`} className="auth-error-msg" role="alert">
                {liveErrors.confirmPassword}
              </p>
            )}
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
                Creating account…
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
