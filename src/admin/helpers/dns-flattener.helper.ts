import {
  DnsAAAARecordModel,
  DnsARecordModel,
  DnsCnameRecordModel,
  DnsDnskeyRecordModel,
  DnsDsRecordModel,
  DnsMxRecordModel,
  DnsNameServerModel,
  DnsNsec3RecordModel,
  DnsNsecRecordModel,
  DnsRootDomainModel,
  DnsSoaRecordModel,
  DnsSrvRecordModel,
  DnsSubDomainModel,
  DnsTxtRecordModel,
} from "../models";

// Assuming the updated models look something like this:
// export interface DnsTxtRecordModel {
//   name: string;
//   value: string;
//   type: string; // Added type property
//   // ... other properties
// }

// export interface DnsMxRecordModel {
//   exchange: string;
//   priority: number;
//   advice: { advice: string; /* ... other properties */ }[]; // Added advice object list
//   // ... other properties
// }

export class DnsFlattener {
  static flattenRecords(
    rootDomain: DnsRootDomainModel,
    startHostname: string | undefined = undefined,
    includeHigherRecords = true,
  ): {
    aRecords: DnsARecordModel[];
    aaaaRecords: DnsAAAARecordModel[];
    txtRecords: { type: string; records: DnsTxtRecordModel[] }[]; // Grouped by type
    cnameRecords: DnsCnameRecordModel[];
    mxRecords: DnsMxRecordModel[];
    srvRecords: DnsSrvRecordModel[];
    nameServers: DnsNameServerModel[];
    soaRecords: DnsSoaRecordModel[];
    dnskeyRecords: DnsDnskeyRecordModel[];
    dsRecords: DnsDsRecordModel[];
    nsecRecords: DnsNsecRecordModel[];
    nsec3Records: DnsNsec3RecordModel[];
  } {
    const result: {
      aRecords: DnsARecordModel[];
      aaaaRecords: DnsAAAARecordModel[];
      txtRecords: { type: string; records: DnsTxtRecordModel[] }[];
      cnameRecords: DnsCnameRecordModel[];
      mxRecords: DnsMxRecordModel[];
      srvRecords: DnsSrvRecordModel[];
      nameServers: DnsNameServerModel[];
      soaRecords: DnsSoaRecordModel[];
      dnskeyRecords: DnsDnskeyRecordModel[];
      dsRecords: DnsDsRecordModel[];
      nsecRecords: DnsNsecRecordModel[];
      nsec3Records: DnsNsec3RecordModel[];
    } = {
      aRecords: [],
      aaaaRecords: [],
      txtRecords: [],
      cnameRecords: [],
      mxRecords: [],
      srvRecords: [],
      nameServers: [],
      soaRecords: [],
      dnskeyRecords: [],
      dsRecords: [],
      nsecRecords: [],
      nsec3Records: [],
    };

    const uniqueRecordsMap = {
      aRecords: new Map<string, DnsARecordModel>(),
      aaaaRecords: new Map<string, DnsAAAARecordModel>(),
      txtRecords: new Map<string, DnsTxtRecordModel>(), // Still a flat map for initial collection
      cnameRecords: new Map<string, DnsCnameRecordModel>(),
      mxRecords: new Map<string, DnsMxRecordModel>(),
      srvRecords: new Map<string, DnsSrvRecordModel>(),
      nameServers: new Map<string, DnsNameServerModel>(),
      soaRecords: new Map<string, DnsSoaRecordModel>(),
      dnskeyRecords: new Map<string, DnsDnskeyRecordModel>(),
      dsRecords: new Map<string, DnsDsRecordModel>(),
      nsecRecords: new Map<string, DnsNsecRecordModel>(),
      nsec3Records: new Map<string, DnsNsec3RecordModel>(),
      mxAdvice: new Set<string>(), // Using a Set for deduplication
    };

    // Helper function to add records to the unique maps
    const addRecords = <T>(records: T[], map: Map<string, T>, uniqueKey: (record: T) => string) => {
      records.forEach((record: any) => {
        const key = uniqueKey(record);
        if (!map.has(key) && record['address'] !== 'no_ip') {
          map.set(key, record);
        }
      });
    };

    // Recursive function to traverse and collect records
    const traverseDomain = (
      domain: DnsSubDomainModel | DnsRootDomainModel,
      includeRecords: boolean,
      includeHigher: boolean,
    ) => {
      if (includeRecords) {
        addRecords(domain.aRecords, uniqueRecordsMap.aRecords, record => record.name);
        addRecords(domain.aaaaRecords, uniqueRecordsMap.aaaaRecords, record => record.name);
        addRecords(
          domain.txtRecords,
          uniqueRecordsMap.txtRecords,
          record => record.value + (record as DnsTxtRecordModel).type,
        ); // Include type in key for TXT
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

      // If delegated subdomains are found, stop including higher records
      for (const subDomain of domain.subDomains) {
        if (subDomain.delegatedSubDomains.length > 0) {
          // Traverse delegated subdomains as new roots
          subDomain.delegatedSubDomains.forEach(delegatedSubDomain => {
            traverseDomain(delegatedSubDomain, true, false); // Stop higher records for delegated subdomains
          });
        } else {
          // Regular traversal with the ability to include higher records
          traverseDomain(subDomain, includeHigher && includeRecords, includeHigher);
        }
      }
    };

    // Start the traversal from the root domain or specific startHostname
    if (startHostname) {
      const startDomain = findDomainByValue(rootDomain, startHostname);
      if (startDomain) {
        traverseDomain(startDomain, true, includeHigherRecords);
      }
    } else {
      traverseDomain(rootDomain, includeHigherRecords, includeHigherRecords);
    }

    // Extract unique records into result
    result.aRecords = Array.from(uniqueRecordsMap.aRecords.values());
    result.aaaaRecords = Array.from(uniqueRecordsMap.aaaaRecords.values());

    // Group TXT records by type
    const groupedTxtRecords = new Map<string, DnsTxtRecordModel[]>();
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
}

// Helper to find a domain by ID
function findDomainByValue(
  rootDomain: DnsRootDomainModel,
  value: string,
): DnsSubDomainModel | DnsRootDomainModel | null {
  if (rootDomain.value === value) {
    return rootDomain;
  }

  const stack = [...rootDomain.subDomains, ...rootDomain.delegatedSubDomains];
  while (stack.length) {
    const domain = stack.pop();
    if (domain?.value === value) {
      return domain;
    }
    stack.push(...domain!.subDomains);
    stack.push(...domain!.delegatedSubDomains);
  }

  return null;
}

