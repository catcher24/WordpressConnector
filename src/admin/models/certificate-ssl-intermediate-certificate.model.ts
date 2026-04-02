export class CertificateSslIntermediateCertificateModel {
  subject!: string;
  fingerprint!: string | null;
  issuer!: string | null;
  organization!: string | null;
  organizationUnit!: string | null;
  validFrom!: Date;
  validTo!: Date;
}
