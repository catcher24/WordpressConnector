export enum TargetType {
  Host = 'host',
  WebApplication = 'webApplication',
}

export const getTargetTypeDisplayName = (targetType: TargetType, options?: { plural?: boolean }): string => {
  const methodDisplayNames: { [key in TargetType]: string } = {
    [TargetType.Host]: 'Infrastructure Device',
    [TargetType.WebApplication]: 'Web Application',
  };

  const pluralDisplayNames: { [key in TargetType]: string } = {
    [TargetType.Host]: 'Infrastructure Devices',
    [TargetType.WebApplication]: 'Web Applications',
  };

  const isPlural = options?.plural;
  return isPlural ? pluralDisplayNames[targetType] : methodDisplayNames[targetType];
};

export const getSeverityLabel = (severity: number): string => {
  if (severity >= 9) return 'Critical';
  if (severity >= 7) return 'High';
  if (severity >= 4) return 'Medium';
  if (severity >= 0.1) return 'Low';
  return 'Noise';
};

export const getSeverityColor = (severity: number): { bg: string; text: string; light: string; border: string } => {
  if (severity >= 9) return { bg: 'bg-severity-critical', text: 'text-severity-critical-dark', light: 'bg-severity-critical-light', border: 'border-severity-critical-dark/20' };
  if (severity >= 7) return { bg: 'bg-severity-high', text: 'text-severity-high-dark', light: 'bg-severity-high-light', border: 'border-severity-high-dark/20' };
  if (severity >= 4) return { bg: 'bg-severity-medium', text: 'text-severity-medium-dark', light: 'bg-severity-medium-light', border: 'border-severity-medium-dark/20' };
  if (severity >= 0.1) return { bg: 'bg-severity-low', text: 'text-severity-low-dark', light: 'bg-severity-low-light', border: 'border-severity-low-dark/20' };
  return { bg: 'bg-severity-noise', text: 'text-severity-noise-dark', light: 'bg-severity-noise-light', border: 'border-severity-noise-dark/20' };
};

export enum CollectorStatus {
  Created = "Created",
  Starting = "Starting",
  Running = "Running",
  Completed = "Completed",
  Failed = "Failed",
  Cancelled = "Cancelled"
}

export enum VulnerabilitySeverity {
  Noise = "Noise",
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Critical = "Critical"
}

export interface DnsAdviceModel {
  title: string;
  advice: string;
  severity: number;
  isVulnerability: boolean;
}

export interface PackageCountModel {
  packageId: string;
  unitCount: number;
}

export interface SubscriptionModel {
  status: number;
  tenantOrganizationPackages?: Record<string, Record<string, PackageCountModel>>;
}

export interface UsageMetricsModel {
  targetTypeCounts?: Record<string, number>;
}

export interface OrganizationModel {
  id: string;
  tenantId: string;
  name: string;
  isActive: boolean;
  isTrial: boolean;
  subscription?: SubscriptionModel;
  usageMetrics?: UsageMetricsModel;
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
  severity: VulnerabilitySeverity | number;
  summary: string;
  insight: string;
  affected: string;
  impact: string;
  vulnerabilityDetectionMethod: string;
  cves: any[];
  targetIds: string[];
  occurrences: number;
}

export interface ScanRunnerModel {
  collectorId: string;
  collectorSpecializationId: string;
  progression: number | null;
  startedAt: string | null;
  endedAt: string | null;
  collectorType: number;
  collectorStatus: CollectorStatus | number;
  configuration: any;
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
  runners: ScanRunnerModel[];
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
  lowestScore?: {
    overallRating: number;
    overallGrade: string;
    protocolSupport: number;
    keyExchangeScore: number;
    cipherStrength: number;
    gradeCapReasons: string[];
  };
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
