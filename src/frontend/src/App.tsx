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
    actor.init().catch((err: unknown) => {
      console.error("Failed to initialize backend:", err);
    });
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

const routeTree = rootRoute.addChildren([
  loginRoute,
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
