import {createHashRouter, Navigate} from "react-router-dom";
import Settings from "./pages/settings/index";
import Dashboard from "./pages/dashboard";
import ErrorPage from "./pages/error/Error";
import ApplicationLayout from "./components/application-layout/layout";
import LoginPage from "./pages/login/login";

const ProtectedRoute = () => {
  const isAuthenticated = !!catcher24WordpressConnector?.userInfo;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <ApplicationLayout />;
};

export const router = createHashRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);
