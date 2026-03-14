export interface DnsAdviceModel {
  title: string;
  advice: string;
  severity: number;
  isVulnerability: boolean;
}

export interface DnsSubDomainModel {
  id: string;
  value: string;
  subDomains: DnsSubDomainModel[];
  delegatedSubDomains: DnsSubDomainModel[];
  aRecords: any[];
  aaaaRecords: any[];
  txtRecords: any[];
  cnameRecords: any[];
  mxRecords: any[];
  srvRecords: any[];
  nameServers: any[];
  soaRecords: any[];
  dnskeyRecords: any[];
  dsRecords: any[];
  nsecRecords: any[];
  nsec3Records: any[];
}

export interface DnsRootDomainModel {
  id: string;
  value: string;
  aRecords: any[];
  aaaaRecords: any[];
  txtRecords: any[];
  cnameRecords: any[];
  mxRecords: any[];
  srvRecords: any[];
  nameServers: any[];
  soaRecords: any[];
  dnskeyRecords: any[];
  dsRecords: any[];
  nsecRecords: any[];
  nsec3Records: any[];
  subDomains: DnsSubDomainModel[];
  delegatedSubDomains: DnsSubDomainModel[];
}
