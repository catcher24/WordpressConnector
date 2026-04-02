/**
 * Represents a DNS advice item with severity and vulnerability indication.
 *
 * @property title - The title of the advice.
 * @property advice - The advice message or description.
 * @property severity - Numeric severity level of the advice.
 * @property isVulnerability - Indicates if the advice is related to a vulnerability.
 */
export class DnsAdviceModel {
  title!: string;
  advice!: string;
  severity!: number;
  isVulnerability!: boolean;

  /**
   * Type assertion utility to cast an unknown value to DnsAdviceModel.
   * @param unknownType - The value to cast.
   * @returns The value as a DnsAdviceModel.
   */
  static asDnsAdviceModel = (unknownType: unknown) => unknownType as DnsAdviceModel;
}
