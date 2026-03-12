export enum TargetType {
  Web = 0,
  Network = 1,
}

export enum PortType {
  Tcp = 0,
  Udp = 1,
}

export interface TargetPortModel {
  type: PortType;
  value: number;
  severity: SeverityModel;
  mostSevereVulnerability: VulnerabilityModel;
  vulnerabilityIds: string[];
  silencedVulnerabilityIds: string[];
  assetVersionIds: string[];
}

export interface SeverityModel {
  critical: number;
  high: number;
  medium: number;
  low: number;
  noise: number;
}

export interface TargetModel {
  id: string;
  tenantId: string;
  organizationId: string;
  type: TargetType;
  ip?: string;
  hostname?: string;
  displayName?: string;
  preferredDisplayName: string;
  assetCount: number;
  detectionCount: number;
  scannerConfigurations: any[];
  severity: SeverityModel;
  mostSevereVulnerability?: VulnerabilityModel;
  lastScan?: ScanModel;
  scheduledForDeletionAt?: string;
  portCount: number;
}

export interface VulnerabilityModel {
  id: string;
  name: string;
  displayName: string;
  family: string;
  severity: number;
  summary: string;
  insight: string;
  affected: string;
  impact: string;
  vulnerabilityDetectionMethod: string;
  cves: any[];
  targetIds: string[];
  occurrences: number;
}

export interface ScanModel {
  id: string;
  tenantId: string;
  organizationId: string;
  scannerId: string;
  targetId: string;
  targetType: TargetType;
  startedAt: string;
  endedAt?: string;
  runners: any[];
}

export interface CertificatePortModel {
  type: PortType;
  value: number;
}

export interface CertificateImplementationModel {
  id: string;
  score: any | undefined;
  protocols: { [key: string]: any };
  ciphers: { [key: string]: any };
  browserSimulations: { [key: string]: any };
  serverPreferences: { [key: string]: any };
  port: CertificatePortModel;
  vulnerabilityIds: string[];
  targetId?: string;
  targetType?: TargetType;
}

export interface CertificateModel {
  id: string;
  commonName: string;
  alternativeNames: string[];
  serialNumber: string;
  validFrom: string;
  validTo: string;
  issuer: string;
  organization: string | null;
  organizationUnit: string | null;
  fingerPrint: string | null;
  signatureAlgorithm: string | null;
  certificateTransparency?: string | null;
  chainIssues?: string | null;
  keyType: string | null;
  certificateImplementations: CertificateImplementationModel[];
  vulnerabilityIds: string[];
  targetIds: string[];
}

export interface DnsSubDomainModel {
  id: string;
  value: string;
  subDomains: DnsSubDomainModel[];
  delegatedSubDomains: DnsSubDomainModel[];
  aRecords: any[];
  aaaaRecords: any[];
  txtRecords: any[];
  cnameRecords: any[];
  mxRecords: any[];
  srvRecords: any[];
  nameServers: any[];
  soaRecords: any[];
  dnskeyRecords: any[];
  dsRecords: any[];
  nsecRecords: any[];
  nsec3Records: any[];
}

export interface DnsRootDomainModel {
  id: string;
  value: string;
  aRecords: any[];
  aaaaRecords: any[];
  txtRecords: any[];
  cnameRecords: any[];
  mxRecords: any[];
  srvRecords: any[];
  nameServers: any[];
  soaRecords: any[];
  dnskeyRecords: any[];
  dsRecords: any[];
  nsecRecords: any[];
  nsec3Records: any[];
  subDomains: DnsSubDomainModel[];
  delegatedSubDomains: DnsSubDomainModel[];
}
