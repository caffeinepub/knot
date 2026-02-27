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
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
}

const STORAGE_KEY = "knot_notifications";

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "endorsement",
    message: "Ravi Kumar endorsed your profile",
    timestamp: Date.now() - 1000 * 60 * 5, // 5 min ago
    read: false,
  },
  {
    id: "n2",
    type: "learning_request",
    message: "Priya Sharma sent a learning request",
    timestamp: Date.now() - 1000 * 60 * 30, // 30 min ago
    read: false,
  },
  {
    id: "n3",
    type: "profile_view",
    message: "Someone viewed your profile",
    timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
    read: false,
  },
  {
    id: "n4",
    type: "endorsement",
    message: "Sunita Devi endorsed your profile",
    timestamp: Date.now() - 1000 * 60 * 90, // 90 min ago
    read: true,
  },
  {
    id: "n5",
    type: "profile_view",
    message: "A citizen near Chennai viewed your profile",
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    read: true,
  },
];

function loadNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return MOCK_NOTIFICATIONS;
    return JSON.parse(raw) as Notification[];
  } catch {
    return MOCK_NOTIFICATIONS;
  }
}

function saveNotifications(notifications: Notification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
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

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
      value={{ notifications, unreadCount, markAllRead, addNotification }}
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
