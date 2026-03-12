import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface RecentScansTableProps {
  recentScans: any[];
  formatDate: (rowData: any, field: string) => string;
  formatDuration: (startedAt: string, endedAt?: string) => string;
  renderCollectorsInline: (rowData: any) => React.ReactNode;
}

export const RecentScansTable: React.FC<RecentScansTableProps> = ({ recentScans, formatDate, formatDuration, renderCollectorsInline }) => {
  return (
    <DataTable 
      value={recentScans} 
      emptyMessage="No recent scans found" 
      stripedRows 
      size="small" 
      rows={5}
      dataKey="id"
    >
      <Column field="scanStrategyName" header="Strategy" />
      <Column header="Collectors" body={renderCollectorsInline} />
      <Column header="Started At" body={(rowData) => formatDate(rowData, "startedAt")} />
      <Column header="Ended At" body={(rowData) => rowData.endedAt ? formatDate(rowData, "endedAt") : "Still active"} />
      <Column header="Duration" body={(rowData) => formatDuration(rowData.startedAt, rowData.endedAt)} />
    </DataTable>
  );
};
