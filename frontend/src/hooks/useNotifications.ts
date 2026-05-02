import { useState, useEffect, useCallback, useRef } from 'react';
import {
  notificationService,
  type Notification,
} from '../services/notification.service';

const POLL_INTERVAL_MS = 30_000; // 30 seconds

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load notifications';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchNotifications();

    intervalRef.current = setInterval(() => {
      fetchNotifications();
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
    );

    try {
      await notificationService.markAsRead(id);
    } catch {
      // Revert on failure
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: false } : n)),
      );
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const previous = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await notificationService.markAllAsRead();
    } catch {
      setNotifications(previous);
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}
