import { DnsARecordModel } from './dns-a-record.model';
import { DnsAAAARecordModel } from './dns-aaaa-record.model';
import { DnsTxtRecordModel } from './dns-txt-record.model';
import { DnsCnameRecordModel } from './dns-cname-record.model';
import { DnsMxRecordModel } from './dns-mx-record.model';
import { DnsSrvRecordModel } from './dns-srv-record.model';
import { DnsNameServerModel } from './dns-name-server.model';
import { DnsSoaRecordModel } from './dns-soa-record.model';
import { DnsSubDomainModel } from './dns-sub-domain.model';
import { DnsDnskeyRecordModel } from './dns-dnskey-record.model';
import { DnsDsRecordModel } from './dns-ds-record.model';
import { DnsNsecRecordModel } from './dns-nsec-record.model';
import { DnsNsec3RecordModel } from './dns-nsec3-record.model';
import { DnsAdviceModel } from './dns-advice.model';

/**
 * Represents a DNS root domain model containing all DNS record types and related information.
 *
 * @property {string} id - Unique identifier for the root domain.
 * @property {string} value - The domain name value.
 * @property {DnsAdviceModel[]} advice - List of DNS advice objects for the domain.
 * @property {DnsARecordModel[]} aRecords - List of A records for the domain.
 * @property {DnsAAAARecordModel[]} aaaaRecords - List of AAAA records for the domain.
 * @property {DnsTxtRecordModel[]} txtRecords - List of TXT records for the domain.
 * @property {DnsCnameRecordModel[]} cnameRecords - List of CNAME records for the domain.
 * @property {DnsMxRecordModel[]} mxRecords - List of MX records for the domain.
 * @property {DnsSrvRecordModel[]} srvRecords - List of SRV records for the domain.
 * @property {DnsNameServerModel[]} nameServers - List of name server records for the domain.
 * @property {DnsSoaRecordModel[]} soaRecords - List of SOA records for the domain.
 * @property {DnsDnskeyRecordModel[]} dnskeyRecords - List of DNSKEY records for the domain.
 * @property {DnsDsRecordModel[]} dsRecords - List of DS records for the domain.
 * @property {DnsNsecRecordModel[]} nsecRecords - List of NSEC records for the domain.
 * @property {DnsNsec3RecordModel[]} nsec3Records - List of NSEC3 records for the domain.
 * @property {DnsSubDomainModel[]} subDomains - List of subdomains under the root domain.
 * @property {DnsSubDomainModel[]} delegatedSubDomains - List of delegated subdomains under the root domain.
 */
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
