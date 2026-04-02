/**
 * Represents a DNS DS (Delegation Signer) record model for DNS management.
 *
 * @property id - Unique identifier for the DS record.
 * @property algorithm - Algorithm used for the DS record.
 * @property digestType - Digest type for the DS record.
 * @property digest - Digest value for the DS record.
 * @property startedAt - Start date/time for the DS record validity.
 * @property endedAt - End date/time for the DS record validity.
 */
export class DnsDsRecordModel {
  id!: string;
  algorithm!: string;
  digestType!: string;
  digest!: string;
  startedAt!: Date;
  endedAt!: Date;

  /**
   * Type assertion helper to cast an unknown value to DnsDsRecordModel.
   *
   * @param unknownType - The value to cast.
   * @returns The value cast as DnsDsRecordModel.
   */
  static asDnsDsRecordModel = (unknownType: unknown): DnsDsRecordModel => unknownType as DnsDsRecordModel;
}
