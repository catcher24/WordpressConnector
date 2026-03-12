import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface TopVulnerabilitiesTableProps {
  vulnerabilities: any[];
}

const renderSeverity = (rowData: any) => {
  const mapping: Record<string, { bg: string, text: string, label: string }> = {
    "Noise": { bg: 'bg-severity-noise-light', text: 'text-severity-noise-dark', label: 'Noise' },
    "Low": { bg: 'bg-severity-low-light', text: 'text-severity-low-dark', label: 'Low' },
    "Medium": { bg: 'bg-severity-medium-light', text: 'text-severity-medium-dark', label: 'Medium' },
    "High": { bg: 'bg-severity-high-light', text: 'text-severity-high-dark', label: 'High' },
    "Critical": { bg: 'bg-severity-critical-light', text: 'text-severity-critical-dark', label: 'Critical' }
  };
  const ui = mapping[rowData.severity] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };
  
  return (
    <div className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold ${ui.bg} ${ui.text}`}>
      {ui.label}
    </div>
  );
};

export const TopVulnerabilitiesTable: React.FC<TopVulnerabilitiesTableProps> = ({ vulnerabilities }) => {
  const renderNameWithSeverity = (rowData: any) => (
    <div className="flex items-center gap-3">
      {renderSeverity(rowData)}
      <span className="font-medium text-gray-800">{rowData.displayName || rowData.name}</span>
    </div>
  );

  return (
    <DataTable value={vulnerabilities} emptyMessage="No recent vulnerabilities found" stripedRows size="small" rows={5}>
      <Column header="Vulnerability" body={renderNameWithSeverity} />
      <Column field="occurrences" header="Occurrences" style={{ width: '120px' }} />
    </DataTable>
  );
};
