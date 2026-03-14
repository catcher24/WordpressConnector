import { PortType, TargetType } from './enums';

export { PortType }; // re-export for backward compat

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
