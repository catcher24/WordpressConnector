import { DnsRootDomainModel, DnsSubDomainModel } from "../models/shared";

export class DnsFlattener {
  static flattenRecords(
    rootDomain: DnsRootDomainModel,
    startHostname: string | undefined = undefined,
    includeHigherRecords = true,
  ) {
    const result = {
      aRecords: [] as any[],
      aaaaRecords: [] as any[],
      txtRecords: [] as { type: string; records: any[] }[],
      cnameRecords: [] as any[],
      mxRecords: [] as any[],
      srvRecords: [] as any[],
      nameServers: [] as any[],
      soaRecords: [] as any[],
      dnskeyRecords: [] as any[],
      dsRecords: [] as any[],
      nsecRecords: [] as any[],
      nsec3Records: [] as any[],
    };

    const uniqueRecordsMap = {
      aRecords: new Map<string, any>(),
      aaaaRecords: new Map<string, any>(),
      txtRecords: new Map<string, any>(),
      cnameRecords: new Map<string, any>(),
      mxRecords: new Map<string, any>(),
      srvRecords: new Map<string, any>(),
      nameServers: new Map<string, any>(),
      soaRecords: new Map<string, any>(),
      dnskeyRecords: new Map<string, any>(),
      dsRecords: new Map<string, any>(),
      nsecRecords: new Map<string, any>(),
      nsec3Records: new Map<string, any>(),
    };

    const addRecords = (records: any[], map: Map<string, any>, uniqueKey: (record: any) => string) => {
      if (!records) return;
      records.forEach((record: any) => {
        const key = uniqueKey(record);
        if (!map.has(key) && record['address'] !== 'no_ip') {
          map.set(key, record);
        }
      });
    };

    const traverseDomain = (
      domain: DnsSubDomainModel | DnsRootDomainModel,
      includeRecords: boolean,
      includeHigher: boolean,
    ) => {
      if (!domain) return;
      if (includeRecords) {
        addRecords(domain.aRecords, uniqueRecordsMap.aRecords, record => record.name);
        addRecords(domain.aaaaRecords, uniqueRecordsMap.aaaaRecords, record => record.name);
        addRecords(
          domain.txtRecords,
          uniqueRecordsMap.txtRecords,
          record => record.value + record.type,
        );
        addRecords(domain.cnameRecords, uniqueRecordsMap.cnameRecords, record => record.name);
        addRecords(domain.mxRecords, uniqueRecordsMap.mxRecords, record => record.exchange);
        addRecords(domain.srvRecords, uniqueRecordsMap.srvRecords, record => record.name);
        addRecords(domain.nameServers, uniqueRecordsMap.nameServers, record => record.address);
        addRecords(domain.soaRecords, uniqueRecordsMap.soaRecords, record => record.mName);
        addRecords(domain.dnskeyRecords, uniqueRecordsMap.dnskeyRecords, record => record.publicKey);
        addRecords(domain.dsRecords, uniqueRecordsMap.dsRecords, record => record.digest);
        addRecords(domain.nsecRecords, uniqueRecordsMap.nsecRecords, record => record.value);
        addRecords(domain.nsec3Records, uniqueRecordsMap.nsec3Records, record => record.value);
      }

      for (const subDomain of (domain.subDomains || [])) {
        if (subDomain.delegatedSubDomains && subDomain.delegatedSubDomains.length > 0) {
          subDomain.delegatedSubDomains.forEach((delegatedSubDomain: any) => {
            traverseDomain(delegatedSubDomain, true, false);
          });
        } else {
          traverseDomain(subDomain, includeHigher && includeRecords, includeHigher);
        }
      }
    };

    if (startHostname) {
      const startDomain = this.findDomainByValue(rootDomain, startHostname);
      if (startDomain) {
        traverseDomain(startDomain, true, includeHigherRecords);
      }
    } else {
      traverseDomain(rootDomain, includeHigherRecords, includeHigherRecords);
    }

    result.aRecords = Array.from(uniqueRecordsMap.aRecords.values());
    result.aaaaRecords = Array.from(uniqueRecordsMap.aaaaRecords.values());

    const groupedTxtRecords = new Map<string, any[]>();
    uniqueRecordsMap.txtRecords.forEach(txtRecord => {
      if (!groupedTxtRecords.has(txtRecord.type ?? '')) {
        groupedTxtRecords.set(txtRecord.type ?? '', []);
      }
      groupedTxtRecords.get(txtRecord.type ?? '')?.push(txtRecord);
    });
    result.txtRecords = Array.from(groupedTxtRecords.entries()).map(([type, records]) => ({ type, records }));

    result.cnameRecords = Array.from(uniqueRecordsMap.cnameRecords.values());
    result.mxRecords = Array.from(uniqueRecordsMap.mxRecords.values());
    result.srvRecords = Array.from(uniqueRecordsMap.srvRecords.values());
    result.nameServers = Array.from(uniqueRecordsMap.nameServers.values());
    result.soaRecords = Array.from(uniqueRecordsMap.soaRecords.values());
    result.dnskeyRecords = Array.from(uniqueRecordsMap.dnskeyRecords.values());
    result.dsRecords = Array.from(uniqueRecordsMap.dsRecords.values());
    result.nsecRecords = Array.from(uniqueRecordsMap.nsecRecords.values());
    result.nsec3Records = Array.from(uniqueRecordsMap.nsec3Records.values());

    return result;
  }

  static findDomainByValue(
    rootDomain: DnsRootDomainModel,
    value: string,
  ): DnsSubDomainModel | DnsRootDomainModel | null {
    if (rootDomain.value === value) {
      return rootDomain;
    }

    const stack = [...(rootDomain.subDomains || []), ...(rootDomain.delegatedSubDomains || [])];
    while (stack.length) {
      const domain = stack.pop();
      if (domain?.value === value) {
        return domain;
      }
      stack.push(...(domain!.subDomains || []));
      stack.push(...(domain!.delegatedSubDomains || []));
    }

    return null;
  }
}
