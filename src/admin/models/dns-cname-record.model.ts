/**
 * Represents a DNS CNAME record with associated metadata.
 *
 * @property id - Unique identifier for the CNAME record.
 * @property name - The DNS name for this record.
 * @property target - The canonical name (target) this record points to.
 * @property startedAt - Timestamp when the CNAME record became active.
 * @property endedAt - Timestamp when the CNAME record became inactive.
 * @property targetIds - Array of target IDs related to this record.
 */
export class DnsCnameRecordModel {
  id!: string;
  name!: string;
  target!: string;
  startedAt!: Date;
  endedAt!: Date;
  targetIds!: string[];

  /**
   * Type assertion utility to cast an unknown value to DnsCnameRecordModel.
   * @param unknownType - The value to cast.
   * @returns The value as a DnsCnameRecordModel.
   */
  static asDnsCnameRecordModel = (unknownType: unknown) => unknownType as DnsCnameRecordModel;
}
