import { DnsAdviceModel } from './dns-advice.model';

/**
 * Represents a DNS TXT record model.
 *
 * @property id - Unique identifier for the TXT record.
 * @property type - Optional type of the TXT record.
 * @property name - Name of the TXT record.
 * @property value - Value of the TXT record.
 * @property advice - Array of DNS advice objects associated with the record.
 * @property startedAt - Timestamp when the TXT record became active.
 * @property endedAt - Timestamp when the TXT record became inactive.
 */
export class DnsTxtRecordModel {
  id!: string;
  type?: string;
  name!: string;
  value!: string;
  advice!: DnsAdviceModel[];
  startedAt!: Date;
  endedAt!: Date;

  /**
   * Type assertion utility to cast an unknown value to DnsTxtRecordModel.
   * @param unknownType - The value to cast.
   * @returns The value as a DnsTxtRecordModel.
   */
  static asDnsTxtRecordModel = (unknownType: unknown) => unknownType as DnsTxtRecordModel;

  /**
   * Returns a deduplicated and sorted array of DNS advice from a list of TXT records.
   * Deduplication is based on the advice string, and sorting is by severity descending.
   *
   * @param txtRecords - Array of DnsTxtRecordModel instances.
   * @returns Array of unique DnsAdviceModel objects sorted by severity.
   */
  static getDeduplicatedAdvice(txtRecords: DnsTxtRecordModel[]): DnsAdviceModel[] {
    const uniqueAdviceMap = new Map<string, DnsAdviceModel>();

    txtRecords.forEach(record => {
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
