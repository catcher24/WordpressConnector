import { faker } from "@faker-js/faker";
import { 
  TargetModel, 
  VulnerabilityModel, 
  ScanModel, 
  CertificateModel, 
  DnsRootDomainModel, 
  TargetPortModel,
  TargetType,
  PortType,
  SeverityModel,
  VulnerabilitySeverity,
  CollectorStatus
} from "../models/shared";

// Seed the faker so we get mostly consistent mock data across story renders
faker.seed(12345);

export const generateMockOrganization = (id?: string) => ({
  id: id || faker.string.uuid(),
  name: faker.company.name(),
  hasValidSubscription: true,
  webApplicationUsage: faker.number.int({ min: 1, max: 10 }),
  totalWebApplications: faker.number.int({ min: 10, max: 20 }),
});

export const generateMockTarget = (overrides: Partial<TargetModel> = {}): TargetModel => {
  const isWeb = true; // Default to web for most stories
  const id = overrides.id || faker.string.uuid();
  return {
    id,
    tenantId: faker.string.uuid(),
    organizationId: faker.string.uuid(),
    type: isWeb ? TargetType.Web : TargetType.Network,
    ip: faker.internet.ipv4(),
    hostname: faker.internet.domainName(),
    displayName: faker.internet.domainName(),
    preferredDisplayName: faker.internet.domainName(),
    assetCount: faker.number.int({ min: 1, max: 10 }),
    detectionCount: faker.number.int({ min: 1, max: 100 }),
    scannerConfigurations: [],
    severity: {
      critical: faker.number.int({ min: 0, max: 5 }),
      high: faker.number.int({ min: 0, max: 15 }),
      medium: faker.number.int({ min: 0, max: 30 }),
      low: faker.number.int({ min: 0, max: 100 }),
      noise: faker.number.int({ min: 0, max: 20 }),
    },
    portCount: faker.number.int({ min: 1, max: 5 }),
    ...overrides
  };
};

export const generateMockVulnerabilities = (count: number = 5): VulnerabilityModel[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.hacker.phrase(),
    displayName: faker.company.catchPhrase(),
    family: faker.hacker.noun(),
    severity: faker.helpers.arrayElement([
      VulnerabilitySeverity.Noise, 
      VulnerabilitySeverity.Low, 
      VulnerabilitySeverity.Medium, 
      VulnerabilitySeverity.High, 
      VulnerabilitySeverity.Critical
    ]),
    summary: faker.lorem.paragraph(),
    insight: faker.lorem.sentences(2),
    affected: faker.system.filePath(),
    impact: faker.lorem.sentence(),
    vulnerabilityDetectionMethod: faker.hacker.verb(),
    cves: [],
    targetIds: [faker.string.uuid()],
    occurrences: faker.number.int({ min: 1, max: 5 })
  }));
};

export const generateMockScans = (count: number = 3, active: boolean = false): ScanModel[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    tenantId: faker.string.uuid(),
    organizationId: faker.string.uuid(),
    scannerId: faker.string.uuid(),
    targetId: faker.string.uuid(),
    targetType: TargetType.Web,
    startedAt: faker.date.recent().toISOString(),
    endedAt: active ? undefined : faker.date.recent().toISOString(),
    runners: [
      {
        collectorId: faker.string.uuid(),
        collectorType: faker.number.int({ min: 1, max: 10 }),
        collectorStatus: active ? faker.helpers.arrayElement([CollectorStatus.Created, CollectorStatus.Starting, CollectorStatus.Running]) : faker.helpers.arrayElement([CollectorStatus.Completed, CollectorStatus.Failed, CollectorStatus.Cancelled]),
        startedAt: faker.date.recent().toISOString(),
        endedAt: active ? undefined : faker.date.recent().toISOString(),
        progression: active ? faker.number.int({ min: 10, max: 90 }) : 100,
        configuration: {
          displayName: faker.hacker.noun(),
          timeout: faker.number.int({ min: 30000, max: 120000 }),
          averageDuration: "00:02:45",
          timeoutDuration: "00:15:00"
        }
      },
      {
        collectorId: faker.string.uuid(),
        collectorType: faker.number.int({ min: 1, max: 10 }),
        collectorStatus: active ? faker.helpers.arrayElement([CollectorStatus.Created, CollectorStatus.Starting, CollectorStatus.Running]) : faker.helpers.arrayElement([CollectorStatus.Completed, CollectorStatus.Failed, CollectorStatus.Cancelled]),
        startedAt: faker.date.recent().toISOString(),
        endedAt: active ? undefined : faker.date.recent().toISOString(),
        progression: active ? faker.number.int({ min: 10, max: 90 }) : 100,
        configuration: {
          displayName: faker.hacker.noun(),
          timeout: faker.number.int({ min: 30000, max: 120000 }),
          averageDuration: "00:04:10",
          timeoutDuration: "00:10:00"
        }
      }
    ],
    // properties used by Dashboard component:
    status: active ? faker.helpers.arrayElement([0, 1, 2, 3]) : faker.helpers.arrayElement([4, 5, 6]),
    progress: active ? faker.number.int({ min: 10, max: 90 }) : 100,
    scanStrategyName: faker.hacker.noun()
  } as any));
};

export const generateMockPorts = (count: number = 4): TargetPortModel[] => {
  return Array.from({ length: count }).map(() => ({
    type: PortType.Tcp,
    value: faker.number.int({ min: 20, max: 8080 }),
    severity: { critical: 0, high: 0, medium: 0, low: 0, noise: 0, success: 0 },
    mostSevereVulnerability: {} as any,
    vulnerabilityIds: [],
    silencedVulnerabilityIds: [],
    assetVersionIds: []
  }));
};

export const generateMockCertificates = (count: number = 2): CertificateModel[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    commonName: faker.internet.domainName(),
    alternativeNames: [faker.internet.domainName()],
    serialNumber: faker.string.alphanumeric(16),
    validFrom: faker.date.past().toISOString(),
    validTo: faker.date.future().toISOString(),
    issuer: faker.company.name(),
    organization: faker.company.name(),
    organizationUnit: "IT",
    fingerPrint: faker.string.alphanumeric(32),
    signatureAlgorithm: "sha256WithRSAEncryption",
    keyType: "RSA",
    certificateImplementations: [],
    vulnerabilityIds: [],
    targetIds: []
  }));
};

export const generateMockRootDomains = (count: number = 1): DnsRootDomainModel[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    value: faker.internet.domainName(),
    aRecords: [
      { name: "@", type: "A", address: faker.internet.ipv4() },
      { name: "www", type: "A", address: faker.internet.ipv4() }
    ],
    aaaaRecords: [],
    txtRecords: [
      { type: "SPF", value: "v=spf1 include:_spf.google.com ~all", records: [{ value: "v=spf1 include:_spf.google.com ~all" }] }
    ],
    cnameRecords: [],
    mxRecords: [
      { exchange: `mail.${faker.internet.domainName()}`, preference: 10 }
    ],
    srvRecords: [],
    nameServers: [
      { address: "ns1.cloudflare.com" },
      { address: "ns2.cloudflare.com" }
    ],
    soaRecords: [],
    dnskeyRecords: [],
    dsRecords: [],
    nsecRecords: [],
    nsec3Records: [],
    subDomains: [],
    delegatedSubDomains: []
  }));
};
