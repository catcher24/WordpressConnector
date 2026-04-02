export class CertificateSslScoreModel {
  overallRating!: number;
  protocolSupport!: number;
  keyExchangeScore!: number;
  cipherStrength!: number;
  overallGrade!: string;
  gradeCapReasons!: string[];

  static asCertificateSslScoreModel = (unknownType: unknown) => unknownType as CertificateSslScoreModel;
}
