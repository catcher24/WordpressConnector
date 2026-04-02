/**
 * Represents a DNS name server record with associated metadata.
 *
 * @property id - Unique identifier for the name server record.
 * @property target - The DNS target name for this record.
 * @property address - The IP address associated with this name server.
 * @property startedAt - Timestamp when the name server record became active.
 * @property endedAt - Timestamp when the name server record became inactive.
 */
export class DnsNameServerModel {
  id!: string;
  target!: string;
  address!: string;
  startedAt!: Date;
  endedAt!: Date;

  /**
   * Type assertion utility to cast an unknown value to DnsNameServerModel.
   * @param unknownType - The value to cast.
   * @returns The value as a DnsNameServerModel.
   */
  static asDnsNameServerModel = (unknownType: unknown) => unknownType as DnsNameServerModel;
}
