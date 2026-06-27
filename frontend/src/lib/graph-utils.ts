// Graph utility functions for network simulation with support for routing algorithms (Dijkstra, BFS, A*, MST)
// and digital twin node simulation properties (batteries, power grid, and coverages).

export interface NetworkNode {
  id: string;
  type: "tower" | "phone" | "core" | "gateway" | "mesh" | "drone" | "router" | "powerGrid";
  label: string;
  status: "healthy" | "degraded" | "offline";
  capacity: number;
  load: number;
  latency: number;
  connectedUsers: number;
  battery: number; // 0 to 100
  powerConnected: boolean; // connected to a working powerGrid node
  coverageRadius: number; // radius in pixels/units
  position: { x: number; y: number };
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: "fiber" | "wireless" | "mesh" | "backhaul" | "satellite" | "power";
  bandwidth: number; // Mbps
  latency: number; // ms
  status: "active" | "congested" | "broken";
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

// 1. BFS Pathfinding (Finds path with fewest hops)
export function findShortestPathBFS(
  graph: NetworkGraph,
  startId: string,
  endId: string
): string[] | null {
  const activeEdges = graph.edges.filter((e) => e.status !== "broken" && e.type !== "power");
  const activeNodes = new Set(
    graph.nodes.filter((n) => n.status !== "offline").map((n) => n.id)
  );

  if (!activeNodes.has(startId) || !activeNodes.has(endId)) return null;

  const adjacency: Record<string, string[]> = {};
  for (const node of graph.nodes) adjacency[node.id] = [];
  for (const edge of activeEdges) {
    if (activeNodes.has(edge.source) && activeNodes.has(edge.target)) {
      adjacency[edge.source].push(edge.target);
      adjacency[edge.target].push(edge.source);
    }
  }

  const visited = new Set<string>([startId]);
  const queue: string[][] = [[startId]];

  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];

    if (current === endId) return path;

    for (const neighbor of adjacency[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  return null;
}

// 2. Dijkstra Pathfinding (Finds path with lowest cumulative cost: latency + load penalty)
export function findShortestPathDijkstra(
  graph: NetworkGraph,
  startId: string,
  endId: string
): string[] | null {
  const activeEdges = graph.edges.filter((e) => e.status !== "broken" && e.type !== "power");
  const activeNodes = new Set(
    graph.nodes.filter((n) => n.status !== "offline").map((n) => n.id)
  );

  if (!activeNodes.has(startId) || !activeNodes.has(endId)) return null;

  // Build node definitions for lookups
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

  // Adjacency with weights
  const adjacency: Record<string, { target: string; edge: NetworkEdge }[]> = {};
  for (const node of graph.nodes) adjacency[node.id] = [];
  for (const edge of activeEdges) {
    if (activeNodes.has(edge.source) && activeNodes.has(edge.target)) {
      adjacency[edge.source].push({ target: edge.target, edge });
      adjacency[edge.target].push({ target: edge.source, edge });
    }
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  for (const node of graph.nodes) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    if (activeNodes.has(node.id)) {
      unvisited.add(node.id);
    }
  }
  distances[startId] = 0;

  while (unvisited.size > 0) {
    // Get unvisited node with smallest distance
    let current: string | null = null;
    let minDistance = Infinity;
    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    }

    if (current === null || current === endId) break;
    unvisited.delete(current);

    const neighbors = adjacency[current] || [];
    for (const { target, edge } of neighbors) {
      if (!unvisited.has(target)) continue;

      const targetNode = nodeMap.get(target);
      const targetLoad = targetNode ? targetNode.load : 0;
      // Edge weight is based on: latency + load penalty
      const loadPenalty = targetLoad > 80 ? 40 : targetLoad > 50 ? 15 : 0;
      const weight = edge.latency + loadPenalty;
      const alt = distances[current] + weight;

      if (alt < distances[target]) {
        distances[target] = alt;
        previous[target] = current;
      }
    }
  }

  if (distances[endId] === Infinity) return null;

  const path: string[] = [];
  let curr: string | null = endId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }
  return path;
}

// 3. A* Pathfinding (Dijkstra + spatial distance heuristic to direct search)
export function findShortestPathAStar(
  graph: NetworkGraph,
  startId: string,
  endId: string
): string[] | null {
  const activeEdges = graph.edges.filter((e) => e.status !== "broken" && e.type !== "power");
  const activeNodes = new Set(
    graph.nodes.filter((n) => n.status !== "offline").map((n) => n.id)
  );

  if (!activeNodes.has(startId) || !activeNodes.has(endId)) return null;

  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
  const endNode = nodeMap.get(endId);
  if (!endNode) return null;

  // Spatial heuristic (Euclidean distance)
  const heuristic = (nodeId: string): number => {
    const node = nodeMap.get(nodeId);
    if (!node) return 0;
    const dx = node.position.x - endNode.position.x;
    const dy = node.position.y - endNode.position.y;
    // scale to match latency coordinates
    return Math.sqrt(dx * dx + dy * dy) / 20;
  };

  const adjacency: Record<string, { target: string; edge: NetworkEdge }[]> = {};
  for (const node of graph.nodes) adjacency[node.id] = [];
  for (const edge of activeEdges) {
    if (activeNodes.has(edge.source) && activeNodes.has(edge.target)) {
      adjacency[edge.source].push({ target: edge.target, edge });
      adjacency[edge.target].push({ target: edge.source, edge });
    }
  }

  const gScore: Record<string, number> = {}; // cost from start to node
  const fScore: Record<string, number> = {}; // estimated total cost
  const previous: Record<string, string | null> = {};
  const openSet = new Set<string>([startId]);

  for (const node of graph.nodes) {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
    previous[node.id] = null;
  }
  gScore[startId] = 0;
  fScore[startId] = heuristic(startId);

  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let current: string | null = null;
    let minF = Infinity;
    for (const node of openSet) {
      if (fScore[node] < minF) {
        minF = fScore[node];
        current = node;
      }
    }

    if (current === null) break;
    if (current === endId) {
      const path: string[] = [];
      let curr: string | null = endId;
      while (curr !== null) {
        path.unshift(curr);
        curr = previous[curr];
      }
      return path;
    }

    openSet.delete(current);

    const neighbors = adjacency[current] || [];
    for (const { target, edge } of neighbors) {
      const targetNode = nodeMap.get(target);
      const targetLoad = targetNode ? targetNode.load : 0;
      const loadPenalty = targetLoad > 80 ? 40 : targetLoad > 50 ? 15 : 0;
      const weight = edge.latency + loadPenalty;

      const tentativeGScore = gScore[current] + weight;
      if (tentativeGScore < gScore[target]) {
        previous[target] = current;
        gScore[target] = tentativeGScore;
        fScore[target] = tentativeGScore + heuristic(target);
        openSet.add(target);
      }
    }
  }

  return null;
}

// 4. Minimum Spanning Tree (MST) using Kruskal's algorithm
// Computes active backbone connectivity with minimum total cost
export function calculateMST(graph: NetworkGraph): NetworkEdge[] {
  const activeEdges = graph.edges
    .filter((e) => e.status !== "broken" && e.type !== "power")
    .sort((a, b) => a.latency - b.latency);

  const activeNodes = graph.nodes.filter((n) => n.status !== "offline").map((n) => n.id);

  // Union-Find / Disjoint Set
  const parent: Record<string, string> = {};
  for (const id of activeNodes) {
    parent[id] = id;
  }

  const find = (id: string): string => {
    if (parent[id] === id) return id;
    parent[id] = find(parent[id]);
    return parent[id];
  };

  const union = (id1: string, id2: string): boolean => {
    const root1 = find(id1);
    const root2 = find(id2);
    if (root1 !== root2) {
      parent[root1] = root2;
      return true;
    }
    return false;
  };

  const mstEdges: NetworkEdge[] = [];
  for (const edge of activeEdges) {
    if (parent[edge.source] && parent[edge.target]) {
      if (union(edge.source, edge.target)) {
        mstEdges.push(edge);
      }
    }
  }

  return mstEdges;
}

// Retro-compatible pathfinding router
export function findShortestPath(
  graph: NetworkGraph,
  startId: string,
  endId: string,
  algorithm: "bfs" | "dijkstra" | "astar" = "dijkstra"
): string[] | null {
  if (algorithm === "bfs") return findShortestPathBFS(graph, startId, endId);
  if (algorithm === "astar") return findShortestPathAStar(graph, startId, endId);
  return findShortestPathDijkstra(graph, startId, endId);
}

// Check overall network connectivity / components
export function getConnectedComponents(graph: NetworkGraph): string[][] {
  const activeEdges = graph.edges.filter((e) => e.status !== "broken" && e.type !== "power");
  const activeNodeIds = new Set(
    graph.nodes.filter((n) => n.status !== "offline").map((n) => n.id)
  );

  const adjacency: Record<string, string[]> = {};
  for (const id of activeNodeIds) adjacency[id] = [];
  for (const edge of activeEdges) {
    if (activeNodeIds.has(edge.source) && activeNodeIds.has(edge.target)) {
      adjacency[edge.source].push(edge.target);
      adjacency[edge.target].push(edge.source);
    }
  }

  const visited = new Set<string>();
  const components: string[][] = [];

  for (const nodeId of activeNodeIds) {
    if (visited.has(nodeId)) continue;

    const component: string[] = [];
    const stack = [nodeId];
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      component.push(current);
      for (const neighbor of adjacency[current] || []) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }
    components.push(component);
  }

  return components;
}

// Calculate coverage percentage using coverage circles overlap ratio
export function calculateCoverage(graph: NetworkGraph): number {
  const towers = graph.nodes.filter((n) => n.type === "tower" || n.type === "mesh" || n.type === "drone");
  if (towers.length === 0) return 0;
  const activeTowers = towers.filter((t) => t.status !== "offline");
  return Math.round((activeTowers.length / towers.length) * 100);
}

// Calculate average latency
export function calculateAvgLatency(graph: NetworkGraph): number {
  const activeNodes = graph.nodes.filter((n) => n.status !== "offline" && n.type !== "powerGrid");
  if (activeNodes.length === 0) return 0;
  const total = activeNodes.reduce((sum, n) => sum + n.latency, 0);
  return Math.round(total / activeNodes.length);
}

// Calculate total connected users
export function calculateTotalUsers(graph: NetworkGraph): number {
  return graph.nodes
    .filter((n) => n.status !== "offline")
    .reduce((sum, n) => sum + n.connectedUsers, 0);
}

// Generate default network layout representing Chennai central grid
export function generateDefaultNetwork(): NetworkGraph {
  const nodes: NetworkNode[] = [
    {
      id: "power-1",
      type: "powerGrid",
      label: "Chennai Central Power Grid",
      status: "healthy",
      capacity: 500,
      load: 65,
      latency: 0,
      connectedUsers: 0,
      battery: 100,
      powerConnected: true,
      coverageRadius: 0,
      position: { x: 500, y: 20 },
    },
    {
      id: "gateway-1",
      type: "gateway",
      label: "Main Fiber Gateway",
      status: "healthy",
      capacity: 1000,
      load: 35,
      latency: 4,
      connectedUsers: 0,
      battery: 100,
      powerConnected: true,
      coverageRadius: 0,
      position: { x: 500, y: 110 },
    },
    {
      id: "core-1",
      type: "core",
      label: "Telecom Core A",
      status: "healthy",
      capacity: 500,
      load: 42,
      latency: 6,
      connectedUsers: 0,
      battery: 100,
      powerConnected: true,
      coverageRadius: 0,
      position: { x: 300, y: 220 },
    },
    {
      id: "core-2",
      type: "core",
      label: "Telecom Core B",
      status: "healthy",
      capacity: 500,
      load: 38,
      latency: 7,
      connectedUsers: 0,
      battery: 100,
      powerConnected: true,
      coverageRadius: 0,
      position: { x: 700, y: 220 },
    },
    {
      id: "router-1",
      type: "router",
      label: "Core Edge Router 1",
      status: "healthy",
      capacity: 300,
      load: 50,
      latency: 10,
      connectedUsers: 0,
      battery: 100,
      powerConnected: true,
      coverageRadius: 0,
      position: { x: 150, y: 340 },
    },
    {
      id: "router-2",
      type: "router",
      label: "Core Edge Router 2",
      status: "healthy",
      capacity: 300,
      load: 45,
      latency: 12,
      connectedUsers: 0,
      battery: 100,
      powerConnected: true,
      coverageRadius: 0,
      position: { x: 500, y: 340 },
    },
    {
      id: "router-3",
      type: "router",
      label: "Core Edge Router 3",
      status: "healthy",
      capacity: 300,
      load: 48,
      latency: 11,
      connectedUsers: 0,
      battery: 100,
      powerConnected: true,
      coverageRadius: 0,
      position: { x: 850, y: 340 },
    },
    {
      id: "tower-1",
      type: "tower",
      label: "Cell Tower Alpha (Anna Nagar)",
      status: "healthy",
      capacity: 100,
      load: 58,
      latency: 18,
      connectedUsers: 540,
      battery: 100,
      powerConnected: true,
      coverageRadius: 180,
      position: { x: 80, y: 490 },
    },
    {
      id: "tower-2",
      type: "tower",
      label: "Cell Tower Beta (Nungambakkam)",
      status: "healthy",
      capacity: 100,
      load: 68,
      latency: 20,
      connectedUsers: 840,
      battery: 100,
      powerConnected: true,
      coverageRadius: 170,
      position: { x: 290, y: 490 },
    },
    {
      id: "tower-3",
      type: "tower",
      label: "Cell Tower Gamma (T-Nagar)",
      status: "healthy",
      capacity: 100,
      load: 44,
      latency: 15,
      connectedUsers: 610,
      battery: 100,
      powerConnected: true,
      coverageRadius: 180,
      position: { x: 500, y: 490 },
    },
    {
      id: "tower-4",
      type: "tower",
      label: "Cell Tower Delta (Mylapore)",
      status: "healthy",
      capacity: 100,
      load: 35,
      latency: 22,
      connectedUsers: 410,
      battery: 100,
      powerConnected: true,
      coverageRadius: 160,
      position: { x: 710, y: 490 },
    },
    {
      id: "tower-5",
      type: "tower",
      label: "Cell Tower Epsilon (Adyar)",
      status: "healthy",
      capacity: 100,
      load: 62,
      latency: 24,
      connectedUsers: 730,
      battery: 100,
      powerConnected: true,
      coverageRadius: 195,
      position: { x: 920, y: 490 },
    },
    {
      id: "phone-1",
      type: "phone",
      label: "User Node Group A",
      status: "healthy",
      capacity: 10,
      load: 5,
      latency: 25,
      connectedUsers: 120,
      battery: 95,
      powerConnected: true,
      coverageRadius: 30,
      position: { x: 80, y: 640 },
    },
    {
      id: "phone-2",
      type: "phone",
      label: "User Node Group B",
      status: "healthy",
      capacity: 10,
      load: 3,
      latency: 30,
      connectedUsers: 140,
      battery: 90,
      powerConnected: true,
      coverageRadius: 30,
      position: { x: 290, y: 640 },
    },
    {
      id: "phone-3",
      type: "phone",
      label: "User Node Group C",
      status: "healthy",
      capacity: 10,
      load: 7,
      latency: 22,
      connectedUsers: 180,
      battery: 88,
      powerConnected: true,
      coverageRadius: 30,
      position: { x: 500, y: 640 },
    },
    {
      id: "phone-4",
      type: "phone",
      label: "User Node Group D",
      status: "healthy",
      capacity: 10,
      load: 4,
      latency: 28,
      connectedUsers: 110,
      battery: 92,
      powerConnected: true,
      coverageRadius: 30,
      position: { x: 710, y: 640 },
    },
    {
      id: "phone-5",
      type: "phone",
      label: "User Node Group E",
      status: "healthy",
      capacity: 10,
      load: 6,
      latency: 34,
      connectedUsers: 155,
      battery: 85,
      powerConnected: true,
      coverageRadius: 30,
      position: { x: 920, y: 640 },
    },
  ];

  const edges: NetworkEdge[] = [
    // Power connections from Power Grid
    { id: "e-pow-gw", source: "power-1", target: "gateway-1", type: "power", bandwidth: 0, latency: 0, status: "active" },
    { id: "e-pow-c1", source: "power-1", target: "core-1", type: "power", bandwidth: 0, latency: 0, status: "active" },
    { id: "e-pow-c2", source: "power-1", target: "core-2", type: "power", bandwidth: 0, latency: 0, status: "active" },
    { id: "e-pow-r1", source: "power-1", target: "router-1", type: "power", bandwidth: 0, latency: 0, status: "active" },
    { id: "e-pow-r2", source: "power-1", target: "router-2", type: "power", bandwidth: 0, latency: 0, status: "active" },
    { id: "e-pow-r3", source: "power-1", target: "router-3", type: "power", bandwidth: 0, latency: 0, status: "active" },
    { id: "e-pow-t1", source: "power-1", target: "tower-1", type: "power", bandwidth: 0, latency: 0, status: "active" },
    { id: "e-pow-t2", source: "power-1", target: "tower-2", type: "power", bandwidth: 0, latency: 0, status: "active" },
    { id: "e-pow-t3", source: "power-1", target: "tower-3", type: "power", bandwidth: 0, latency: 0, status: "active" },
    { id: "e-pow-t4", source: "power-1", target: "tower-4", type: "power", bandwidth: 0, latency: 0, status: "active" },
    { id: "e-pow-t5", source: "power-1", target: "tower-5", type: "power", bandwidth: 0, latency: 0, status: "active" },

    // Gateway to cores
    { id: "e-gw-c1", source: "gateway-1", target: "core-1", type: "fiber", bandwidth: 1000, latency: 3, status: "active" },
    { id: "e-gw-c2", source: "gateway-1", target: "core-2", type: "fiber", bandwidth: 1000, latency: 4, status: "active" },
    // Core to core
    { id: "e-c1-c2", source: "core-1", target: "core-2", type: "fiber", bandwidth: 1000, latency: 5, status: "active" },
    // Cores to routers
    { id: "e-c1-r1", source: "core-1", target: "router-1", type: "fiber", bandwidth: 800, latency: 6, status: "active" },
    { id: "e-c1-r2", source: "core-1", target: "router-2", type: "fiber", bandwidth: 800, latency: 7, status: "active" },
    { id: "e-c2-r2", source: "core-2", target: "router-2", type: "fiber", bandwidth: 800, latency: 6, status: "active" },
    { id: "e-c2-r3", source: "core-2", target: "router-3", type: "fiber", bandwidth: 800, latency: 8, status: "active" },
    // Routers to towers
    { id: "e-r1-t1", source: "router-1", target: "tower-1", type: "backhaul", bandwidth: 500, latency: 8, status: "active" },
    { id: "e-r1-t2", source: "router-1", target: "tower-2", type: "backhaul", bandwidth: 500, latency: 9, status: "active" },
    { id: "e-r2-t2", source: "router-2", target: "tower-2", type: "backhaul", bandwidth: 500, latency: 7, status: "active" },
    { id: "e-r2-t3", source: "router-2", target: "tower-3", type: "backhaul", bandwidth: 500, latency: 8, status: "active" },
    { id: "e-r2-t4", source: "router-2", target: "tower-4", type: "backhaul", bandwidth: 500, latency: 10, status: "active" },
    { id: "e-r3-t4", source: "router-3", target: "tower-4", type: "backhaul", bandwidth: 500, latency: 9, status: "active" },
    { id: "e-r3-t5", source: "router-3", target: "tower-5", type: "backhaul", bandwidth: 500, latency: 11, status: "active" },
    // Towers to phones
    { id: "e-t1-p1", source: "tower-1", target: "phone-1", type: "wireless", bandwidth: 100, latency: 10, status: "active" },
    { id: "e-t2-p2", source: "tower-2", target: "phone-2", type: "wireless", bandwidth: 100, latency: 12, status: "active" },
    { id: "e-t3-p3", source: "tower-3", target: "phone-3", type: "wireless", bandwidth: 100, latency: 8, status: "active" },
    { id: "e-t4-p4", source: "tower-4", target: "phone-4", type: "wireless", bandwidth: 100, latency: 14, status: "active" },
    { id: "e-t5-p5", source: "tower-5", target: "phone-5", type: "wireless", bandwidth: 100, latency: 15, status: "active" },
    // Inter-tower backup wireless mesh links
    { id: "e-t1-t2", source: "tower-1", target: "tower-2", type: "wireless", bandwidth: 300, latency: 5, status: "active" },
    { id: "e-t2-t3", source: "tower-2", target: "tower-3", type: "wireless", bandwidth: 300, latency: 5, status: "active" },
    { id: "e-t3-t4", source: "tower-3", target: "tower-4", type: "wireless", bandwidth: 300, latency: 5, status: "active" },
    { id: "e-t4-t5", source: "tower-4", target: "tower-5", type: "wireless", bandwidth: 300, latency: 5, status: "active" },
  ];

  return { nodes, edges };
}

// Get neighbors of a node
export function getNeighbors(
  graph: NetworkGraph,
  nodeId: string
): string[] {
  const neighbors = new Set<string>();
  for (const edge of graph.edges) {
    if (edge.status === "broken") continue;
    if (edge.source === nodeId) neighbors.add(edge.target);
    if (edge.target === nodeId) neighbors.add(edge.source);
  }
  return Array.from(neighbors);
}
