import React from "react";
import { Button } from "primereact/button";
import { TargetModel, TargetPortModel, getTargetTypeDisplayName, getSeverityLabel, getSeverityColor, getTargetTypeColor } from "../models/shared";
import { Panel } from "primereact/panel";

interface DashboardHeaderProps {
  target: TargetModel;
  targetPorts: TargetPortModel[];
  formatDate: (dateString?: string) => string;
  onViewFullInsights: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  target,
  targetPorts,
  formatDate,
  onViewFullInsights,
}) => {
  const renderSeverityBadge = () => {
    const mostSevere = target.mostSevereVulnerability;
    let severityValue: number | null = typeof mostSevere?.severity === 'number' ? mostSevere.severity : null;
    
    // If no numeric severity on the most severe vuln, check target-level counts
    if (severityValue === null) {
      if (target.severity.critical > 0) severityValue = 9.0;
      else if (target.severity.high > 0) severityValue = 7.0;
      else if (target.severity.medium > 0) severityValue = 4.0;
      else if (target.severity.low > 0) severityValue = 1.0;
      else if (target.severity.noise > 0) severityValue = 0.0;
    }

    if (severityValue === null) {
      return (
        <div className="rounded whitespace-nowrap font-bold inline-block text-xs px-2 py-1 bg-surface-100 text-surface-500 border border-surface-200 shadow-sm">
          Not scanned
        </div>
      );
    }

    const val = severityValue;
    const label = getSeverityLabel(val);
    const colors = getSeverityColor(val);

    return (
      <div className={`rounded whitespace-nowrap font-bold inline-block text-xs px-2 py-1 ${colors.light} ${colors.text} border ${colors.border.replace('/20', '/40')} shadow-sm`}>
        {label} {val > 0 ? val.toFixed(1) : ''}
      </div>
    );
  };


  const headerTemplate = (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full">
      <div className="flex flex-col gap-2 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {renderSeverityBadge()}
          <div 
            className="rounded whitespace-nowrap font-bold inline-block text-xs px-2 py-1 text-white shadow-sm"
            style={{ backgroundColor: getTargetTypeColor(target.type) }}
          >
            {getTargetTypeDisplayName(target.type)}
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight text-surface-900 truncate">
            {target.preferredDisplayName}
          </h1>
          <div className="flex items-center gap-2 text-surface-500 mt-1">
            <span className="text-sm font-medium">{target.ip || target.hostname}</span>
          </div>
        </div>
      </div>

      <Button
        label="View Full Insights"
        icon="pi pi-external-link"
        size="small"
        outlined
        className="p-button-secondary shrink-0"
        onClick={onViewFullInsights}
      />
    </div>
  );

  return (
    <Panel 
      header={headerTemplate}
      pt={{
        title: { 
          className: "flex-1" 
        }
      }}
      ptOptions={{ mergeProps: true }}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Ports */}
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase font-bold text-surface-400 tracking-wider">Ports</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {targetPorts.length === 0 ? (
              <span className="text-xs text-surface-400 italic">No ports detected</span>
            ) : (
              targetPorts.map((port, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center px-2 py-0.5 rounded bg-surface-50 border border-surface-200 text-xs font-medium text-surface-700"
                >
                  {port.value}/{port.type === 0 ? "TCP" : "UDP"}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Vulnerabilities Summary */}
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase font-bold text-surface-400 tracking-wider">Vulnerabilities</span>
          <div className="flex gap-1.5 mt-1">
            <div className="flex flex-col items-center justify-center min-w-[40px] px-2 py-1 rounded bg-severity-critical-light border border-severity-critical-dark/20" title="Critical">
              <span className="text-xs font-bold text-severity-critical-dark">{target.severity.critical}</span>
            </div>
            <div className="flex flex-col items-center justify-center min-w-[40px] px-2 py-1 rounded bg-severity-high-light border border-severity-high-dark/20" title="High">
              <span className="text-xs font-bold text-severity-high-dark">{target.severity.high}</span>
            </div>
            <div className="flex flex-col items-center justify-center min-w-[40px] px-2 py-1 rounded bg-severity-medium-light border border-severity-medium-dark/20" title="Medium">
              <span className="text-xs font-bold text-severity-medium-dark">{target.severity.medium}</span>
            </div>
            <div className="flex flex-col items-center justify-center min-w-[40px] px-2 py-1 rounded bg-severity-low-light border border-severity-low-dark/20" title="Low">
              <span className="text-xs font-bold text-severity-low-dark">{target.severity.low}</span>
            </div>
          </div>
        </div>

        {/* Execution Schedule / Next Run */}
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase font-bold text-surface-400 tracking-wider">Execution Schedule</span>
          <div className="flex flex-col mt-0.5">
            {target.scheduledForDeletionAt ? (
              <div className="rounded whitespace-nowrap font-bold inline-block text-[10px] px-2 py-0.5 bg-red-100 text-red-600 border border-red-200 shadow-sm">
                Deletion: {new Date(target.scheduledForDeletionAt).toLocaleDateString()}
              </div>
            ) : (
              <span className="text-sm font-medium text-surface-600">
                {target.scannerConfigurations?.some(c => c.nextRun) 
                  ? `Next: ${formatDate(target.scannerConfigurations.find(c => c.nextRun).nextRun)}` 
                  : "No scheduled scans"}
              </span>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
};
