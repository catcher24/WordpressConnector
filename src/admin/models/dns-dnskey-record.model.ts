/**
 * Represents a DNSKEY record model for DNS management.
 *
 * @property id - Unique identifier for the DNSKEY record.
 * @property flags - Flags associated with the DNSKEY record.
 * @property protocol - Protocol number for the DNSKEY record.
 * @property algorithm - Algorithm used for the DNSKEY record.
 * @property publicKey - Public key value for the DNSKEY record.
 * @property startedAt - Start date/time for the DNSKEY record validity.
 * @property endedAt - End date/time for the DNSKEY record validity.
 */
export class DnsDnskeyRecordModel {
  id!: string;
  flags!: number;
  protocol!: number;
  algorithm!: string;
  publicKey!: string;
  startedAt!: Date;
  endedAt!: Date;

  /**
   * Type assertion helper to cast an unknown value to DnsDnskeyRecordModel.
   *
   * @param unknownType - The value to cast.
   * @returns The value cast as DnsDnskeyRecordModel.
   */
  static asDnsDnskeyRecordModel = (unknownType: unknown): DnsDnskeyRecordModel => unknownType as DnsDnskeyRecordModel;
}
