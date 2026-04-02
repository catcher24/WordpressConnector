/**
 * Represents a DNS NSEC3 record model for DNS management.
 *
 * @property id - Unique identifier for the NSEC3 record.
 * @property value - Value of the NSEC3 record.
 * @property startedAt - Start date/time for the NSEC3 record validity.
 * @property endedAt - End date/time for the NSEC3 record validity.
 */
export class DnsNsec3RecordModel {
  id!: string;
  value!: string;
  startedAt!: Date;
  endedAt!: Date;

  /**
   * Type assertion helper to cast an unknown value to DnsNsec3RecordModel.
   *
   * @param unknownType - The value to cast.
   * @returns The value cast as DnsNsec3RecordModel.
   */
  static asDnsNsec3RecordModel = (unknownType: unknown): DnsNsec3RecordModel => unknownType as DnsNsec3RecordModel;
}
