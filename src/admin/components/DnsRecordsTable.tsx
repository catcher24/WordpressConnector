import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Panel } from "primereact/panel";
import { DnsAdviceList } from "./DnsAdviceList";
import { classNames } from "primereact/utils";
import { SelectButton } from "primereact/selectbutton";

interface DnsRecordsTableProps {
  groupedRecords: any;
  showFullDns: boolean;
  setShowFullDns: (val: boolean) => void;
  isSubdomain: boolean;
}

export const DnsRecordsTable: React.FC<DnsRecordsTableProps> = ({
  groupedRecords,
  showFullDns,
  setShowFullDns,
  isSubdomain
}) => {
  if (!groupedRecords) return <div>No DNS data available</div>;

  const renderSimpleTable = (
    items: any[],
    header: string,
    columns: { field: string, header: string, body?: (r: any) => React.ReactNode, hideHeader?: boolean }[],
    colSpan: string = ""
  ) => {
    if (!items || items.length === 0) return null;

    const showTableHeaders = columns.length > 1 && !columns.every(c => c.hideHeader);

    return (
      <Panel
        header={`${header} Records`}
        className={classNames("flex-1 h-full", colSpan)}
        pt={{
          root: { className: "flex flex-col h-full" },
          toggleableContent: { className: "flex-1 flex flex-col min-h-0" },
          content: { className: "flex flex-col flex-1 min-h-0" }
        }}
        ptOptions={{ mergeProps: true }}
        toggleable
      >
        <DataTable value={items} size="small" stripedRows className="text-sm flex-1" showHeaders={showTableHeaders}>
          {columns.map((col, idx) => (
            <Column key={idx} field={col.field} header={col.header} body={col.body} className={col.hideHeader ? "p-0" : ""} />
          ))}
        </DataTable>
      </Panel>
    );
  };

  const renderTxtRecords = (txtGroups: any[]) => {
    if (!txtGroups || txtGroups.length === 0) return null;

    return (
      <Panel
        header="TXT Records"
        className="lg:col-span-2 flex-1 h-full"
        pt={{
          root: { className: "flex flex-col h-full" },
          toggleableContent: { className: "flex-1 flex flex-col min-h-0" },
          content: { className: "flex flex-col flex-1 min-h-0" }
        }}
        ptOptions={{ mergeProps: true }}
        toggleable
      >
        <div className="flex flex-col gap-4 flex-1">
          {txtGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              {group.type ? (
                <Panel header={group.type} toggleable>
                  <DataTable value={group.records} size="small" stripedRows className="text-sm">
                    <Column field="name" header="Name" className="w-1/4" />
                    <Column field="value" header="Value" className="text-wrap break-all" />
                  </DataTable>
                  {group.records.some((r: any) => r.advice?.length > 0) && (
                    <div className="p-3 border-t border-tertiary-light">
                      <h5 className="font-semibold text-xs mb-2">Advice</h5>
                      <DnsAdviceList advices={group.records.flatMap((r: any) => r.advice || [])} />
                    </div>
                  )}
                </Panel>
              ) : (
                <DataTable value={group.records} size="small" stripedRows className="text-sm">
                  <Column field="name" header="Name" className="w-1/4" />
                  <Column field="value" header="Value" className="text-wrap break-all" />
                </DataTable>
              )}
            </div>
          ))}
        </div>
      </Panel>
    );
  };

  const mxAdvices = groupedRecords.mxRecords?.flatMap((r: any) => r.advice || []) || [];

  const dnsOptions = [
    { label: 'Subdomain Only', value: false },
    { label: 'All records', value: true }
  ];

  return (
    <div className="flex flex-col gap-4">
      {isSubdomain && (
        <div className="mb-4 bg-white border border-secondary-light rounded-lg p-4">
          <div className="flex justify-between items-center text-sm">
            <div>
              <p className="font-bold text-secondary-darker">You scanned a subdomain.</p>
              <p className="text-secondary">Toggle to view all discovered records for the root domain.</p>
            </div>
            <div className="flex items-center">
              <SelectButton
                value={showFullDns}
                onChange={(e) => e.value !== null && setShowFullDns(e.value)}
                options={dnsOptions}
                allowEmpty={false}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderSimpleTable(groupedRecords.aRecords, "A", [
          { field: "name", header: "Name" },
          { field: "address", header: "Address" }
        ])}

        {renderSimpleTable(groupedRecords.aaaaRecords, "AAAA", [
          { field: "name", header: "Name" },
          { field: "address", header: "Address" }
        ])}

        {renderSimpleTable(groupedRecords.cnameRecords, "CNAME", [
          { field: "name", header: "Name" },
          { field: "target", header: "Target" }
        ])}

        {groupedRecords.mxRecords?.length > 0 && (
          <Panel
            header="MX Records"
            className="h-full"
            pt={{
              root: { className: "flex flex-col h-full" },
              toggleableContent: { className: "flex-1 flex flex-col min-h-0" },
              content: { className: "flex flex-col flex-1 min-h-0" }
            }}
            ptOptions={{ mergeProps: true }}
            toggleable
          >
            <div className="flex flex-col gap-4 flex-1">
              <DataTable value={groupedRecords.mxRecords} size="small" stripedRows className="text-sm flex-1" showHeaders={false}>
                <Column field="exchange" header="Exchange" />
              </DataTable>
              {mxAdvices.length > 0 && (
                <div className="mt-4 px-2 border-t pt-2 border-tertiary-light">
                  <h5 className="font-semibold text-xs mb-2">Advice</h5>
                  <DnsAdviceList advices={mxAdvices} />
                </div>
              )}
            </div>
          </Panel>
        )}

        {renderSimpleTable(groupedRecords.soaRecords, "SOA", [
          { field: "mName", header: "mName" },
          { field: "address", header: "Address" }
        ])}

        {renderSimpleTable(groupedRecords.nameServers, "Name Server", [
          { field: "target", header: "Target" },
          { field: "address", header: "Address" }
        ])}

        {renderSimpleTable(groupedRecords.dnskeyRecords, "DNSKEY", [
          { field: "flags", header: "Flags" },
          { field: "protocol", header: "Protocol" },
          { field: "algorithm", header: "Algorithm" },
          { field: "publicKey", header: "Public Key", body: r => <span className="break-all">{r.publicKey}</span> }
        ], "lg:col-span-2")}

        {renderSimpleTable(groupedRecords.dsRecords, "DS", [
          { field: "algorithm", header: "Algorithm" },
          { field: "digestType", header: "Digest Type" },
          { field: "digest", header: "Digest", body: r => <span className="break-all">{r.digest}</span> }
        ], "lg:col-span-2")}

        {renderSimpleTable(groupedRecords.nsecRecords, "NSEC", [
          { field: "value", header: "Value" }
        ], "lg:col-span-2")}

        {renderSimpleTable(groupedRecords.nsec3Records, "NSEC3", [
          { field: "value", header: "Value" }
        ], "lg:col-span-2")}

        {renderTxtRecords(groupedRecords.txtRecords)}

        {renderSimpleTable(groupedRecords.srvRecords, "SRV", [
          { field: "name", header: "Name" },
          { field: "target", header: "Target" },
          { field: "address", header: "Address" },
          { field: "port", header: "Port" }
        ], "lg:col-span-2")}

        {Object.values(groupedRecords).every(v => Array.isArray(v) && v.length === 0) && (
          <div className="text-center py-8 text-secondary border border-dashed rounded-lg lg:col-span-2">
             No DNS records found for this {showFullDns ? 'domain' : 'subdomain'}
          </div>
        )}
      </div>
    </div>
  );
};
