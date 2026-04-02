import { DnsAdviceModel } from './dns-advice.model';

/**
 * Represents a DNS MX record with associated advice and timestamps.
 *
 * @property id - Unique identifier for the MX record.
 * @property exchange - The mail exchange server for this record.
 * @property advice - Array of DNS advice objects related to this MX record.
 * @property startedAt - Timestamp when the MX record became active.
 * @property endedAt - Timestamp when the MX record became inactive.
 */
export class DnsMxRecordModel {
  id!: string;
  exchange!: string;
  advice!: DnsAdviceModel[];
  startedAt!: Date;
  endedAt!: Date;

  /**
   * Type assertion utility to cast an unknown value to DnsMxRecordModel.
   * @param unknownType - The value to cast.
   * @returns The value as a DnsMxRecordModel.
   */
  static asDnsMxRecordModel = (unknownType: unknown) => unknownType as DnsMxRecordModel;

  /**
   * Returns a deduplicated and sorted array of advice from a list of MX records.
   * Deduplication is based on the advice string, and sorting is by severity descending.
   *
   * @param mxRecords - Array of DnsMxRecordModel instances.
   * @returns Array of unique DnsAdviceModel objects, sorted by severity.
   */
  static getDeduplicatedAdvice(mxRecords: DnsMxRecordModel[]): DnsAdviceModel[] {
    const uniqueAdviceMap = new Map<string, DnsAdviceModel>();

    mxRecords.forEach(record => {
      if (record.advice && record.advice.length > 0) {
        record.advice.forEach(adviceItem => {
          if (!uniqueAdviceMap.has(adviceItem.advice)) {
            uniqueAdviceMap.set(adviceItem.advice, adviceItem);
          }
        });
      }
    });

    return Array.from(uniqueAdviceMap.values()).sort((a, b) => b.severity - a.severity);
  }
}
