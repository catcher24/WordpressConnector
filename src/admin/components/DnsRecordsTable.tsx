import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Message } from "primereact/message";
import { DnsAdviceModel } from "../models/shared";

interface DnsRecordsTableProps {
  dnsAdvices: DnsAdviceModel[];
  flattenedDnsRecords: any[];
}

export const DnsRecordsTable: React.FC<DnsRecordsTableProps> = ({ dnsAdvices, flattenedDnsRecords }) => {
  return (
    <>
      {dnsAdvices.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          <h3 className="font-semibold text-sm text-gray-700">DNS Advice</h3>
          {dnsAdvices.map((advice, i) => (
            <Message 
              key={i} 
              severity={advice.severity >= 3 ? "error" : advice.severity === 2 ? "warn" : "info"} 
              text={`${advice.title}: ${advice.advice}`} 
              className="w-full justify-start text-sm"
            />
          ))}
        </div>
      )}
      <DataTable value={flattenedDnsRecords} emptyMessage="No DNS records found" stripedRows size="small" rows={3}>
        <Column field="name" header="Name / Exchange" body={r => r.name || r.exchange || r.mName || 'N/A'} />
        <Column field="type" header="Type" />
        <Column field="value" header="Value / Address" body={r => r.value || r.address || r.addressIpv6 || 'N/A'} />
      </DataTable>
    </>
  );
};
