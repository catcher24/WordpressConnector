/**
 * Represents a DNS SOA (Start of Authority) record model for DNS management.
 *
 * @property id - Unique identifier for the SOA record.
 * @property mName - Primary master name server for the SOA record.
 * @property address - IP address associated with the SOA record.
 * @property startedAt - Start date/time for the SOA record validity.
 * @property endedAt - End date/time for the SOA record validity.
 */
export class DnsSoaRecordModel {
  id!: string;
  mName!: string;
  address!: string;
  startedAt!: Date;
  endedAt!: Date;

  /**
   * Type assertion helper to cast an unknown value to DnsSoaRecordModel.
   *
   * @param unknownType - The value to cast.
   * @returns The value cast as DnsSoaRecordModel.
   */
  static asDnsSoaRecordModel = (unknownType: unknown) => unknownType as DnsSoaRecordModel;
}
