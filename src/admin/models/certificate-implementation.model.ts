import { CertificateSslScoreModel } from './certificate-ssl-score.model';
import { CertificateSslFinding } from './certificate-ssl-finding';
import { CertificatePortModel } from './certificate-port.model';
import { TargetType } from '../enums';

/**
 * Model representing the detailed implementation information of an SSL/TLS certificate.
 * Contains comprehensive data about SSL/TLS configuration, security scores, supported protocols,
 * cipher suites, browser compatibility, server preferences, and identified vulnerabilities.
 */
export class CertificateImplementationModel {
  /** Unique identifier for the certificate implementation */
  id!: string;

  /** SSL/TLS security score and rating information for the certificate */
  score: CertificateSslScoreModel | undefined;

  /** Map of supported SSL/TLS protocols and their configuration findings */
  protocols!: { [key: string]: CertificateSslFinding };

  /** Map of supported cipher suites and their security findings */
  ciphers!: { [key: string]: CertificateSslFinding };

  /** Map of browser simulation results showing compatibility across different browsers */
  browserSimulations!: { [key: string]: CertificateSslFinding };

  /** Map of server SSL/TLS preferences and configuration settings */
  serverPreferences!: { [key: string]: CertificateSslFinding };

  /** Port information where the SSL/TLS certificate is implemented */
  port!: CertificatePortModel;

  /** Array of vulnerability identifiers associated with this certificate implementation */
  vulnerabilityIds!: string[];

  /** Optional identifier of the target where this certificate is deployed */
  targetId?: string;

  /** Optional identifier of the target type using this certificate */
  targetType?: TargetType;

  /**
   * Type casting utility method to convert unknown type to CertificateImplementationModel
   * @param unknownType - The unknown type to cast
   * @returns The input cast as CertificateImplementationModel
   */
  static asCertificateImplementationModel = (unknownType: unknown) => unknownType as CertificateImplementationModel;
}
