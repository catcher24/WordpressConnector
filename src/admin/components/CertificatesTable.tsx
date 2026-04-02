import React from "react";
import { Tag } from "primereact/tag";
import { CertificateModel } from "../models";
import {PortType} from "../enums";
import {formatDate} from "../helpers";

interface CertificatesTableProps {
  certificates: CertificateModel[];
}

export const CertificatesTable: React.FC<CertificatesTableProps> = ({ certificates }) => {
  if (!certificates || certificates.length === 0) {
    return <div className="text-center py-8 text-secondary border border-dashed rounded-lg">No certificates found</div>;
  }

  const getGradeColor = (grade: string | undefined) => {
    if (!grade) return "bg-gray-500";
    if (grade.startsWith("A")) return "bg-severity-low";
    if (grade.startsWith("B")) return "bg-severity-medium";
    if (grade.startsWith("C")) return "bg-severity-high";
    return "bg-severity-critical";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {certificates.map((cert) => {
        const primaryImpl = cert.certificateImplementations?.[0];
        const grade = cert.lowestScore?.overallGrade || primaryImpl?.score?.overallGrade;

        return (
          <div key={cert.id} className="border border-secondary-light rounded-lg bg-white p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="text-lg font-bold text-secondary-darker truncate" title={cert.commonName}>
                  {cert.commonName}
                </h3>
                <span className="text-xs text-secondary truncate" title={cert.issuer}>
                  Signer: {cert.issuer}
                </span>
              </div>
              {grade && (
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-lg shrink-0 ${getGradeColor(grade)}`}>
                  {grade}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-secondary">Valid From</span>
                <span className="text-xs text-secondary-dark">{formatDate(cert, "validFrom")}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-secondary">Valid To</span>
                <span className="text-xs text-secondary-dark">{formatDate(cert, "validTo")}</span>
              </div>
            </div>

            {primaryImpl && (
              <div className="pt-3 border-t border-tertiary-light flex flex-col gap-2">
                <div className="flex items-center gap-2">
                   <span className="text-[10px] uppercase font-bold text-secondary">Implementation:</span>
                   <Tag value={`${primaryImpl.port.value}/${primaryImpl.port.type === PortType.TCP ? "TCP" : "UDP"}`} severity="info" className="text-[10px]" />
                </div>

                {Object.keys(primaryImpl.ciphers || {}).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(primaryImpl.ciphers).slice(0, 2).map((cipher, idx) => (
                      <span key={idx} className="bg-tertiary-lighter text-secondary-dark border border-secondary-light rounded px-1.5 py-0.5 text-[10px] truncate max-w-[150px]">
                        {cipher}
                      </span>
                    ))}
                    {Object.keys(primaryImpl.ciphers).length > 2 && (
                      <span className="text-[10px] text-secondary self-center">+{Object.keys(primaryImpl.ciphers).length - 2} more</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
