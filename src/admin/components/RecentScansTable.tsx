import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ScanModel, ScannerModel, CollectorGroupModel, CollectorModel } from "../models/shared";

interface RecentScansTableProps {
  recentScans: ScanModel[];
  scannerMap: Map<string, ScannerModel>;
  collectorGroupMap: Map<string, CollectorGroupModel>;
  collectorMap: Map<string, CollectorModel>;
  formatDate: (rowData: any, field: string) => string;
  formatDuration: (startedAt: string, endedAt?: string) => string;
}

const getScanName = (
  scan: ScanModel,
  scannerMap: Map<string, ScannerModel>,
  collectorGroupMap: Map<string, CollectorGroupModel>
): string => {
  const scanner = scannerMap.get(scan.scannerId);
  if (!scanner) return "Unknown Scanner";
  return collectorGroupMap.get(scanner.collectorGroupId)?.name ?? "Unknown Group";
};

export const RecentScansTable: React.FC<RecentScansTableProps> = ({
  recentScans,
  scannerMap,
  collectorGroupMap,
  collectorMap,
  formatDate,
  formatDuration,
}) => {
  const renderScannerName = (scan: ScanModel) => (
    <span>{getScanName(scan, scannerMap, collectorGroupMap)}</span>
  );

  const renderCollectors = (scan: ScanModel) => {
    if (!scan.runners || scan.runners.length === 0) return <span className="text-surface-400 italic text-xs">None</span>;
    return (
      <div className="flex flex-col gap-1 w-full min-w-[200px]">
        {scan.runners.map((runner, idx) => {
          const collector = collectorMap.get(runner.collectorId);
          const name = collector?.displayName ?? `Collector ${runner.collectorId.slice(0, 8)}`;
          const isLast = idx === scan.runners.length - 1;
          return (
            <div
              key={idx}
              className={`flex justify-between items-center text-xs py-1 ${!isLast ? "border-b border-surface-200" : ""}`}
            >
              <span className="truncate mr-2 max-w-[150px]" title={name}>
                {name}
              </span>
              <span className="bg-surface-100 text-surface-600 px-1.5 py-0.5 rounded text-[10px] font-medium border border-surface-200 uppercase">
                {runner.collectorStatus}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DataTable
      value={recentScans}
      emptyMessage="No recent scans found"
      stripedRows
      size="small"
      rows={5}
      dataKey="id"
    >
      <Column header="Scanner" body={renderScannerName} />
      <Column header="Collectors" body={renderCollectors} />
      <Column header="Started At" body={(row) => formatDate(row, "startedAt")} />
      <Column
        header="Ended At"
        body={(row: ScanModel) => (row.endedAt ? formatDate(row, "endedAt") : "Still active")}
      />
      <Column header="Duration" body={(row: ScanModel) => formatDuration(row.startedAt, row.endedAt)} />
    </DataTable>
  );
};
