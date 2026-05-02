/**
 * MobileNavigation — responsive slide-in sidebar for mobile viewports (≤768px).
 *
 * Features:
 * - Animated hamburger button that morphs to an ✕
 * - 300ms cubic-bezier slide-in panel with blurred backdrop overlay
 * - Auto-closes on route change, Escape key, or overlay click
 * - Body scroll lock while the menu is open
 * - Mirrors the desktop {@link Sidebar} nav items for parity
 *
 * The hamburger button is `display: none` on desktop; the CSS media query
 * at ≤768px shows it and hides the desktop sidebar.
 *
 * @example
 * ```tsx
 * // Inside DashboardLayout — renders alongside <Sidebar />
 * <MobileNavigation />
 * ```
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Target,
  PieChart,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './MobileNavigation.css';

/** Navigation items — kept in sync with the desktop Sidebar. */
const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Expenses', icon: Receipt, path: '/expenses' },
  { name: 'Budget', icon: Target, path: '/budget' },
  { name: 'Analytics', icon: PieChart, path: '/analytics' },
];

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape key closes menu
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <>
      {/* Hamburger trigger */}
      <button
        className="mobile-nav__trigger"
        onClick={toggle}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        id="mobile-nav-trigger"
      >
        <div className={`mobile-nav__hamburger ${open ? 'mobile-nav__hamburger--open' : ''}`}>
          <span />
          <span />
          <span />
        </div>
      </button>

      {/* Overlay backdrop */}
      <div
        className={`mobile-nav__overlay ${open ? 'mobile-nav__overlay--visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
        id="mobile-nav-overlay"
      />

      {/* Slide-in panel */}
      <aside
        ref={panelRef}
        className={`mobile-nav__panel ${open ? 'mobile-nav__panel--open' : ''}`}
        id="mobile-nav-panel"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {/* Logo */}
        <div className="mobile-nav__logo">
          <div className="mobile-nav__logo-icon">
            <LayoutDashboard size={16} color="white" />
          </div>
          <span className="mobile-nav__logo-text">
            Expence<span className="mobile-nav__logo-accent">IQ</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="mobile-nav__links">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `mobile-nav__link ${isActive ? 'active' : ''}`
              }
              id={`mobile-nav-link-${item.name.toLowerCase()}`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
              <ChevronRight
                size={14}
                style={{ marginLeft: 'auto', opacity: 0.3 }}
              />
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="mobile-nav__footer">
          <div className="mobile-nav__profile">
            <div className="mobile-nav__avatar">
              {user?.name?.[0] || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="mobile-nav__user-name">{user?.name}</p>
              <p className="mobile-nav__user-email">{user?.email}</p>
            </div>
          </div>

          <button
            className="mobile-nav__logout"
            onClick={handleLogout}
            aria-label="Sign out of your account"
            id="mobile-nav-logout"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
