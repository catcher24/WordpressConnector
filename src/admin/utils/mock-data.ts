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
    type: isWeb ? TargetType.WebApplication : TargetType.Host,
    ip: faker.internet.ipv4(),
    hostname: "www.example.com",
    displayName: "www.example.com",
    preferredDisplayName: "www.example.com",
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
    severity: faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
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
    targetType: TargetType.WebApplication,
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
    alternativeNames: [faker.internet.domainName(), faker.internet.domainName()],
    serialNumber: faker.string.alphanumeric(16).toUpperCase(),
    validFrom: faker.date.past().toISOString(),
    validTo: faker.date.future().toISOString(),
    issuer: "Let's Encrypt R3",
    organization: "Let's Encrypt",
    organizationUnit: "IT Security",
    fingerPrint: faker.string.alphanumeric(40).toUpperCase(),
    signatureAlgorithm: "sha256WithRSAEncryption",
    keyType: "RSA",
    lowestScore: {
      overallRating: faker.number.int({ min: 80, max: 100 }),
      overallGrade: faker.helpers.arrayElement(["A+", "A", "A-", "B"]),
      protocolSupport: 100,
      keyExchangeScore: 90,
      cipherStrength: 90,
      gradeCapReasons: []
    },
    certificateImplementations: [
      {
        id: faker.string.uuid(),
        port: { value: 443, type: PortType.Tcp },
        score: {
          overallRating: 95,
          overallGrade: "A",
          protocolSupport: 100,
          keyExchangeScore: 90,
          cipherStrength: 90,
          gradeCapReasons: []
        },
        protocols: {
          "TLS 1.3": { title: "TLS 1.3", advice: "Supported", severity: 1, isVulnerability: false },
          "TLS 1.2": { title: "TLS 1.2", advice: "Supported", severity: 1, isVulnerability: false }
        },
        ciphers: {
          "TLS_AES_256_GCM_SHA384": { title: "TLS_AES_256_GCM_SHA384", advice: "Strong", severity: 1, isVulnerability: false },
          "TLS_CHACHA20_POLY1305_SHA256": { title: "TLS_CHACHA20_POLY1305_SHA256", advice: "Strong", severity: 1, isVulnerability: false }
        },
        browserSimulations: {},
        serverPreferences: {},
        vulnerabilityIds: []
      }
    ],
    vulnerabilityIds: [],
    targetIds: []
  }));
};

export const generateMockRootDomains = (count: number = 1): DnsRootDomainModel[] => {
  const domain = "example.com";
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    value: domain,
    aRecords: [
      { name: "@", type: "A", address: "93.184.216.34" },
      { name: "www", type: "A", address: "93.184.216.34" }
    ],
    aaaaRecords: [
      { name: "@", type: "AAAA", address: "2606:2800:220:1:248:1893:25c8:1946" }
    ],
    txtRecords: [
      { 
        name: "@", 
        type: "SPF", 
        value: "v=spf1 include:_spf.google.com ~all",
        advice: [
          {
            title: "SPF record is valid",
            advice: "Your SPF record is correctly configured to allow Google Workspace to send emails on your behalf.",
            severity: 1,
            isVulnerability: false
          }
        ]
      },
      { 
        name: "@", 
        type: "Verification", 
        value: "google-site-verification=abc123def456" 
      },
      {
        name: "_key",
        type: "",
        value: "standard-txt-record-value"
      }
    ],
    cnameRecords: [
      { name: "blog", type: "CNAME", target: "ghs.googlehost.com" }
    ],
    mxRecords: [
      { 
        exchange: "aspmx.l.google.com", 
        preference: 1,
        advice: [
          {
            title: "Multiple MX records recommended",
            advice: "It is recommended to have multiple MX records for redundancy. Currently only one is detected.",
            severity: 4,
            isVulnerability: true
          }
        ]
      },
      { exchange: "alt1.aspmx.l.google.com", preference: 5 }
    ],
    srvRecords: [
      { name: "_sip._tcp", target: "sip.example.com", address: "93.184.216.34", port: 5060 }
    ],
    nameServers: [
      { target: "ns1.cloudflare.com", address: "173.245.58.51" },
      { target: "ns2.cloudflare.com", address: "173.245.59.41" }
    ],
    soaRecords: [
      { mName: "ns1.cloudflare.com", address: "hostmaster.example.com" }
    ],
    dnskeyRecords: [
      { flags: 256, protocol: 3, algorithm: 13, publicKey: "MDkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDIgACSYxqbgpJ..." }
    ],
    dsRecords: [
      { algorithm: 13, digestType: 2, digest: "E2D3C91670138ED6122BCCADF04354EB221627848445C51C5D99..." }
    ],
    nsecRecords: [],
    nsec3Records: [
      { value: "2H9A7S9A7S9A7S9A7S9A7S9A7S9A7S9A" }
    ],
    subDomains: [],
    delegatedSubDomains: []
  }));
};
