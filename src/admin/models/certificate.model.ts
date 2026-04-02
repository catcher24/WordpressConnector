import { CertificateSslScoreModel } from './certificate-ssl-score.model';
import { CertificateSslIntermediateCertificateModel } from './certificate-ssl-intermediate-certificate.model';
import { CertificateImplementationModel } from './certificate-implementation.model';

export class CertificateModel {
  id!: string;
  commonName!: string;
  alternativeNames!: string[];
  serialNumber!: string;
  validFrom!: Date;
  validTo!: Date;
  issuer!: string;
  organization!: string | null;
  organizationUnit!: string | null;
  fingerPrint!: string | null;
  signatureAlgorithm!: string | null;
  certificateTransparency?: string | null;
  chainIssues?: string | null;
  lowestScore?: CertificateSslScoreModel;
  intermediateCertificates!: CertificateSslIntermediateCertificateModel[];
  keyType!: string | null;
  certificateImplementations!: CertificateImplementationModel[];
  vulnerabilityIds!: string[];
  targetIds!: string[];

  static asCertificateModel = (unknownType: unknown) => unknownType as CertificateModel;
}
