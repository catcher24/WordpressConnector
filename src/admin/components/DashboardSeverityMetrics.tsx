import React from "react";
import { Card } from "primereact/card";
import { SeverityModel } from "../models/shared";

interface DashboardSeverityMetricsProps {
  severity: SeverityModel | null | undefined;
}

export const DashboardSeverityMetrics: React.FC<DashboardSeverityMetricsProps> = ({ severity }) => {
  const metrics = severity ? [
    { label: "Critical", value: severity.critical || 0, color: "text-red-500" },
    { label: "High", value: severity.high || 0, color: "text-orange-500" },
    { label: "Medium", value: severity.medium || 0, color: "text-yellow-500" },
    { label: "Low", value: severity.low || 0, color: "text-blue-500" },
  ] : [
    { label: "Critical", value: 0, color: "text-secondary" },
    { label: "High", value: 0, color: "text-secondary" },
    { label: "Medium", value: 0, color: "text-secondary" },
    { label: "Low", value: 0, color: "text-secondary" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
      {metrics.map((metric) => (
        <Card key={metric.label} className="shadow-sm border border-secondary-light m-0">
          <div className="flex flex-col justify-center items-center h-16">
            <span className="text-secondary font-bold text-sm mb-1 uppercase tracking-widest">{metric.label}</span>
            <span className={`text-3xl font-bold ${metric.color}`}>{metric.value}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
