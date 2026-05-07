import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getSeverityColor, getSeverityLabel } from "../helpers";
import { EmptyState } from "./EmptyState";
import { Button } from "primereact/button";
import React from "react";

interface TopVulnerabilitiesTableProps {
  vulnerabilities: any[];
}

const renderSeverity = (rowData: any) => {
  const severity = rowData.severity;
  const ui = getSeverityColor(severity);
  const label = getSeverityLabel(severity);

  return (
    <div className={`inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold ${ui.border} ${ui.light} ${ui.text} border`}>
      {label} {severity.toFixed(1)}
    </div>
  );
};

export const TopVulnerabilitiesTable: React.FC<TopVulnerabilitiesTableProps> = ({ vulnerabilities }) => {
  const { dashboardUrl, organization } = catcher24Connector;

  if (!vulnerabilities || vulnerabilities.length === 0) {
    return (
      <EmptyState
        icon="pi pi-check-circle"
        title="No vulnerabilities found"
        description="Great news! No recent vulnerabilities have been detected for this target."
      />
    );
  }

  const renderNameWithSeverity = (rowData: any) => (
    <div className="flex items-center gap-3">
      {renderSeverity(rowData)}
      <span className="font-medium text-gray-800">{rowData.displayName || rowData.name}</span>
    </div>
  );

  const rendedViewDetails = (rowData: any) => (
    <Button
      label="View details"
      icon="pi pi-external-link"
      size="small"
      outlined
      severity={"secondary"}
      onClick={() => {
        const baseUrl = dashboardUrl.replace(/\/$/, "");
        window.open(
          `${baseUrl}/org/${organization.identifier}/vulnerabilities/${rowData.id}`,
          "_blank",
        );
      }}
    />
  );

  return (
    <DataTable
      value={vulnerabilities}
      emptyMessage="No recent vulnerabilities found"
      stripedRows
      size="small"
      rows={5}>
      <Column header="Vulnerability" body={renderNameWithSeverity} />
      <Column
        field="occurrences"
        header="Occurrences"
        style={{ width: "120px" }}
      />
      <Column header="" style={{ width: "150px" }} body={rendedViewDetails} />
    </DataTable>
  );
};
