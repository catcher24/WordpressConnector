import type { Preview } from "@storybook/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { CustomTailwind } from "../src/admin/main";
import "../src/admin/index.css"; // Tailwind 

(window as any).catcher24WordpressConnector = {
  siteHostname: "example.com",
  siteName: "My WordPress Site",
  organizationId: "org-123",
  targetId: "target-123",
  apiUrl: "http://localhost/wp-json/catcher24/v1",
  dashboardUrl: "https://catcher24.com/dashboard",
  organization: { id: "org-123", identifier: "org-123", displayName: "SaaS Dev Org" },
  userInfo: { email: "admin@example.com", first_name: "Admin", last_name: "User" }
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <PrimeReactProvider value={{ unstyled: true, pt: CustomTailwind, ptOptions: { mergeSections: true } }}>
        <div className="bg-white min-h-screen text-slate-800">
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </div>
      </PrimeReactProvider>
    ),
  ],
};

export default preview;
