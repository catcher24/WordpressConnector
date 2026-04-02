/**
 * Represents a DNS A record with associated metadata.
 *
 * @property id - Unique identifier for the A record.
 * @property name - The DNS name for this record.
 * @property address - The IPv4 address associated with this record.
 * @property startedAt - Timestamp when the A record became active.
 * @property endedAt - Timestamp when the A record became inactive.
 * @property targetIds - Array of target IDs related to this record.
 */
export class DnsARecordModel {
  id!: string;
  name!: string;
  address!: string;
  startedAt!: Date;
  endedAt!: Date;
  targetIds!: string[];

  /**
   * Type assertion utility to cast an unknown value to DnsARecordModel.
   * @param unknownType - The value to cast.
   * @returns The value as a DnsARecordModel.
   */
  static asDnsARecordModel = (unknownType: unknown) => unknownType as DnsARecordModel;
}
