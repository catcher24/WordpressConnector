import { CollectorModel, ScanRunnerModel } from "../models";

export const topologicalSortRunners = (
  runners: ScanRunnerModel[],
  collectorMap?: Map<string, CollectorModel>,
): ScanRunnerModel[] => {
  // 1. Corrected: Map collectorId to an array of runners to handle duplicates
  const runnerMap = new Map<string, ScanRunnerModel[]>();
  for (const runner of runners) {
    if (!runnerMap.has(runner.collectorId)) {
      runnerMap.set(runner.collectorId, []);
    }
    runnerMap.get(runner.collectorId)!.push(runner);
  }

  const sorted: ScanRunnerModel[] = [];
  // Tracks visited collectorIds (the nodes in the dependency graph)
  const visited = new Set<string>();

  const visit = (collectorId: string) => {
    if (visited.has(collectorId)) return;
    visited.add(collectorId);

    const collector = collectorMap?.get(collectorId);
    if (collector && collector.dependsOn) {
      // Recursively visit all dependencies first
      for (const depId of collector.dependsOn) {
        // Only visit dependencies that have runners in the current list
        if (runnerMap.has(depId)) {
          visit(depId);
        }
      }
    }

    const runnersForCollector = runnerMap.get(collectorId);
    if (runnersForCollector) {
      sorted.push(...runnersForCollector);
    }
  };

  // Start the sort for every unique collectorId (node) that has runners
  for (const collectorId of runnerMap.keys()) {
    visit(collectorId);
  }

  return sorted;
};
