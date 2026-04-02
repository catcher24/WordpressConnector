/**
 * Represents a DNS NSEC record model for DNS management.
 *
 * @property id - Unique identifier for the NSEC record.
 * @property value - Value of the NSEC record.
 * @property startedAt - Start date/time for the NSEC record validity.
 * @property endedAt - End date/time for the NSEC record validity.
 */
export class DnsNsecRecordModel {
  id!: string;
  value!: string;
  startedAt!: Date;
  endedAt!: Date;

  /**
   * Type assertion helper to cast an unknown value to DnsNsecRecordModel.
   *
   * @param {unknown} unknownType - The value to cast.
   * @returns {DnsNsecRecordModel} The value cast as DnsNsecRecordModel.
   */
  static asDnsNsecRecordModel = (unknownType: unknown): DnsNsecRecordModel => unknownType as DnsNsecRecordModel;
}
