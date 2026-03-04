import { createHashRouter } from "react-router-dom";

import ErrorPage from "@/frontend/pages/error/Error.tsx";


import Home from "@/frontend/pages/home/index.tsx";

export const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,

  },
]);
