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
