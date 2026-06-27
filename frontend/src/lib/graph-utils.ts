// Graph utility functions for network simulation

export interface NetworkNode {
  id: string;
  type: "tower" | "phone" | "core" | "gateway" | "mesh" | "drone" | "router" | "fiber";
  label: string;
  status: "healthy" | "degraded" | "offline";
  capacity: number;
  load: number;
  latency: number;
  connectedUsers: number;
  battery: number;
  position: { x: number; y: number };
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: "fiber" | "wireless" | "mesh" | "backhaul" | "satellite";
  bandwidth: number;
  latency: number;
  status: "active" | "congested" | "broken";
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

// BFS shortest path
export function findShortestPath(
  graph: NetworkGraph,
  startId: string,
  endId: string
): string[] | null {
  const activeEdges = graph.edges.filter((e) => e.status !== "broken");
  const activeNodes = new Set(
    graph.nodes.filter((n) => n.status !== "offline").map((n) => n.id)
  );

  if (!activeNodes.has(startId) || !activeNodes.has(endId)) return null;

  const adjacency: Record<string, string[]> = {};
  for (const node of graph.nodes) {
    adjacency[node.id] = [];
  }
  for (const edge of activeEdges) {
    if (activeNodes.has(edge.source) && activeNodes.has(edge.target)) {
      adjacency[edge.source].push(edge.target);
      adjacency[edge.target].push(edge.source);
    }
  }

  const visited = new Set<string>();
  const queue: string[][] = [[startId]];
  visited.add(startId);

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

// Check overall network connectivity
export function getConnectedComponents(graph: NetworkGraph): string[][] {
  const activeEdges = graph.edges.filter((e) => e.status !== "broken");
  const activeNodeIds = new Set(
    graph.nodes.filter((n) => n.status !== "offline").map((n) => n.id)
  );

  const adjacency: Record<string, string[]> = {};
  for (const id of activeNodeIds) {
    adjacency[id] = [];
  }
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

// Calculate coverage percentage
export function calculateCoverage(graph: NetworkGraph): number {
  const totalNodes = graph.nodes.length;
  if (totalNodes === 0) return 0;
  const healthyNodes = graph.nodes.filter((n) => n.status !== "offline").length;
  return Math.round((healthyNodes / totalNodes) * 100);
}

// Calculate average latency
export function calculateAvgLatency(graph: NetworkGraph): number {
  const activeNodes = graph.nodes.filter((n) => n.status !== "offline");
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

// Generate initial network topology
export function generateDefaultNetwork(): NetworkGraph {
  const nodes: NetworkNode[] = [
    {
      id: "gateway-1",
      type: "gateway",
      label: "Internet Gateway",
      status: "healthy",
      capacity: 100,
      load: 35,
      latency: 5,
      connectedUsers: 0,
      battery: 100,
      position: { x: 500, y: 50 },
    },
    {
      id: "core-1",
      type: "core",
      label: "Core Network A",
      status: "healthy",
      capacity: 100,
      load: 45,
      latency: 8,
      connectedUsers: 0,
      battery: 100,
      position: { x: 300, y: 180 },
    },
    {
      id: "core-2",
      type: "core",
      label: "Core Network B",
      status: "healthy",
      capacity: 100,
      load: 40,
      latency: 10,
      connectedUsers: 0,
      battery: 100,
      position: { x: 700, y: 180 },
    },
    {
      id: "router-1",
      type: "router",
      label: "Regional Router 1",
      status: "healthy",
      capacity: 80,
      load: 55,
      latency: 12,
      connectedUsers: 0,
      battery: 100,
      position: { x: 150, y: 320 },
    },
    {
      id: "router-2",
      type: "router",
      label: "Regional Router 2",
      status: "healthy",
      capacity: 80,
      load: 50,
      latency: 14,
      connectedUsers: 0,
      battery: 100,
      position: { x: 500, y: 320 },
    },
    {
      id: "router-3",
      type: "router",
      label: "Regional Router 3",
      status: "healthy",
      capacity: 80,
      load: 48,
      latency: 11,
      connectedUsers: 0,
      battery: 100,
      position: { x: 850, y: 320 },
    },
    {
      id: "tower-1",
      type: "tower",
      label: "Cell Tower Alpha",
      status: "healthy",
      capacity: 70,
      load: 60,
      latency: 18,
      connectedUsers: 542,
      battery: 95,
      position: { x: 80, y: 480 },
    },
    {
      id: "tower-2",
      type: "tower",
      label: "Cell Tower Beta",
      status: "healthy",
      capacity: 70,
      load: 72,
      latency: 22,
      connectedUsers: 891,
      battery: 88,
      position: { x: 280, y: 480 },
    },
    {
      id: "tower-3",
      type: "tower",
      label: "Cell Tower Gamma",
      status: "healthy",
      capacity: 70,
      load: 45,
      latency: 15,
      connectedUsers: 634,
      battery: 100,
      position: { x: 500, y: 480 },
    },
    {
      id: "tower-4",
      type: "tower",
      label: "Cell Tower Delta",
      status: "healthy",
      capacity: 70,
      load: 38,
      latency: 20,
      connectedUsers: 423,
      battery: 92,
      position: { x: 720, y: 480 },
    },
    {
      id: "tower-5",
      type: "tower",
      label: "Cell Tower Epsilon",
      status: "healthy",
      capacity: 70,
      load: 65,
      latency: 25,
      connectedUsers: 756,
      battery: 78,
      position: { x: 920, y: 480 },
    },
    {
      id: "phone-1",
      type: "phone",
      label: "User Device A",
      status: "healthy",
      capacity: 10,
      load: 5,
      latency: 28,
      connectedUsers: 1,
      battery: 82,
      position: { x: 80, y: 620 },
    },
    {
      id: "phone-2",
      type: "phone",
      label: "User Device B",
      status: "healthy",
      capacity: 10,
      load: 3,
      latency: 32,
      connectedUsers: 1,
      battery: 65,
      position: { x: 280, y: 620 },
    },
    {
      id: "phone-3",
      type: "phone",
      label: "User Device C",
      status: "healthy",
      capacity: 10,
      load: 7,
      latency: 24,
      connectedUsers: 1,
      battery: 91,
      position: { x: 500, y: 620 },
    },
    {
      id: "phone-4",
      type: "phone",
      label: "User Device D",
      status: "healthy",
      capacity: 10,
      load: 4,
      latency: 30,
      connectedUsers: 1,
      battery: 73,
      position: { x: 720, y: 620 },
    },
    {
      id: "phone-5",
      type: "phone",
      label: "User Device E",
      status: "healthy",
      capacity: 10,
      load: 6,
      latency: 35,
      connectedUsers: 1,
      battery: 55,
      position: { x: 920, y: 620 },
    },
  ];

  const edges: NetworkEdge[] = [
    // Gateway to cores
    { id: "e-gw-c1", source: "gateway-1", target: "core-1", type: "fiber", bandwidth: 100, latency: 3, status: "active" },
    { id: "e-gw-c2", source: "gateway-1", target: "core-2", type: "fiber", bandwidth: 100, latency: 4, status: "active" },
    // Core to core
    { id: "e-c1-c2", source: "core-1", target: "core-2", type: "fiber", bandwidth: 100, latency: 5, status: "active" },
    // Cores to routers
    { id: "e-c1-r1", source: "core-1", target: "router-1", type: "fiber", bandwidth: 80, latency: 6, status: "active" },
    { id: "e-c1-r2", source: "core-1", target: "router-2", type: "fiber", bandwidth: 80, latency: 7, status: "active" },
    { id: "e-c2-r2", source: "core-2", target: "router-2", type: "fiber", bandwidth: 80, latency: 6, status: "active" },
    { id: "e-c2-r3", source: "core-2", target: "router-3", type: "fiber", bandwidth: 80, latency: 8, status: "active" },
    // Routers to towers
    { id: "e-r1-t1", source: "router-1", target: "tower-1", type: "backhaul", bandwidth: 50, latency: 8, status: "active" },
    { id: "e-r1-t2", source: "router-1", target: "tower-2", type: "backhaul", bandwidth: 50, latency: 9, status: "active" },
    { id: "e-r2-t2", source: "router-2", target: "tower-2", type: "backhaul", bandwidth: 50, latency: 7, status: "active" },
    { id: "e-r2-t3", source: "router-2", target: "tower-3", type: "backhaul", bandwidth: 50, latency: 8, status: "active" },
    { id: "e-r2-t4", source: "router-2", target: "tower-4", type: "backhaul", bandwidth: 50, latency: 10, status: "active" },
    { id: "e-r3-t4", source: "router-3", target: "tower-4", type: "backhaul", bandwidth: 50, latency: 9, status: "active" },
    { id: "e-r3-t5", source: "router-3", target: "tower-5", type: "backhaul", bandwidth: 50, latency: 11, status: "active" },
    // Towers to phones
    { id: "e-t1-p1", source: "tower-1", target: "phone-1", type: "wireless", bandwidth: 20, latency: 10, status: "active" },
    { id: "e-t2-p2", source: "tower-2", target: "phone-2", type: "wireless", bandwidth: 20, latency: 12, status: "active" },
    { id: "e-t3-p3", source: "tower-3", target: "phone-3", type: "wireless", bandwidth: 20, latency: 8, status: "active" },
    { id: "e-t4-p4", source: "tower-4", target: "phone-4", type: "wireless", bandwidth: 20, latency: 14, status: "active" },
    { id: "e-t5-p5", source: "tower-5", target: "phone-5", type: "wireless", bandwidth: 20, latency: 15, status: "active" },
    // Inter-tower links (redundancy)
    { id: "e-t1-t2", source: "tower-1", target: "tower-2", type: "wireless", bandwidth: 30, latency: 5, status: "active" },
    { id: "e-t2-t3", source: "tower-2", target: "tower-3", type: "wireless", bandwidth: 30, latency: 5, status: "active" },
    { id: "e-t3-t4", source: "tower-3", target: "tower-4", type: "wireless", bandwidth: 30, latency: 5, status: "active" },
    { id: "e-t4-t5", source: "tower-4", target: "tower-5", type: "wireless", bandwidth: 30, latency: 5, status: "active" },
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
