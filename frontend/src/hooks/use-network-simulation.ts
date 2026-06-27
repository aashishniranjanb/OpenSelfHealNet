"use client";

import { useState, useCallback } from "react";
import {
  type NetworkGraph,
  type NetworkNode,
  type NetworkEdge,
  generateDefaultNetwork,
  calculateCoverage,
  calculateAvgLatency,
  calculateTotalUsers,
  findShortestPath,
  getConnectedComponents,
} from "@/lib/graph-utils";

export interface SimulationStats {
  totalNodes: number;
  healthyNodes: number;
  offlineNodes: number;
  degradedNodes: number;
  coverage: number;
  avgLatency: number;
  totalUsers: number;
  activeEdges: number;
  brokenEdges: number;
}

export interface SimulationEvent {
  id: string;
  type: "failure" | "recovery" | "info" | "warning";
  message: string;
  timestamp: number;
}

let meshCounter = 0;
let droneCounter = 0;

export function useNetworkSimulation() {
  const [graph, setGraph] = useState<NetworkGraph>(generateDefaultNetwork());
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [recoveryPath, setRecoveryPath] = useState<string[] | null>(null);

  const addEvent = useCallback(
    (type: SimulationEvent["type"], message: string) => {
      setEvents((prev) => [
        {
          id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type,
          message,
          timestamp: Date.now(),
        },
        ...prev.slice(0, 49),
      ]);
    },
    []
  );

  const getStats = useCallback((): SimulationStats => {
    const healthyNodes = graph.nodes.filter((n) => n.status === "healthy").length;
    const offlineNodes = graph.nodes.filter((n) => n.status === "offline").length;
    const degradedNodes = graph.nodes.filter((n) => n.status === "degraded").length;
    const activeEdges = graph.edges.filter((e) => e.status !== "broken").length;
    const brokenEdges = graph.edges.filter((e) => e.status === "broken").length;

    return {
      totalNodes: graph.nodes.length,
      healthyNodes,
      offlineNodes,
      degradedNodes,
      coverage: calculateCoverage(graph),
      avgLatency: calculateAvgLatency(graph),
      totalUsers: calculateTotalUsers(graph),
      activeEdges,
      brokenEdges,
    };
  }, [graph]);

  // Destroy a specific tower
  const destroyNode = useCallback(
    (nodeId: string) => {
      setGraph((prev) => {
        const node = prev.nodes.find((n) => n.id === nodeId);
        if (!node || node.status === "offline") return prev;

        const newNodes = prev.nodes.map((n) =>
          n.id === nodeId
            ? { ...n, status: "offline" as const, connectedUsers: 0, load: 0 }
            : n
        );

        // Break all edges connected to this node
        const newEdges = prev.edges.map((e) =>
          e.source === nodeId || e.target === nodeId
            ? { ...e, status: "broken" as const }
            : e
        );

        // Increase latency on nearby nodes
        const finalNodes = newNodes.map((n) => {
          if (n.status === "offline") return n;
          const isNeighbor =
            prev.edges.some(
              (e) =>
                (e.source === nodeId && e.target === n.id) ||
                (e.target === nodeId && e.source === n.id)
            );
          if (isNeighbor) {
            return {
              ...n,
              latency: Math.min(n.latency + 15, 200),
              load: Math.min(n.load + 20, 100),
              status: n.load + 20 > 85 ? ("degraded" as const) : n.status,
            };
          }
          return n;
        });

        return { nodes: finalNodes, edges: newEdges };
      });
      addEvent("failure", `Node "${nodeId}" went offline. Connections severed.`);
    },
    [addEvent]
  );

  // Simulate storm (multiple failures)
  const simulateStorm = useCallback(() => {
    setGraph((prev) => {
      const towers = prev.nodes.filter(
        (n) => n.type === "tower" && n.status !== "offline"
      );
      const count = Math.min(Math.ceil(towers.length * 0.4), towers.length);
      const shuffled = [...towers].sort(() => Math.random() - 0.5);
      const victims = shuffled.slice(0, count);
      const victimIds = new Set(victims.map((v) => v.id));

      const newNodes = prev.nodes.map((n) =>
        victimIds.has(n.id)
          ? { ...n, status: "offline" as const, connectedUsers: 0, load: 0 }
          : n
      );

      const newEdges = prev.edges.map((e) =>
        victimIds.has(e.source) || victimIds.has(e.target)
          ? { ...e, status: "broken" as const }
          : e
      );

      return { nodes: newNodes, edges: newEdges };
    });
    addEvent("failure", "⛈️ Storm hit! Multiple towers offline.");
  }, [addEvent]);

  // Simulate fiber cut
  const simulateFiberCut = useCallback(() => {
    setGraph((prev) => {
      const fiberEdges = prev.edges.filter(
        (e) => e.type === "fiber" && e.status !== "broken"
      );
      if (fiberEdges.length === 0) return prev;
      const victim = fiberEdges[Math.floor(Math.random() * fiberEdges.length)];
      const newEdges = prev.edges.map((e) =>
        e.id === victim.id ? { ...e, status: "broken" as const } : e
      );
      return { ...prev, edges: newEdges };
    });
    addEvent("failure", "🔌 Fiber cut detected! Rerouting required.");
  }, [addEvent]);

  // Add mesh node for recovery
  const addMeshNode = useCallback(() => {
    meshCounter++;
    const id = `mesh-${meshCounter}`;
    const offlineNodes = graph.nodes.filter((n) => n.status === "offline");

    let x = 400 + Math.random() * 200;
    let y = 400 + Math.random() * 100;

    if (offlineNodes.length > 0) {
      const target = offlineNodes[0];
      x = target.position.x + (Math.random() - 0.5) * 100;
      y = target.position.y + (Math.random() - 0.5) * 80;
    }

    const newNode: NetworkNode = {
      id,
      type: "mesh",
      label: `Mesh Node ${meshCounter}`,
      status: "healthy",
      capacity: 40,
      load: 10,
      latency: 20,
      connectedUsers: 0,
      battery: 100,
      position: { x, y },
    };

    // Connect to nearest healthy nodes
    const healthyNodes = graph.nodes.filter(
      (n) => n.status !== "offline" && n.type !== "phone"
    );
    const sorted = healthyNodes
      .map((n) => ({
        node: n,
        dist: Math.hypot(n.position.x - x, n.position.y - y),
      }))
      .sort((a, b) => a.dist - b.dist);

    const newEdges: NetworkEdge[] = sorted.slice(0, 2).map((s, i) => ({
      id: `e-${id}-${s.node.id}`,
      source: id,
      target: s.node.id,
      type: "mesh" as const,
      bandwidth: 30,
      latency: 15,
      status: "active" as const,
    }));

    setGraph((prev) => ({
      nodes: [...prev.nodes, newNode],
      edges: [...prev.edges, ...newEdges],
    }));
    addEvent("recovery", `📡 Mesh node "${id}" deployed and connected.`);
  }, [graph, addEvent]);

  // Deploy drone
  const deployDrone = useCallback(() => {
    droneCounter++;
    const id = `drone-${droneCounter}`;
    const offlineNodes = graph.nodes.filter((n) => n.status === "offline");

    let x = 500;
    let y = 350;

    if (offlineNodes.length > 0) {
      const target = offlineNodes[0];
      x = target.position.x;
      y = target.position.y - 60;
    }

    const newNode: NetworkNode = {
      id,
      type: "drone",
      label: `Drone BS ${droneCounter}`,
      status: "healthy",
      capacity: 50,
      load: 5,
      latency: 25,
      connectedUsers: 0,
      battery: 80,
      position: { x, y },
    };

    const healthyNodes = graph.nodes.filter(
      (n) => n.status !== "offline" && n.type !== "phone"
    );
    const sorted = healthyNodes
      .map((n) => ({
        node: n,
        dist: Math.hypot(n.position.x - x, n.position.y - y),
      }))
      .sort((a, b) => a.dist - b.dist);

    const newEdges: NetworkEdge[] = sorted.slice(0, 3).map((s) => ({
      id: `e-${id}-${s.node.id}`,
      source: id,
      target: s.node.id,
      type: "wireless" as const,
      bandwidth: 40,
      latency: 20,
      status: "active" as const,
    }));

    setGraph((prev) => ({
      nodes: [...prev.nodes, newNode],
      edges: [...prev.edges, ...newEdges],
    }));
    addEvent("recovery", `🛸 Drone base station "${id}" deployed.`);
  }, [graph, addEvent]);

  // Recover network
  const recoverNetwork = useCallback(() => {
    setGraph((prev) => {
      const newNodes = prev.nodes.map((n) => ({
        ...n,
        status: "healthy" as const,
        latency: n.type === "tower" ? 18 : n.type === "phone" ? 28 : n.latency,
        load: Math.max(n.load - 20, 10),
        connectedUsers:
          n.type === "tower"
            ? Math.floor(300 + Math.random() * 500)
            : n.connectedUsers,
      }));
      const newEdges = prev.edges.map((e) => ({
        ...e,
        status: "active" as const,
      }));
      return { nodes: newNodes, edges: newEdges };
    });
    addEvent("recovery", "✅ Network fully recovered. All nodes online.");
  }, [addEvent]);

  // Reset to default
  const resetNetwork = useCallback(() => {
    meshCounter = 0;
    droneCounter = 0;
    setGraph(generateDefaultNetwork());
    setEvents([]);
    setRecoveryPath(null);
    addEvent("info", "🔄 Network reset to default state.");
  }, [addEvent]);

  // Find path between two nodes
  const findPath = useCallback(
    (from: string, to: string) => {
      const path = findShortestPath(graph, from, to);
      setRecoveryPath(path);
      if (path) {
        addEvent("info", `📍 Path found: ${path.join(" → ")}`);
      } else {
        addEvent("warning", `⚠️ No path between ${from} and ${to}`);
      }
      return path;
    },
    [graph, addEvent]
  );

  return {
    graph,
    events,
    recoveryPath,
    getStats,
    destroyNode,
    simulateStorm,
    simulateFiberCut,
    addMeshNode,
    deployDrone,
    recoverNetwork,
    resetNetwork,
    findPath,
    getConnectedComponents: () => getConnectedComponents(graph),
  };
}
