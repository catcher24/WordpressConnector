/**
 * Represents a DNS SRV (Service) record model for DNS management.
 *
 * @property id - Unique identifier for the SRV record.
 * @property name - Service name for the SRV record.
 * @property target - Target host for the SRV record.
 * @property address - IP address associated with the SRV record.
 * @property port - Port number for the service.
 * @property startedAt - Start date/time for the SRV record validity.
 * @property endedAt - End date/time for the SRV record validity.
 */
export class DnsSrvRecordModel {
  id!: string;
  name!: string;
  target!: string;
  address!: string;
  port!: number;
  startedAt!: Date;
  endedAt!: Date;

  /**
   * Type assertion helper to cast an unknown value to DnsSrvRecordModel.
   *
   * @param unknownType - The value to cast.
   * @returns The value cast as DnsSrvRecordModel.
   */
  static asSrvRecordModel = (unknownType: unknown) => unknownType as DnsSrvRecordModel;
}
