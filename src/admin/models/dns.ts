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


export class DnsSubDomainModel {
  id!: string;
  value!: string;
  advice!: DnsAdviceModel[];
  aRecords!: DnsARecordModel[];
  aaaaRecords!: DnsAAAARecordModel[];
  txtRecords!: DnsTxtRecordModel[];
  cnameRecords!: DnsCnameRecordModel[];
  mxRecords!: DnsMxRecordModel[];
  srvRecords!: DnsSrvRecordModel[];
  nameServers!: DnsNameServerModel[];
  soaRecords!: DnsSoaRecordModel[];
  dnskeyRecords!: DnsDnskeyRecordModel[];
  dsRecords!: DnsDsRecordModel[];
  nsecRecords!: DnsNsecRecordModel[];
  nsec3Records!: DnsNsec3RecordModel[];
  subDomains!: DnsSubDomainModel[];
  delegatedSubDomains!: DnsSubDomainModel[];

  /**
   * Type assertion helper to cast an unknown value to DnsSubDomainModel.
   *
   * @param {unknown} unknownType - The value to cast.
   * @returns {DnsSubDomainModel} The value cast as DnsSubDomainModel.
   */
  static asDnsSubDomainModel = (unknownType: unknown): DnsSubDomainModel => unknownType as DnsSubDomainModel;
}


export class DnsRootDomainModel {
  id!: string;
  value!: string;
  advice!: DnsAdviceModel[];
  aRecords!: DnsARecordModel[];
  aaaaRecords!: DnsAAAARecordModel[];
  txtRecords!: DnsTxtRecordModel[];
  cnameRecords!: DnsCnameRecordModel[];
  mxRecords!: DnsMxRecordModel[];
  srvRecords!: DnsSrvRecordModel[];
  nameServers!: DnsNameServerModel[];
  soaRecords!: DnsSoaRecordModel[];
  dnskeyRecords!: DnsDnskeyRecordModel[];
  dsRecords!: DnsDsRecordModel[];
  nsecRecords!: DnsNsecRecordModel[];
  nsec3Records!: DnsNsec3RecordModel[];
  subDomains!: DnsSubDomainModel[];
  delegatedSubDomains!: DnsSubDomainModel[];

  /**
   * Type assertion helper to cast an unknown value to DnsRootDomainModel.
   *
   * @param {unknown} unknownType - The value to cast.
   * @returns {DnsRootDomainModel} The value cast as DnsRootDomainModel.
   */
  static asDnsRootDomainModel = (unknownType: unknown): DnsRootDomainModel => unknownType as DnsRootDomainModel;
}


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


export class DnsDnskeyRecordModel {
  id!: string;
  flags!: number;
  protocol!: number;
  algorithm!: string;
  publicKey!: string;
  startedAt!: Date;
  endedAt!: Date;

  /**
   * Type assertion helper to cast an unknown value to DnsDnskeyRecordModel.
   *
   * @param unknownType - The value to cast.
   * @returns The value cast as DnsDnskeyRecordModel.
   */
  static asDnsDnskeyRecordModel = (unknownType: unknown): DnsDnskeyRecordModel => unknownType as DnsDnskeyRecordModel;
}


export class DnsDsRecordModel {
  id!: string;
  algorithm!: string;
  digestType!: string;
  digest!: string;
  startedAt!: Date;
  endedAt!: Date;

  /**
   * Type assertion helper to cast an unknown value to DnsDsRecordModel.
   *
   * @param unknownType - The value to cast.
   * @returns The value cast as DnsDsRecordModel.
   */
  static asDnsDsRecordModel = (unknownType: unknown): DnsDsRecordModel => unknownType as DnsDsRecordModel;
}

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

export class DnsSoaRecordModel {
  id!: string;
  mName!: string;
  address!: string;
  startedAt!: Date;
  endedAt!: Date;

  /**
   * Type assertion helper to cast an unknown value to DnsSoaRecordModel.
   *
   * @param unknownType - The value to cast.
   * @returns The value cast as DnsSoaRecordModel.
   */
  static asDnsSoaRecordModel = (unknownType: unknown) => unknownType as DnsSoaRecordModel;
}

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
