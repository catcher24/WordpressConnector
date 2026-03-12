import React from "react";
import { DnsAdviceModel } from "../models/shared";

interface DnsAdviceListProps {
  advices: DnsAdviceModel[];
}

export const DnsAdviceList: React.FC<DnsAdviceListProps> = ({ advices }) => {
  if (!advices || advices.length === 0) return null;

  const getSeverityClasses = (severity: number, isVulnerability: boolean) => {
    if (!isVulnerability) {
      return "bg-info-lighter border-info-dark text-info-darker";
    } else if (severity >= 9) {
      return "bg-severity-critical-lighter border-severity-critical-dark text-severity-critical-darker";
    } else if (severity >= 7) {
      return "bg-severity-high-lighter border-severity-high-dark text-severity-high-darker";
    } else if (severity >= 4) {
      return "bg-severity-medium-lighter border-severity-medium-dark text-severity-medium-darker";
    } else if (severity >= 0.1) {
      return "bg-severity-low-lighter border-severity-low-dark text-severity-low-darker";
    } else {
      return "bg-severity-noise-lighter border-severity-noise-dark text-severity-noise-darker";
    }
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 9) return "Critical";
    if (severity >= 7) return "High";
    if (severity >= 4) return "Medium";
    if (severity >= 0.1) return "Low";
    return "Noise";
  };

  return (
    <div className="flex flex-col gap-4">
      {advices.map((advice, i) => (
        <div 
          key={i} 
          className={`block rounded-md border p-4 ${getSeverityClasses(advice.severity, advice.isVulnerability || false)}`}
        >
          <div className="size-full flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              {advice.isVulnerability && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-current">
                   {getSeverityLabel(advice.severity)} {advice.severity.toFixed(1)}
                </span>
              )}
              <h3 className="text-base font-medium">{advice.title}</h3>
            </div>
            <div className="text-sm prose prose-sm w-full max-w-full">
              {advice.advice}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
