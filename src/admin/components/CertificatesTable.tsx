import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CertificateModel } from "../models/shared";

interface CertificatesTableProps {
  certificates: CertificateModel[];
  formatDate: (rowData: any, field: string) => string;
}

export const CertificatesTable: React.FC<CertificatesTableProps> = ({ certificates, formatDate }) => {
  return (
    <DataTable value={certificates} emptyMessage="No certificates found" stripedRows size="small" rows={3}>
      <Column field="commonName" header="Name" />
      <Column field="issuer" header="Issuer" />
      <Column header="Valid To" body={(rowData) => formatDate(rowData, "validTo")} />
    </DataTable>
  );
};
