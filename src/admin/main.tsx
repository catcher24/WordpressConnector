import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { PrimeReactProvider } from "primereact/api";
import { CustomTailwind } from "./prime-config";


const el = document.getElementById("catcher24Connector");
if (el) {
  ReactDOM.createRoot(el).render(
    <PrimeReactProvider
      value={{
        unstyled: true,
        appendTo: el,
        pt: CustomTailwind,
        ptOptions: { mergeSections: true },
      }}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </PrimeReactProvider>,
  );
}
