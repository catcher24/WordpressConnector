import {
  generateMockTarget,
  generateMockVulnerabilities,
  generateMockScans,
  generateMockPorts,
  generateMockCertificates,
  generateMockRootDomains,
  generateMockOrganization,
  generateMockCollectors,
  generateMockCollectorGroups,
  generateMockScanners,
} from './mock-data';

const originalFetch = window.fetch;

export const setupStorybookMocks = (customMocks: any = {}) => {
  // 1. Setup the global WordPress connector object
  (window as any).catcher24WordpressConnector = {
    siteHostname: customMocks.connector?.siteHostname || "example.com",
    siteName: customMocks.connector?.siteName || "My WordPress Site",
    organizationId: customMocks.connector?.organizationId || "org-123",
    targetId: customMocks.connector?.targetId || "target-123",
    apiUrl: customMocks.connector?.apiUrl || "http://localhost/wp-json/catcher24/v1",
    dashboardUrl: customMocks.connector?.dashboardUrl || "https://catcher24.com/dashboard",
    organization: customMocks.connector?.organization || generateMockOrganization("org-123"),
    ...customMocks.connector,
  };

  // 2. Setup the global fetch interceptor
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();

    // Simulate network delay to test loading states
    await new Promise((resolve) => setTimeout(resolve, customMocks.delay ?? 400));

    const respondWith = (data: any, status = 200) => {
      return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: async () => data,
      } as Response);
    };

    if (url.includes("/organizations")) {
      return respondWith(customMocks.organizations || [generateMockOrganization("org-123"), generateMockOrganization()]);
    }

    if (
      url.includes("/targets") &&
      !url.includes("/vulnerabilities") &&
      !url.includes("/scans") &&
      !url.includes("/certificates") &&
      !url.includes("/rootDomains") &&
      !url.includes("/ports") &&
      !url.includes("/select") &&
      !url.includes("/scanners")
    ) {
      if (url.match(/\/targets\/[a-zA-Z0-9-]+$/)) {
        return respondWith(
          customMocks.target ||
            generateMockTarget({ id: "target-123", hostname: "example.com", preferredDisplayName: "My WordPress Site" })
        );
      }
      return respondWith({
        items:
          customMocks.targets || [
            generateMockTarget({ id: "target-123", hostname: "example.com", preferredDisplayName: "My WordPress Site" }),
            generateMockTarget(),
          ],
      });
    }

    if (url.includes("/vulnerabilities")) return respondWith({ items: customMocks.vulnerabilities || generateMockVulnerabilities(15) });

    if (url.includes("/scans")) {
      if (url.includes("endedAt=") || url.includes("endedAt%3D"))
        return respondWith({ items: customMocks.activeScans || generateMockScans(1, true) });
      return respondWith({ items: customMocks.recentScans || generateMockScans(5, false) });
    }

    if (url.includes("/certificates")) return respondWith({ items: customMocks.certificates || generateMockCertificates(2) });
    if (url.includes("/rootDomains")) return respondWith({ items: customMocks.rootDomains || generateMockRootDomains(1) });
    if (url.includes("/ports")) return respondWith({ items: customMocks.ports || generateMockPorts(4) });

    // Scanner / collector group endpoints
    if (url.includes("/scanners")) return respondWith({ items: customMocks.scanners || generateMockScanners() });
    if (url.includes("/collectorGroups")) return respondWith({ items: customMocks.collectorGroups || generateMockCollectorGroups() });
    if (url.includes("/collectors")) return respondWith({ items: customMocks.collectors || generateMockCollectors() });

    if (url.includes("/hub/public/negotiate")) return respondWith({ url: "mock", accessToken: "mock" }); // Prevent SignalR crash

    if (url.includes("/start") && init?.method === "POST") {
      return respondWith(generateMockScans(1, true)[0]);
    }

    if (url.includes("/cancel") && init?.method === "POST") {
      return respondWith(generateMockScans(1, false)[0]);
    }

    // Catch-all for POST/PUT /select or /targets creations
    if (url.includes("/select") || init?.method === "POST" || init?.method === "PUT") {
      return respondWith({ message: "Success", id: "new-target" });
    }

    console.warn("Unmocked fetch request in Storybook:", url);
    return originalFetch(input, init);
  };
};

export const restoreMocks = () => {
  window.fetch = originalFetch;
};
