/**
 * NotificationBell — bell icon with an unread-count badge and a dropdown panel.
 *
 * Fetches notifications via {@link useNotifications}, supports optimistic
 * mark-as-read, and renders loading / empty / error states inside the dropdown.
 *
 * @example
 * ```tsx
 * <NotificationBell />
 * <NotificationBell maxBadge={99} />
 * ```
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle2, XCircle, BellOff } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import type { Notification } from '../../services/notification.service';
import './NotificationBell.css';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Converts an ISO date string into a human-friendly relative timestamp.
 * @param dateStr - ISO 8601 date string
 * @returns Relative time label (e.g. "Just now", "3h ago", "May 2")
 */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/** Maps notification type to a Lucide icon component. */
const TYPE_ICON = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  error: XCircle,
} as const;

// ── Props ─────────────────────────────────────────────────────────────────────

export interface NotificationBellProps {
  /**
   * Maximum count shown in the badge before switching to "N+".
   * @default 9
   */
  maxBadge?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NotificationBell({ maxBadge = 9 }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications();

  // ── Outside click ────────────────────────────────────────────────────────
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        open &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    },
    [open],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Escape key closes dropdown
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  // ── Item click ──────────────────────────────────────────────────────────
  const handleItemClick = async (n: Notification) => {
    if (!n.read) await markAsRead(n._id);
  };

  // ── Badge text ──────────────────────────────────────────────────────────
  const badgeText =
    unreadCount > maxBadge ? `${maxBadge}+` : String(unreadCount);

  // ── Render helpers ──────────────────────────────────────────────────────
  const renderContent = () => {
    if (loading) {
      return (
        <div className="notification-bell__state" id="notification-loading">
          <svg
            className="notification-bell__spinner"
            viewBox="0 0 36 36"
            aria-hidden="true"
          >
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="3"
            />
            <path
              d="M18 4 A14 14 0 0 1 32 18"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className="notification-bell__state-text">
            Loading notifications…
          </span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="notification-bell__state" id="notification-error">
          <div className="notification-bell__state-icon">
            <XCircle size={22} />
          </div>
          <span className="notification-bell__state-text">{error}</span>
          <button
            className="notification-bell__retry"
            onClick={refresh}
            id="notification-retry-btn"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="notification-bell__state" id="notification-empty">
          <div className="notification-bell__state-icon">
            <BellOff size={22} />
          </div>
          <span className="notification-bell__state-text">
            No notifications yet
          </span>
        </div>
      );
    }

    return (
      <div className="notification-bell__list" role="list">
        {notifications.map((n) => {
          const Icon = TYPE_ICON[n.type] ?? Info;
          return (
            <div
              key={n._id}
              role="listitem"
              className={`notification-bell__item ${!n.read ? 'notification-bell__item--unread' : ''}`}
              onClick={() => handleItemClick(n)}
              id={`notification-item-${n._id}`}
            >
              <div
                className={`notification-bell__type-icon notification-bell__type-icon--${n.type}`}
              >
                <Icon size={16} />
              </div>
              <div className="notification-bell__content">
                <div className="notification-bell__title">{n.title}</div>
                <div className="notification-bell__message">{n.message}</div>
                <div className="notification-bell__time">
                  {timeAgo(n.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="notification-bell" ref={containerRef}>
      <button
        className={`notification-bell__trigger ${open ? 'notification-bell__trigger--active' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        id="notification-bell-btn"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="notification-bell__badge" aria-hidden="true">
            {badgeText}
          </span>
        )}
      </button>

      {open && (
        <div
          className="notification-bell__dropdown"
          role="dialog"
          aria-label="Notifications"
          id="notification-dropdown"
        >
          <div className="notification-bell__header">
            <span className="notification-bell__header-title">
              Notifications
            </span>
            <button
              className="notification-bell__mark-all"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              id="notification-mark-all-btn"
            >
              Mark all read
            </button>
          </div>

          {renderContent()}
        </div>
      )}
    </div>
  );
}
