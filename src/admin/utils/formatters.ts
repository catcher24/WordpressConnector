export const formatDate = (dateString?: string) => {
  return dateString ? new Date(dateString).toLocaleString() : "N/A";
};

export const formatDuration = (startedAt?: string, endedAt?: string) => {
  if (!startedAt) return "N/A";
  const start = new Date(startedAt).getTime();
  const end = endedAt ? new Date(endedAt).getTime() : new Date().getTime();
  let diffSecs = Math.max(Math.floor((end - start) / 1000), 0);
  
  const d = Math.floor(diffSecs / 86400);
  diffSecs %= 86400;
  const h = Math.floor(diffSecs / 3600);
  diffSecs %= 3600;
  const m = Math.floor(diffSecs / 60);
  const s = diffSecs % 60;
  
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  
  return parts.join(' ');
};

export const formatTimeSpan = (time?: string): string => {
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

export const topologicalSortRunners = <T extends { collectorId: string; configuration?: any }>(
  items: T[],
  collectors?: any[]
): T[] => {
  const collectorMap = new Map();
  if (collectors && collectors.length > 0) {
    collectors.forEach(c => collectorMap.set(c.id, c));
  } else {
    // Infer from runners
    items.forEach(item => {
      if (item.configuration) collectorMap.set(item.collectorId, item.configuration);
    });
  }

  // Map collectorId to an array of items with that collectorId
  const itemMap = new Map<string, T[]>();
  for (const item of items) {
    if (!itemMap.has(item.collectorId)) {
      itemMap.set(item.collectorId, []);
    }
    itemMap.get(item.collectorId)!.push(item);
  }

  const sorted: T[] = [];
  const visited = new Set<string>(); // Tracks visited collectorIds (nodes in the dependency graph)

  // Use a recursive function (DFS) to process dependencies
  const visit = (collectorId: string) => {
    if (visited.has(collectorId)) return;
    visited.add(collectorId);

    const collector = collectorMap.get(collectorId);
    if (collector && collector.dependsOn) {
      // Recursively visit all dependencies first
      for (const depId of collector.dependsOn) {
        // Ensure the dependency is a collector we are sorting items for
        if (itemMap.has(depId)) {
          visit(depId);
        }
      }
    }

    // Add ALL items associated with this collectorId *after* its dependencies are added
    const itemsForCollector = itemMap.get(collectorId);
    if (itemsForCollector) {
      for (const item of itemsForCollector) {
        sorted.push(item);
      }
    }
  };

  // Start the sort for every unique collectorId (to catch all independent chains)
  for (const collectorId of itemMap.keys()) {
    visit(collectorId);
  }

  return sorted;
};
