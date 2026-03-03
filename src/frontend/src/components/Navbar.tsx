import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Award,
  Bell,
  BookOpen,
  Globe,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Shield,
  ThumbsUp,
  Users,
  X,
} from "lucide-react";
// Note: Users is still used in notification icons
import { useState } from "react";
import logoImg from "/assets/uploads/image-14-1.png";
import { useLang } from "../contexts/LanguageContext";
import { useNotifications } from "../contexts/NotificationsContext";
import type { NotificationType } from "../contexts/NotificationsContext";
import { clearAuthUser, getAuthUser } from "../utils/auth";
import { LANGUAGE_OPTIONS, type LangCode } from "../utils/translations";

function timeAgo(ts: number): string {
  const diffMs = Date.now() - ts;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotifIcon({ type }: { type: NotificationType }) {
  if (type === "endorsement")
    return <ThumbsUp className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
  if (type === "learning_request")
    return <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
  return <Users className="w-3.5 h-3.5 text-green-500 shrink-0" />;
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const { lang, setLang, t } = useLang();
  const { notifications, unreadCount, markAllRead, clearAll } =
    useNotifications();

  const isActive = (path: string) => pathname === path;

  const currentLangOption =
    LANGUAGE_OPTIONS.find((o) => o.code === lang) ?? LANGUAGE_OPTIONS[0];

  function handleLogout() {
    clearAuthUser();
    navigate({ to: "/login" });
    setMobileOpen(false);
  }

  const recentNotifs = notifications.slice(0, 5);
  const hasCertPassed =
    typeof window !== "undefined" &&
    localStorage.getItem("knot_cert_passed") === "true";

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-navy">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 ring-2 ring-white/20 group-hover:ring-white/40 transition-all relative">
              <img
                src={logoImg}
                alt="KNOT Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback =
                    target.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div
                className="w-full h-full bg-amber-500 items-center justify-center text-white font-extrabold text-lg font-display absolute inset-0"
                style={{ display: "none" }}
              >
                K
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                KNOT
              </span>
              <span className="text-[10px] text-white/60 tracking-widest uppercase font-body">
                Skills • Trust • Community
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className={`text-white/80 hover:text-white hover:bg-white/10 gap-2 font-body ${
                  isActive("/") ? "bg-white/15 text-white" : ""
                }`}
              >
                <Home className="w-4 h-4" />
                {t("nav_home")}
              </Button>
            </Link>

            <Link to="/requests">
              <Button
                variant="ghost"
                size="sm"
                className={`text-white/80 hover:text-white hover:bg-white/10 gap-2 font-body ${
                  isActive("/requests") ? "bg-white/15 text-white" : ""
                }`}
              >
                <BookOpen className="w-4 h-4" />
                {t("nav_requests")}
              </Button>
            </Link>

            {/* Notification Bell */}
            {authUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative text-white/80 hover:text-white hover:bg-white/10 px-2.5"
                    aria-label={t("notif_title")}
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="font-display font-semibold text-sm text-foreground">
                      {t("notif_title")}
                    </span>
                    <div className="flex items-center gap-3">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllRead}
                          className="text-xs text-primary hover:underline font-body"
                        >
                          {t("notif_mark_read")}
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          type="button"
                          onClick={clearAll}
                          className="text-xs text-muted-foreground hover:text-destructive font-body hover:underline transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {recentNotifs.length === 0 ? (
                      <div className="px-4 py-6 text-center text-muted-foreground text-sm font-body">
                        {t("notif_empty")}
                      </div>
                    ) : (
                      recentNotifs.map((notif) => (
                        <div
                          key={notif.id}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 transition-colors ${
                            !notif.read ? "bg-primary/5" : ""
                          }`}
                        >
                          <div className="mt-0.5">
                            <NotifIcon type={notif.type} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-body text-foreground leading-snug">
                              {notif.message}
                            </p>
                            <p className="text-xs text-muted-foreground font-body mt-0.5">
                              {timeAgo(notif.timestamp)}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  {recentNotifs.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="px-4 py-2 flex items-center justify-between gap-2">
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllRead}
                            className="flex-1 text-xs text-center text-muted-foreground hover:text-foreground font-body transition-colors"
                          >
                            {t("notif_mark_read")}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={clearAll}
                          className="flex-1 text-xs text-center text-muted-foreground hover:text-destructive font-body transition-colors"
                        >
                          Clear all
                        </button>
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Language selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 gap-1.5 font-body px-2.5"
                  title="Change language"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">
                    {currentLangOption.flag} {currentLangOption.shortLabel}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.code}
                    onClick={() => setLang(opt.code as LangCode)}
                    className={`cursor-pointer font-body text-sm gap-2 ${lang === opt.code ? "bg-accent font-semibold" : ""}`}
                  >
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                    {lang === opt.code && (
                      <span className="ml-auto text-primary">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth section */}
            {authUser ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/20">
                {/* Admin Panel link */}
                {authUser.role === "admin" && (
                  <Link to="/admin">
                    <Button
                      variant="ghost"
                      size="sm"
                      data-ocid="admin.panel.link"
                      className={`text-amber-300 hover:text-amber-200 hover:bg-white/10 gap-2 font-body font-semibold ${
                        isActive("/admin") ? "bg-white/15 text-amber-200" : ""
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                {/* Worker dashboard link */}
                {authUser.role === "worker" && (
                  <Link to="/worker-dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-white/80 hover:text-white hover:bg-white/10 gap-2 font-body ${
                        isActive("/worker-dashboard")
                          ? "bg-white/15 text-white"
                          : ""
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {t("nav_dashboard")}
                    </Button>
                  </Link>
                )}
                {authUser.role === "worker" && hasCertPassed && (
                  <Link to="/certificate">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-white/80 hover:text-white hover:bg-white/10 gap-2 font-body ${
                        isActive("/certificate") ? "bg-white/15 text-white" : ""
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      My Certificate
                    </Button>
                  </Link>
                )}
                {/* User pill */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10">
                  <span className="text-white text-sm font-body font-medium leading-none">
                    {authUser.name.split(" ")[0]}
                  </span>
                  <Badge
                    className={`text-[10px] px-1.5 py-0 h-4 font-body font-semibold ${
                      authUser.role === "worker"
                        ? "bg-amber-500 text-white border-0"
                        : authUser.role === "admin"
                          ? "bg-red-600 text-white border-0"
                          : "bg-blue-500 text-white border-0"
                    }`}
                  >
                    {authUser.role === "worker"
                      ? t("nav_worker")
                      : authUser.role === "admin"
                        ? "Admin"
                        : t("nav_citizen")}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white/60 hover:text-white hover:bg-white/10 gap-1.5 font-body text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t("nav_logout")}
                </Button>
              </div>
            ) : (
              <div className="ml-2 pl-2 border-l border-white/20">
                <Link to="/login">
                  <Button
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-600 text-white font-body gap-2 shadow-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    {t("nav_login")}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-1 animate-fade-in">
            <div className="flex flex-col gap-1 pt-3">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors font-body"
              >
                <Home className="w-4 h-4" />
                {t("nav_home")}
              </Link>
              <Link
                to="/requests"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors font-body"
              >
                <BookOpen className="w-4 h-4" />
                {t("nav_learning_requests")}
              </Link>

              {/* Mobile Notifications */}
              {authUser && (
                <div className="px-3 py-2 border-t border-white/10 mt-1 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/40 text-xs uppercase tracking-widest font-body flex items-center gap-1.5">
                      <Bell className="w-3 h-3" />
                      {t("notif_title")}
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                          {unreadCount}
                        </span>
                      )}
                    </p>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-body"
                      >
                        {t("notif_mark_read")}
                      </button>
                    )}
                  </div>
                  {recentNotifs.length === 0 ? (
                    <p className="text-white/40 text-xs font-body">
                      {t("notif_empty")}
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {recentNotifs.slice(0, 3).map((notif) => (
                        <div
                          key={notif.id}
                          className={`flex items-start gap-2 px-2 py-1.5 rounded-md text-xs font-body ${
                            !notif.read
                              ? "bg-white/15 text-white"
                              : "text-white/60"
                          }`}
                        >
                          <NotifIcon type={notif.type} />
                          <span className="flex-1 line-clamp-1">
                            {notif.message}
                          </span>
                          <span className="text-white/40 shrink-0">
                            {timeAgo(notif.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Language switcher in mobile */}
              <div className="px-3 py-1 border-t border-white/10 mt-1 pt-3">
                <p className="text-white/40 text-xs uppercase tracking-widest font-body mb-2 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Language
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => {
                        setLang(opt.code as LangCode);
                        setMobileOpen(false);
                      }}
                      className={`text-xs px-2 py-1 rounded-md font-body transition-all ${
                        lang === opt.code
                          ? "bg-amber-500 text-white font-semibold"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {opt.flag} {opt.shortLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auth in mobile */}
              {authUser ? (
                <>
                  {authUser.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      data-ocid="admin.panel.mobile.link"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-amber-300 hover:text-amber-200 hover:bg-white/10 transition-colors font-body font-semibold"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  {authUser.role === "worker" && (
                    <Link
                      to="/worker-dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors font-body"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {t("nav_my_dashboard")}
                    </Link>
                  )}
                  {authUser.role === "worker" && hasCertPassed && (
                    <Link
                      to="/certificate"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors font-body"
                    >
                      <Award className="w-4 h-4" />
                      My Certificate
                    </Link>
                  )}
                  <div className="px-3 py-2 border-t border-white/10 mt-1 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-body">
                          {authUser.name}
                        </span>
                        <span
                          className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${
                            authUser.role === "worker"
                              ? "bg-amber-500 text-white"
                              : authUser.role === "admin"
                                ? "bg-red-600 text-white"
                                : "bg-blue-500 text-white"
                          }`}
                        >
                          {authUser.role === "worker"
                            ? t("nav_worker")
                            : authUser.role === "admin"
                              ? "Admin"
                              : t("nav_citizen")}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-1 text-white/60 hover:text-white text-sm font-body"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {t("nav_logout")}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-white/10 transition-colors font-body font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  {t("nav_login")} / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
