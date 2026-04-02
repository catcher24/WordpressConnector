/**
 * Represents a DNS AAAA record (IPv6) with associated metadata.
 *
 * @property id - Unique identifier for the AAAA record.
 * @property name - The DNS name for this record.
 * @property address - The IPv6 address associated with this record.
 * @property targetIds - Array of target IDs related to this record.
 * @property startedAt - Timestamp when the AAAA record became active.
 * @property endedAt - Timestamp when the AAAA record became inactive.
 */
export class DnsAAAARecordModel {
  id!: string;
  name!: string;
  address!: string;
  targetIds!: string[];
  startedAt!: Date;
  endedAt!: Date;

  /**
   * Type assertion utility to cast an unknown value to DnsAAAARecordModel.
   * @param unknownType - The value to cast.
   * @returns The value as a DnsAAAARecordModel.
   */
  static asDnsAAAARecordModel = (unknownType: unknown) => unknownType as DnsAAAARecordModel;
}
