import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { useActor } from "./hooks/useActor";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { CertificatePage } from "./pages/CertificatePage";
import { CertificationTestPage } from "./pages/CertificationTestPage";
import { CommunityPage } from "./pages/CommunityPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RequestsPage } from "./pages/RequestsPage";
import { WorkerDashboardPage } from "./pages/WorkerDashboardPage";
import { getAuthUser } from "./utils/auth";

function AppInitializer() {
  const { actor } = useActor();

  useEffect(() => {
    if (!actor) return;
    // One-time data reset: clear all previous registrations silently
    const cleared = localStorage.getItem("knot_data_cleared_v2");
    if (!cleared) {
      (async () => {
        try {
          await actor.clearAllData();
        } catch (err) {
          console.warn("clearAllData failed:", err);
        }
        localStorage.setItem("knot_data_cleared_v2", "true");
        // Only remove stale keys — do NOT log the user out or redirect
        localStorage.removeItem("knot_worker_video_preview_url");
        localStorage.removeItem("knot_cert_passed");
        localStorage.removeItem("knot_worker_video");
        localStorage.removeItem("knot_worker_id");
      })().catch((err: unknown) => {
        console.error("Failed to initialize backend:", err);
      });
    }
  }, [actor]);

  return null;
}

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppInitializer />
      <Toaster position="bottom-right" richColors />
      <Outlet />
    </div>
  );
}

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const mainLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "main",
  component: MainLayout,
  beforeLoad: () => {
    const user = getAuthUser();
    if (!user) {
      throw redirect({ to: "/login" });
    }
  },
});

const homeRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/",
  component: HomePage,
});

const profileRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/profile/$id",
  component: ProfilePage,
});

const communityRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/community/$skill",
  component: CommunityPage,
});

const requestsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/requests",
  component: RequestsPage,
});

const workerDashboardRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/worker-dashboard",
  component: WorkerDashboardPage,
});

const certificationTestRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/certification-test",
  component: CertificationTestPage,
});

const certificateRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/certificate",
  component: CertificatePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboardPage,
  beforeLoad: () => {
    const user = getAuthUser();
    if (!user || user.role !== "admin") {
      throw redirect({ to: "/login" });
    }
  },
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  adminRoute,
  mainLayoutRoute.addChildren([
    homeRoute,
    profileRoute,
    communityRoute,
    requestsRoute,
    workerDashboardRoute,
    certificationTestRoute,
    certificateRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <LanguageProvider>
      <NotificationsProvider>
        <RouterProvider router={router} />
      </NotificationsProvider>
    </LanguageProvider>
  );
}
