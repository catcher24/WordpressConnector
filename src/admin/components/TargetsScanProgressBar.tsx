import { useMemo } from "react";
import uniqolor from "uniqolor";
import { topologicalSortRunners } from "../utils/formatters";
import { ScanModel, ScanRunnerModel, CollectorStatus } from "../models/shared";

interface MeterItem {
  label: string;
  value: number;
  color: string;
  status: CollectorStatus | number;
  averageDuration?: string;
  timeoutDuration?: string;
  isStarting?: boolean;
  isRunning?: boolean;
}



const formatTime = (time?: string): string => {
  if (!time) return "0s";
  // Expected C# TimeSpan Format: "d.hh:mm:ss" or "hh:mm:ss"
  const regex = /^(?:(\d+)\.)?(\d+):(\d+):(\d+(?:\.\d+)?)$/;
  const match = time.match(regex);

  if (!match) return time;

  const days = match[1] ? parseInt(match[1], 10) : 0;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3], 10);
  const seconds = parseInt(match[4], 10);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.length === 0 ? "0s" : parts.join(" ");
};

export const TargetsScanProgressBar = ({ scan }: { scan: ScanModel }) => {
  const meterItems = useMemo<MeterItem[]>(() => {
    if (!scan || !scan.runners) return [];

    const activeRunners = scan.runners.filter((x: ScanRunnerModel) => !x.endedAt);
    const sortedRunners = topologicalSortRunners(activeRunners);
    
    return sortedRunners.map((scanRunner: ScanRunnerModel) => {
      // Fake 'collector' from runners since WP model is flat
      const collector = scanRunner.configuration || {};
      const isRunning = scanRunner.collectorStatus === CollectorStatus.Starting || scanRunner.collectorStatus === CollectorStatus.Running;
      const baseProgression = isRunning && scanRunner.progression === 0 ? 1 : 0;
      
      const name = collector.displayName || (scanRunner as any).specializationDisplayName || `Collector Type ${scanRunner.collectorType}`;
      const label = `${name} - ${scanRunner.collectorStatus}`;

      const meterItem: MeterItem = {
        label,
        value: baseProgression + (scanRunner.progression || 0),
        color: uniqolor(scanRunner.collectorId || scanRunner.collectorType.toString()).color,
        status: scanRunner.collectorStatus,
        isStarting: scanRunner.collectorStatus === CollectorStatus.Starting,
        isRunning
      };

      if (isRunning) {
         meterItem.averageDuration = formatTime(collector.averageDuration);
         meterItem.timeoutDuration = formatTime(collector.timeoutDuration);
      }

      return meterItem;
    });
  }, [scan]);

  if (meterItems.length === 0) return null;

  const totalRunners = meterItems.length;
  const percentValue = (progression: number) => `${Math.max(1, Math.round(progression / totalRunners))}%`;

  return (
    <div className="mt-2 flex flex-col gap-2">
      {/* Meters */}
      <div className="flex h-3 bg-gray-200 rounded overflow-hidden">
        {meterItems.map((item: MeterItem, i: number) => {
          if (item.isStarting) {
            return (
              <span 
                key={i} 
                className="h-full bg-gray-300 border-r border-white border-opacity-50 last:border-0 p-metergroup-meter intermediate" 
                style={{ width: percentValue(100) }}
                title={item.label}
              ></span>
            );
          }
          return (
            <span 
              key={i} 
              className={`h-full border-r border-white border-opacity-50 last:border-0 ${item.isRunning ? 'p-metergroup-meter intermediate' : ''}`} 
              style={{ width: percentValue(item.value), backgroundColor: item.color, transition: 'width 0.3s ease' }}
              title={item.label}
            ></span>
          );
        })}
      </div>

      {/* Labels below the progress bar */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
        {meterItems.map((item: MeterItem, i: number) => (
          <div key={i} className="flex gap-2 items-center text-sm min-w-max">
            <span 
               className="w-3 h-3 rounded-full shrink-0" 
               style={{ backgroundColor: item.isStarting ? "#f0f0f0" : item.color }}
            ></span>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700 text-xs">
                {item.label}
              </span>
              {item.isRunning && (
                <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                  {Math.round(item.value)}%
                  {item.averageDuration && ` | Average duration: ${item.averageDuration}`}
                  {item.timeoutDuration && ` | Timeout: ${item.timeoutDuration}`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
