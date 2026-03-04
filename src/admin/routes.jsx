import { createHashRouter } from "react-router-dom";
import ApplicationLayout from "../components/application-layout/LayoutOne.jsx";
import Settings from "./pages/settings/index.jsx";
import ErrorPage from "./pages/error/Error.tsx";
import Inbox from "./pages/inbox/index.jsx";
import Dashboard from "./pages/dashboard/index.jsx";
import LoginPage from "./pages/login/index.jsx";
import Charts from "./pages/charts/index.jsx";

export const router = createHashRouter([
  {
    path: "/",
    element: <ApplicationLayout />,
    errorElement: <ErrorPage />,
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
        path: "inbox",
        element: <Inbox />,
      },

      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "charts",
        element: <Charts />,
      }
    ],
  },
]);
