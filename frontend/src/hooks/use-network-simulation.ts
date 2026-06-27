"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  calculateMST,
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
  packetDeliveryRate: number;
}

export interface SimulationEvent {
  id: string;
  type: "failure" | "recovery" | "info" | "warning";
  message: string;
  timestamp: number;
}

export interface SimulatedPacket {
  id: string;
  source: string;
  target: string;
  path: string[];
  hopIndex: number;
  progress: number; // 0 to 100 between current hop and next
  status: "moving" | "delivered" | "dropped";
}

export interface AIRecommendation {
  title: string;
  analysis: string;
  actionSuggested: string;
  expectedGain: string;
}

let meshCounter = 0;
let droneCounter = 0;
let packetCounter = 0;

export function useNetworkSimulation() {
  const [graph, setGraph] = useState<NetworkGraph>(generateDefaultNetwork());
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"bfs" | "dijkstra" | "astar">("dijkstra");
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // 0=Paused, 1=1x, 2=5x, 3=20x
  const [packets, setPackets] = useState<SimulatedPacket[]>([]);
  const [activeLayers, setActiveLayers] = useState({
    powerGrid: true,
    fiberLinks: true,
    coverageArea: true,
    packetsFlow: true,
    mstBackbone: false,
  });

  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);

  // Time Machine Snapshots history
  const [history, setHistory] = useState<NetworkGraph[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isPlayingBackHistory = useRef(false);

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

  // Core Simulation stats
  const getStats = useCallback((): SimulationStats => {
    const healthyNodes = graph.nodes.filter((n) => n.status === "healthy" && n.type !== "powerGrid").length;
    const offlineNodes = graph.nodes.filter((n) => n.status === "offline" && n.type !== "powerGrid").length;
    const degradedNodes = graph.nodes.filter((n) => n.status === "degraded" && n.type !== "powerGrid").length;
    const activeEdges = graph.edges.filter((e) => e.status !== "broken" && e.type !== "power").length;
    const brokenEdges = graph.edges.filter((e) => e.status === "broken" && e.type !== "power").length;

    // Delivery stats
    const totalPackets = packets.length;
    const deliveredPackets = packets.filter((p) => p.status === "delivered").length;
    const deliveryRate = totalPackets > 0 ? Math.round((deliveredPackets / totalPackets) * 100) : 100;

    return {
      totalNodes: graph.nodes.filter((n) => n.type !== "powerGrid").length,
      healthyNodes,
      offlineNodes,
      degradedNodes,
      coverage: calculateCoverage(graph),
      avgLatency: calculateAvgLatency(graph),
      totalUsers: calculateTotalUsers(graph),
      activeEdges,
      brokenEdges,
      packetDeliveryRate: deliveryRate,
    };
  }, [graph, packets]);

  // AI Recommendation Engine
  const generateAIRecommendation = useCallback((currentGraph: NetworkGraph) => {
    const offline = currentGraph.nodes.filter((n) => n.status === "offline" && n.type === "tower");
    const degraded = currentGraph.nodes.filter((n) => n.status === "degraded");
    const unpowered = currentGraph.nodes.filter((n) => !n.powerConnected && n.status !== "offline" && n.type === "tower");

    if (offline.length === currentGraph.nodes.filter(n => n.type === "tower").length) {
      setAiRecommendation({
        title: "CRITICAL SYSTEM COLLAPSE",
        analysis: "100% of primary cell towers are destroyed. All user coverage is terminated.",
        actionSuggested: "Deploy Portable Mesh Base-stations + Emergency backup Satellite links.",
        expectedGain: "Will restore up to 40% essential emergency coverage.",
      });
      return;
    }

    if (offline.length > 0) {
      setAiRecommendation({
        title: "Coverage Blackout Detected",
        analysis: `${offline.length} primary tower(s) are offline. Nearby users disconnected.`,
        actionSuggested: `Deploy Drone Base Station to hover above coordinates of ${offline[0].label}.`,
        expectedGain: "Restores up to 90% cellular signal and re-routes active user packets.",
      });
      return;
    }

    if (unpowered.length > 0) {
      setAiRecommendation({
        title: "Power Loss Risk Warning",
        analysis: `${unpowered.length} cell towers running on emergency batteries due to power grid outage.`,
        actionSuggested: "Dispatch local repair crew to power sub-stations or increase backhaul power scaling.",
        expectedGain: "Prevents secondary battery drainage collapse.",
      });
      return;
    }

    if (degraded.length > 0) {
      setAiRecommendation({
        title: "Traffic Congestion Detected",
        analysis: "High load on redundant routing links causing latency spikes.",
        actionSuggested: "Switch routing selection to A* or Dijkstra optimization layers.",
        expectedGain: "Reduces average latency by 15-20ms.",
      });
      return;
    }

    setAiRecommendation({
      title: "All Infrastructure Healthy",
      analysis: "Power supply stable. Backhaul links are operating at 100% bandwidth capacity.",
      actionSuggested: "Maintain current Dijkstra routing tables. Keep simulator monitoring active.",
      expectedGain: "Optimal packet delivery at 100% success rate.",
    });
  }, []);

  // Update loop for power connectivity, battery status, and load migration
  const runSimulationTick = useCallback(() => {
    setGraph((prev) => {
      // 1. Determine power source station health
      const powerGridStation = prev.nodes.find((n) => n.type === "powerGrid");
      const isPowerGridWorking = powerGridStation ? powerGridStation.status === "healthy" : false;

      // 2. Map nodes with updated power connectivity
      const newNodes = prev.nodes.map((node) => {
        if (node.type === "powerGrid") return node;

        // Check if there is an active power connection edge
        const hasPowerConnection = prev.edges.some(
          (e) =>
            e.type === "power" &&
            e.status === "active" &&
            ((e.source === "power-1" && e.target === node.id) ||
              (e.target === "power-1" && e.source === node.id))
        );

        const powerConnected = isPowerGridWorking && hasPowerConnection;

        // Battery logic
        let battery = node.battery;
        let status = node.status;
        let load = node.load;
        let connectedUsers = node.connectedUsers;

        if (node.type === "tower" || node.type === "router" || node.type === "core") {
          if (!powerConnected) {
            battery = Math.max(battery - 5, 0); // Drain 5% battery per tick
            if (battery === 0) {
              status = "offline";
              load = 0;
              connectedUsers = 0;
            } else if (battery < 20) {
              status = "degraded";
            }
          } else {
            battery = Math.min(battery + 10, 100); // Re-charge battery if power restored
            if (status === "offline" && battery > 10) {
              status = "healthy";
            }
          }
        }

        return {
          ...node,
          powerConnected,
          battery,
          status,
          load,
          connectedUsers,
        };
      });

      // 3. User redistribution: if a tower goes offline, migrate users to nearest healthy tower
      const finalNodes = newNodes.map((node) => {
        if (node.type !== "phone" || node.status === "offline") return node;

        // Find nearest online tower/mesh/drone within coverage radius
        let nearestTowerId: string | null = null;
        let minDist = Infinity;

        const activeServiceNodes = newNodes.filter(
          (n) => (n.type === "tower" || n.type === "mesh" || n.type === "drone") && n.status !== "offline"
        );

        for (const t of activeServiceNodes) {
          const dist = Math.hypot(t.position.x - node.position.x, t.position.y - node.position.y);
          if (dist <= t.coverageRadius && dist < minDist) {
            minDist = dist;
            nearestTowerId = t.id;
          }
        }

        // Adjust signal load based on distance
        let latency = 25;
        let loadVal = node.load;
        if (nearestTowerId) {
          latency = Math.round(10 + (minDist / 10)); // Latency proportional to distance
        } else {
          latency = 120; // Disconnected/extremely high latency searching for signal
          loadVal = 0;
        }

        return {
          ...node,
          latency,
          load: loadVal,
        };
      });

      // Recalculate loads on towers based on number of nearby user groups
      const towerIdCounts: Record<string, number> = {};
      finalNodes.forEach((n) => {
        if (n.type === "phone" && n.status !== "offline") {
          // Find nearest service node
          const serviceNodes = finalNodes.filter(
            (s) => (s.type === "tower" || s.type === "mesh" || s.type === "drone") && s.status !== "offline"
          );
          let closestId = "";
          let minDist = Infinity;
          serviceNodes.forEach((s) => {
            const dist = Math.hypot(s.position.x - n.position.x, s.position.y - n.position.y);
            if (dist <= s.coverageRadius && dist < minDist) {
              minDist = dist;
              closestId = s.id;
            }
          });
          if (closestId) {
            towerIdCounts[closestId] = (towerIdCounts[closestId] || 0) + n.connectedUsers;
          }
        }
      });

      const updatedTowers = finalNodes.map((n) => {
        if (n.type === "tower" || n.type === "mesh" || n.type === "drone") {
          if (n.status === "offline") return n;
          const users = towerIdCounts[n.id] || 0;
          const currentLoad = Math.min(Math.round((users / n.capacity) * 100), 100);
          const isDegraded = currentLoad > 85;
          return {
            ...n,
            connectedUsers: users,
            load: currentLoad,
            status: isDegraded ? ("degraded" as const) : ("healthy" as const),
            latency: isDegraded ? n.latency + 15 : n.latency,
          };
        }
        return n;
      });

      return { nodes: updatedTowers, edges: prev.edges };
    });

    // 4. Generate random packets traversing the network
    generateTraffic();

    // 5. Progress active packets
    progressPackets();
  }, [packets]);

  // Handle active simulation ticks clock
  useEffect(() => {
    if (simulationSpeed === 0 || isPlayingBackHistory.current) return;

    const intervalTime = simulationSpeed === 1 ? 1000 : simulationSpeed === 2 ? 200 : 50;
    const timer = setInterval(() => {
      runSimulationTick();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [simulationSpeed, runSimulationTick]);

  // Keep state snapshots for history/time machine
  useEffect(() => {
    if (simulationSpeed === 0) return;
    setHistory((prev) => [...prev.slice(-99), graph]);
    generateAIRecommendation(graph);
  }, [graph, simulationSpeed, generateAIRecommendation]);

  // Helper to inject random packets from phones to core/gateway
  const generateTraffic = () => {
    setPackets((prev) => {
      // Clean up finished packets to save memory
      const active = prev.filter((p) => p.status === "moving");
      if (active.length > 8) return prev; // cap concurrent active packet visual dots

      const phones = graph.nodes.filter((n) => n.type === "phone" && n.status !== "offline");
      const gateways = graph.nodes.filter((n) => n.type === "gateway" && n.status !== "offline");

      if (phones.length === 0 || gateways.length === 0) return prev;

      const randomPhone = phones[Math.floor(Math.random() * phones.length)];
      const randomGateway = gateways[Math.floor(Math.random() * gateways.length)];

      const path = findShortestPath(graph, randomPhone.id, randomGateway.id, selectedAlgorithm);

      if (!path || path.length < 2) return prev;

      packetCounter++;
      const newPacket: SimulatedPacket = {
        id: `pkt-${packetCounter}`,
        source: randomPhone.id,
        target: randomGateway.id,
        path,
        hopIndex: 0,
        progress: 0,
        status: "moving",
      };

      return [...prev, newPacket];
    });
  };

  // Move packet animations along edges
  const progressPackets = () => {
    setPackets((prev) =>
      prev.map((pkt) => {
        if (pkt.status !== "moving") return pkt;

        // Double check path viability (if any node on path goes offline, packet gets dropped)
        const currentHopNode = graph.nodes.find((n) => n.id === pkt.path[pkt.hopIndex]);
        const nextHopNode = graph.nodes.find((n) => n.id === pkt.path[pkt.hopIndex + 1]);

        if (!currentHopNode || currentHopNode.status === "offline" || !nextHopNode || nextHopNode.status === "offline") {
          return { ...pkt, status: "dropped" as const };
        }

        const progressIncrement = 25; // 25% progress per simulation update step
        const nextProgress = pkt.progress + progressIncrement;

        if (nextProgress >= 100) {
          const nextHopIndex = pkt.hopIndex + 1;
          if (nextHopIndex >= pkt.path.length - 1) {
            return { ...pkt, progress: 100, hopIndex: nextHopIndex, status: "delivered" as const };
          }
          return { ...pkt, progress: 0, hopIndex: nextHopIndex };
        }

        return { ...pkt, progress: nextProgress };
      })
    );
  };

  // Timeline / Time Machine scrub handler
  const setTimelinePosition = (idx: number) => {
    if (idx < 0 || idx >= history.length) return;
    isPlayingBackHistory.current = true;
    setSimulationSpeed(0); // Pause
    setHistoryIndex(idx);
    setGraph(history[idx]);
  };

  const resumeFromTimeline = () => {
    isPlayingBackHistory.current = false;
    setHistoryIndex(-1);
    setSimulationSpeed(1);
  };

  // Scenario 1: Storm Scenario (Degrades signals, drops random towers)
  const triggerStormScenario = () => {
    setGraph((prev) => {
      addEvent("failure", "⛈️ severe storm alert. signal attenuation active on wireless backhaul.");
      return {
        nodes: prev.nodes.map((n) => {
          if (n.type === "tower") {
            const isAffected = Math.random() > 0.4;
            return {
              ...n,
              status: isAffected ? ("degraded" as const) : n.status,
              latency: isAffected ? n.latency + 30 : n.latency,
              coverageRadius: isAffected ? Math.max(n.coverageRadius - 50, 80) : n.coverageRadius,
            };
          }
          return n;
        }),
        edges: prev.edges.map((e) => {
          if (e.type === "wireless") {
            return { ...e, status: Math.random() > 0.7 ? ("broken" as const) : ("congested" as const) };
          }
          return e;
        }),
      };
    });
  };

  // Scenario 2: Earthquake Scenario
  const triggerEarthquakeScenario = () => {
    addEvent("failure", "🌋 earthquake hit. multiple fiber backhaul cuts detected.");
    setGraph((prev) => {
      return {
        nodes: prev.nodes.map((n, i) => {
          if (n.type === "tower" && i % 2 === 0) {
            return { ...n, status: "offline" as const, connectedUsers: 0, load: 0 };
          }
          return n;
        }),
        edges: prev.edges.map((e) => {
          if (e.type === "fiber") {
            return { ...e, status: Math.random() > 0.5 ? ("broken" as const) : e.status };
          }
          return e;
        }),
      };
    });
  };

  // Scenario 3: Cyber Attack Scenario
  const triggerCyberAttackScenario = () => {
    addEvent("warning", "🛡️ DDOS Cyber Attack targeting Coreedge network routers.");
    setGraph((prev) => {
      return {
        nodes: prev.nodes.map((n) => {
          if (n.type === "router") {
            return { ...n, status: "degraded" as const, load: 95, latency: 150 };
          }
          return n;
        }),
        edges: prev.edges.map((e) => {
          if (e.source.includes("router") || e.target.includes("router")) {
            return { ...e, status: "congested" as const };
          }
          return e;
        }),
      };
    });
  };

  // Scenario 4: Power Outage Scenario
  const triggerPowerOutageScenario = () => {
    addEvent("failure", "🔌 central Power Grid failure. towers transitioning to backup battery.");
    setGraph((prev) => {
      // Set power station offline
      const newNodes = prev.nodes.map((n) =>
        n.type === "powerGrid" ? { ...n, status: "offline" as const } : n
      );
      // Cut power edges
      const newEdges = prev.edges.map((e) =>
        e.type === "power" ? { ...e, status: "broken" as const } : e
      );
      return { nodes: newNodes, edges: newEdges };
    });
  };

  // Scenario 5: ALL TOWERS DESTROYED Scenario
  const triggerAllTowersDestroyed = () => {
    addEvent("failure", "💥 catastrophe: all service towers destroyed! Complete blackout.");
    setGraph((prev) => {
      return {
        nodes: prev.nodes.map((n) => {
          if (n.type === "tower" || n.type === "mesh" || n.type === "drone") {
            return { ...n, status: "offline" as const, connectedUsers: 0, load: 0, battery: 0 };
          }
          return n;
        }),
        edges: prev.edges.map((e) => {
          if (e.type === "wireless" || e.type === "mesh") {
            return { ...e, status: "broken" as const };
          }
          return e;
        }),
      };
    });
    setPackets([]);
  };

  // Destroy a specific node manually
  const destroyNode = useCallback(
    (nodeId: string) => {
      setGraph((prev) => {
        const node = prev.nodes.find((n) => n.id === nodeId);
        if (!node || node.status === "offline") return prev;

        const newNodes = prev.nodes.map((n) =>
          n.id === nodeId ? { ...n, status: "offline" as const, connectedUsers: 0, load: 0 } : n
        );

        const newEdges = prev.edges.map((e) =>
          e.source === nodeId || e.target === nodeId ? { ...e, status: "broken" as const } : e
        );

        return { nodes: newNodes, edges: newEdges };
      });
      addEvent("failure", `Node "${nodeId}" manually offline.`);
    },
    [addEvent]
  );

  // Fiber cut manually
  const simulateFiberCut = useCallback(() => {
    setGraph((prev) => {
      const fiberEdges = prev.edges.filter((e) => e.type === "fiber" && e.status !== "broken");
      if (fiberEdges.length === 0) return prev;
      const victim = fiberEdges[Math.floor(Math.random() * fiberEdges.length)];
      const newEdges = prev.edges.map((e) =>
        e.id === victim.id ? { ...e, status: "broken" as const } : e
      );
      return { ...prev, edges: newEdges };
    });
    addEvent("failure", "🔌 Fiber cut simulated.");
  }, [addEvent]);

  // Deploy recovery: Mesh node
  const addMeshNode = useCallback(() => {
    meshCounter++;
    const id = `mesh-${meshCounter}`;
    const offlineNodes = graph.nodes.filter((n) => n.status === "offline" && n.type === "tower");

    let x = 400 + Math.random() * 200;
    let y = 490;

    if (offlineNodes.length > 0) {
      const target = offlineNodes[0];
      x = target.position.x + (Math.random() - 0.5) * 80;
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
      powerConnected: true,
      coverageRadius: 100,
      position: { x, y },
    };

    const healthyNodes = graph.nodes.filter((n) => n.status !== "offline" && n.type !== "phone" && n.type !== "powerGrid");
    const sorted = healthyNodes
      .map((n) => ({
        node: n,
        dist: Math.hypot(n.position.x - x, n.position.y - y),
      }))
      .sort((a, b) => a.dist - b.dist);

    const newEdges: NetworkEdge[] = sorted.slice(0, 2).map((s) => ({
      id: `e-${id}-${s.node.id}`,
      source: id,
      target: s.node.id,
      type: "mesh" as const,
      bandwidth: 150,
      latency: 12,
      status: "active" as const,
    }));

    setGraph((prev) => ({
      nodes: [...prev.nodes, newNode],
      edges: [...prev.edges, ...newEdges],
    }));
    addEvent("recovery", `📡 Mesh Router "${id}" deployed.`);
  }, [graph, addEvent]);

  // Deploy recovery: Drone base station
  const deployDrone = useCallback(() => {
    droneCounter++;
    const id = `drone-${droneCounter}`;
    const offlineNodes = graph.nodes.filter((n) => n.status === "offline" && n.type === "tower");

    let x = 500;
    let y = 390;

    if (offlineNodes.length > 0) {
      const target = offlineNodes[0];
      x = target.position.x;
      y = target.position.y - 80;
    }

    const newNode: NetworkNode = {
      id,
      type: "drone",
      label: `Drone BS ${droneCounter}`,
      status: "healthy",
      capacity: 80,
      load: 5,
      latency: 18,
      connectedUsers: 0,
      battery: 90, // starts a bit drained
      powerConnected: false, // drones carry onboard batteries
      coverageRadius: 210,
      position: { x, y },
    };

    const healthyNodes = graph.nodes.filter((n) => n.status !== "offline" && n.type !== "phone" && n.type !== "powerGrid");
    const sorted = healthyNodes
      .map((n) => ({
        node: n,
        dist: Math.hypot(n.position.x - x, n.position.y - y),
      }))
      .sort((a, b) => a.dist - b.dist);

    const newEdges: NetworkEdge[] = sorted.slice(0, 2).map((s) => ({
      id: `e-${id}-${s.node.id}`,
      source: id,
      target: s.node.id,
      type: "wireless" as const,
      bandwidth: 300,
      latency: 8,
      status: "active" as const,
    }));

    setGraph((prev) => ({
      nodes: [...prev.nodes, newNode],
      edges: [...prev.edges, ...newEdges],
    }));
    addEvent("recovery", `🛸 Aerial Drone Base Station "${id}" deployed.`);
  }, [graph, addEvent]);

  // Recover whole network
  const recoverNetwork = useCallback(() => {
    setGraph((prev) => {
      const newNodes = prev.nodes.map((n) => {
        let statsReset = {};
        if (n.type === "tower") {
          statsReset = { connectedUsers: Math.floor(300 + Math.random() * 500) };
        }
        return {
          ...n,
          status: "healthy" as const,
          battery: 100,
          latency: n.type === "tower" ? 18 : n.latency,
          load: Math.max(n.load - 25, 20),
          ...statsReset,
        };
      });

      const newEdges = prev.edges.map((e) => ({
        ...e,
        status: "active" as const,
      }));

      return { nodes: newNodes, edges: newEdges };
    });
    addEvent("recovery", "✅ Restored primary grid operations. Network operational.");
  }, [addEvent]);

  const resetNetwork = useCallback(() => {
    meshCounter = 0;
    droneCounter = 0;
    packetCounter = 0;
    setGraph(generateDefaultNetwork());
    setEvents([]);
    setPackets([]);
    setHistory([]);
    setHistoryIndex(-1);
    isPlayingBackHistory.current = false;
    addEvent("info", "🔄 Resetting digital twin infrastructure model.");
  }, [addEvent]);

  return {
    graph,
    events,
    packets,
    selectedAlgorithm,
    setSelectedAlgorithm,
    simulationSpeed,
    setSimulationSpeed,
    activeLayers,
    setActiveLayers,
    aiRecommendation,
    history,
    historyIndex,
    setTimelinePosition,
    resumeFromTimeline,
    getStats,
    destroyNode,
    simulateFiberCut,
    addMeshNode,
    deployDrone,
    recoverNetwork,
    resetNetwork,
    triggerStormScenario,
    triggerEarthquakeScenario,
    triggerCyberAttackScenario,
    triggerPowerOutageScenario,
    triggerAllTowersDestroyed,
    getMST: () => calculateMST(graph),
  };
}
