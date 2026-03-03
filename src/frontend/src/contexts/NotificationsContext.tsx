import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type NotificationType =
  | "endorsement"
  | "learning_request"
  | "profile_view";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number; // ms since epoch
  read: boolean;
}

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  clearAll: () => void;
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
}

/**
 * Returns a localStorage key scoped to the current logged-in user.
 * This ensures each user only sees their own notifications.
 */
function getStorageKey(): string {
  try {
    const raw = localStorage.getItem("knot_user");
    if (raw) {
      const u = JSON.parse(raw) as { id?: string };
      if (u.id) return `knot_notifs_${u.id}`;
    }
  } catch {
    // ignore
  }
  return "knot_notifications_v2";
}

function loadNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return [];
    return JSON.parse(raw) as Notification[];
  } catch {
    return [];
  }
}

function saveNotifications(notifications: Notification[]): void {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(notifications));
  } catch {
    // ignore
  }
}

/**
 * Add a notification directly to a SPECIFIC user's notification store
 * without needing their session to be active. Used to notify workers
 * when someone endorses, views, or sends them a learning request.
 */
export function addNotificationForUser(
  targetUserId: string,
  n: Omit<Notification, "id" | "timestamp" | "read">,
): void {
  const key = `knot_notifs_${targetUserId}`;
  const newNotif: Notification = {
    ...n,
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
    read: false,
  };
  try {
    const raw = localStorage.getItem(key);
    const existing: Notification[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(key, JSON.stringify([newNotif, ...existing]));
  } catch {
    // ignore
  }
}

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] =
    useState<Notification[]>(loadNotifications);

  // Re-load notifications when the user changes (e.g. after login)
  useEffect(() => {
    const handleStorage = () => {
      setNotifications(loadNotifications());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Poll for new notifications every 5 seconds so notifications from
  // other sessions/tabs (written via addNotificationForUser) appear in real time
  useEffect(() => {
    const interval = setInterval(() => {
      const fresh = loadNotifications();
      setNotifications((prev) => {
        // Only update if something actually changed (avoid re-render churn)
        if (JSON.stringify(prev) !== JSON.stringify(fresh)) {
          return fresh;
        }
        return prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotif: Notification = {
        ...n,
        id: `n-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    [],
  );

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllRead,
        clearAll,
        addNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used inside <NotificationsProvider>",
    );
  return ctx;
}
