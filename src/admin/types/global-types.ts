declare const catcher24Connector: {
  developer: string;
  isAdmin: boolean;
  targetId?: string;
  organizationId?: string;
  organization?: any;
  hasSingleOrganization?: boolean;
  dashboardUrl: string;
  apiUrl: string;
  userInfo: {
    email: string;
    first_name: string;
    last_name: string;
  } | null;
  siteName: string;
  siteHostname: string;
  nonce: string;
  php2shell: {
    phpVersion: string;
    fixedVersion: string;
    confirmUrl: string;
    siteHealthUrl: string;
    advisoryUrl: string;
  } | null;
};
