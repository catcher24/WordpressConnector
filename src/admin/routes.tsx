import { createHashRouter, Navigate, Outlet } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import ErrorPage from "./pages/error/Error";
import ApplicationLayout from "./components/application-layout/layout";
import LoginPage from "./pages/login/login";
import SetupWizard from "./pages/setup/setup";
import {SettingsForm} from "./pages/settings/settings";

const RequireAuth = () => {
  const isAuthenticated = !!catcher24WordpressConnector?.userInfo;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

/**
 * Gatekeeper for the Setup flow.
 * If the user has both an Org and a Target, they see the Dashboard/Layout.
 * Otherwise, they are redirected to the Wizard.
 */
const RequireSetup = () => {
  const hasOrg = !!catcher24WordpressConnector?.organizationId;
  const hasTarget = !!catcher24WordpressConnector?.targetId;

  if (!hasOrg || !hasTarget) {
    return <Navigate to="/setup" replace />;
  }

  return <Outlet />;
};

export const router = createHashRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <RequireAuth />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <ApplicationLayout />,
        children: [
          {
            path: "/setup",
            element: <SetupWizard />,
          },
          {
            element: <RequireSetup />,
            children: [
              {
                path: "/",
                element: <Dashboard />,
              },
              {
                path: "dashboard",
                element: <Dashboard />,
              },
              {
                path: "settings",
                element: <SettingsForm />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
