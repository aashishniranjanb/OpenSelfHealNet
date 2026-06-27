"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeTypes,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Radio,
  Smartphone,
  Server,
  Globe,
  Wifi,
  CloudLightning,
  Scissors,
  Plus,
  RotateCcw,
  Zap,
  Activity,
  AlertTriangle,
  Play,
  Pause,
  Layers,
  Battery,
  Users,
  Clock,
  Sparkles,
  GitBranch,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { useNetworkSimulation } from "@/hooks/use-network-simulation";

// Custom Network Node Component (handles circles and indicators)
function DigitalTwinNode({ data }: { data: Record<string, unknown> }) {
  const nodeType = data.nodeType as string;
  const status = data.status as string;
  const label = data.label as string;
  const load = data.load as number;
  const batteryLevel = data.battery as number;
  const powerConnected = data.powerConnected as boolean;
  const coverageRadius = data.coverageRadius as number;
  const activeLayers = data.activeLayers as Record<string, boolean>;

  const iconMap: Record<string, React.ReactNode> = {
    tower: <Radio className="w-5 h-5" />,
    phone: <Smartphone className="w-4 h-4" />,
    core: <Server className="w-5 h-5" />,
    gateway: <Globe className="w-5 h-5" />,
    mesh: <Wifi className="w-4 h-4" />,
    drone: <Zap className="w-4 h-4" />,
    router: <Activity className="w-4 h-4" />,
    powerGrid: <Sparkles className="w-5 h-5" />,
  };

  const statusColors: Record<string, { bg: string; border: string; text: string }> = {
    healthy: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)", text: "#10b981" },
    degraded: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", text: "#f59e0b" },
    offline: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", text: "#ef4444" },
  };

  const colors = statusColors[status] || statusColors.healthy;

  return (
    <div className="relative flex flex-col items-center select-none" style={{ minWidth: 80 }}>
      {/* Target/Source connection handles for React Flow routing */}
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />

      {/* Coverage Radius circle overlay */}
      {activeLayers?.coverageArea && coverageRadius > 0 && status !== "offline" && (
        <div
          className="absolute rounded-full border border-dashed pointer-events-none transition-all duration-700 animate-pulse"
          style={{
            width: coverageRadius * 2,
            height: coverageRadius * 2,
            left: 40 - coverageRadius,
            top: 25 - coverageRadius,
            borderColor: status === "healthy" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.2)",
            background: status === "healthy" ? "rgba(16,185,129,0.01)" : "rgba(245,158,11,0.015)",
          }}
        />
      )}

      {/* Ripple warnings if offline/unpowered */}
      {status === "offline" && (
        <div className="absolute -inset-2 rounded-2xl animate-ripple border border-[#ef4444] opacity-50" />
      )}

      {/* Core Node Container */}
      <div
        className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 backdrop-blur-md"
        style={{
          background: colors.bg,
          border: `1.5px solid ${colors.border}`,
          boxShadow:
            status === "offline"
              ? "0 0 15px rgba(239,68,68,0.2)"
              : status === "degraded"
              ? "0 0 12px rgba(245,158,11,0.15)"
              : "0 0 10px rgba(16,185,129,0.05)",
        }}
      >
        <div className="flex items-center justify-between w-full gap-2">
          <span style={{ color: colors.text }}>{iconMap[nodeType] || iconMap.tower}</span>

          {/* Emergency Battery level indicator */}
          {nodeType !== "phone" && nodeType !== "powerGrid" && status !== "offline" && (
            <div className="flex items-center gap-0.5 text-[8px] font-mono text-text-secondary">
              <Battery className={`w-3 h-3 ${batteryLevel < 30 ? "text-[#ef4444] animate-pulse" : "text-[#10b981]"}`} />
              <span>{batteryLevel}%</span>
            </div>
          )}
        </div>

        <span className="text-[10px] font-semibold text-white whitespace-nowrap">{label}</span>

        {/* Load status bars */}
        {status !== "offline" && nodeType !== "powerGrid" && (
          <div className="w-full h-1 rounded-full bg-[rgba(255,255,255,0.08)] mt-0.5">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${load}%`,
                background: load > 85 ? "#ef4444" : load > 60 ? "#f59e0b" : "#10b981",
              }}
            />
          </div>
        )}

        {status === "offline" && <span className="text-[8px] text-[#ef4444] font-bold">OFFLINE</span>}
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  networkNode: DigitalTwinNode,
};

export function SimulationTab() {
  const {
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
    getMST,
  } = useNetworkSimulation();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const stats = getStats();

  // Convert nodes to React Flow representation
  const rfNodes: Node[] = useMemo(() => {
    return graph.nodes.map((n) => ({
      id: n.id,
      type: "networkNode",
      position: n.position,
      data: {
        label: n.label,
        nodeType: n.type,
        status: n.status,
        load: n.load,
        battery: n.battery,
        powerConnected: n.powerConnected,
        coverageRadius: n.coverageRadius,
        activeLayers,
      },
    }));
  }, [graph.nodes, activeLayers]);

  // Compute MST edges if layer is active
  const mstEdgesList = useMemo(() => {
    if (!activeLayers.mstBackbone) return [];
    return getMST();
  }, [activeLayers.mstBackbone, graph, getMST]);

  // Convert edges to React Flow representation
  const rfEdges: Edge[] = useMemo(() => {
    return graph.edges
      .filter((e) => {
        // Toggle power lines visualization
        if (e.type === "power" && !activeLayers.powerGrid) return false;
        if (e.type === "fiber" && !activeLayers.fiberLinks) return false;
        return true;
      })
      .map((e) => {
        const isMST = mstEdgesList.some((mst) => mst.id === e.id);
        const isBroken = e.status === "broken";
        const isPower = e.type === "power";

        let strokeColor = "#10b981"; // healthy active
        if (isBroken) strokeColor = "#ef4444";
        else if (e.status === "congested") strokeColor = "#f59e0b";
        else if (isPower) strokeColor = "#eab308";
        else if (e.type === "mesh") strokeColor = "#06b6d4";

        // Highlight MST backbone with distinct styling
        if (activeLayers.mstBackbone) {
          strokeColor = isMST ? "#8b5cf6" : "rgba(255,255,255,0.06)";
        }

        return {
          id: e.id,
          source: e.source,
          target: e.target,
          animated: e.status === "active" && !isPower && activeLayers.packetsFlow,
          style: {
            stroke: strokeColor,
            strokeWidth: isMST ? 4 : isBroken ? 1 : isPower ? 1.5 : 2,
            strokeDasharray: isBroken ? "5 5" : isPower ? "2 3" : undefined,
            opacity: isBroken ? 0.3 : 0.7,
          },
          markerEnd: !isPower
            ? {
                type: MarkerType.ArrowClosed,
                width: 10,
                height: 10,
                color: strokeColor,
              }
            : undefined,
        };
      });
  }, [graph.edges, activeLayers, mstEdgesList]);

  // Calculate packet animated dot coordinates
  const animatedPackets = useMemo(() => {
    if (!activeLayers.packetsFlow) return [];
    const dots: { id: string; x: number; y: number }[] = [];

    packets.forEach((p) => {
      if (p.status !== "moving" || p.hopIndex >= p.path.length - 1) return;

      const fromNode = graph.nodes.find((n) => n.id === p.path[p.hopIndex]);
      const toNode = graph.nodes.find((n) => n.id === p.path[p.hopIndex + 1]);

      if (fromNode && toNode) {
        // Linear interpolation of x/y based on progress percentage
        const x = fromNode.position.x + (toNode.position.x - fromNode.position.x) * (p.progress / 100);
        const y = fromNode.position.y + (toNode.position.y - fromNode.position.y) * (p.progress / 100);
        dots.push({ id: p.id, x, y });
      }
    });

    return dots;
  }, [packets, graph.nodes, activeLayers.packetsFlow]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] gap-4 h-[calc(100vh-140px)] min-h-[600px]">
      {/* 1. Left Control Panel: Disasters & Overlays */}
      <div className="flex flex-col gap-3 overflow-y-auto pr-1">
        {/* Scenario Center */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
            What-If Scenarios
          </h3>
          <div className="flex flex-col gap-2">
            <button onClick={triggerStormScenario} className="sim-btn danger justify-start gap-2">
              <CloudLightning className="w-4 h-4 shrink-0" />
              <span>Severe Storm Alert</span>
            </button>
            <button onClick={triggerEarthquakeScenario} className="sim-btn danger justify-start gap-2">
              <Activity className="w-4 h-4 shrink-0" />
              <span>Earthquake / Fiber Cuts</span>
            </button>
            <button onClick={triggerCyberAttackScenario} className="sim-btn danger justify-start gap-2">
              <Scissors className="w-4 h-4 shrink-0" />
              <span>Cyber Attack (DDoS)</span>
            </button>
            <button onClick={triggerPowerOutageScenario} className="sim-btn danger justify-start gap-2">
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Power Grid Failure</span>
            </button>
            <button
              onClick={triggerAllTowersDestroyed}
              className="sim-btn danger bg-red-950/30 hover:bg-red-900/40 border-red-500/40 justify-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-red-400 font-bold">ALL TOWERS DESTROYED</span>
            </button>
          </div>
        </div>

        {/* Algorithm Selection */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-[#8b5cf6]" />
            Routing Algorithm
          </h3>
          <div className="flex flex-col gap-1.5">
            {[
              { id: "dijkstra", label: "Dijkstra (Latency/Load Weight)", desc: "Avoids congested paths" },
              { id: "bfs", label: "BFS (Fewest Hops)", desc: "Shortest connection structure" },
              { id: "astar", label: "A* Pathfinding (Spatial)", desc: "Uses physical distance vectors" },
            ].map((algo) => (
              <button
                key={algo.id}
                onClick={() => setSelectedAlgorithm(algo.id as "bfs" | "dijkstra" | "astar")}
                className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                  selectedAlgorithm === algo.id
                    ? "border-[#8b5cf6] bg-[#8b5cf6]/10 text-white"
                    : "border-white/5 hover:border-white/10 text-text-muted"
                }`}
              >
                <div className="text-xs font-bold">{algo.label}</div>
                <div className="text-[10px] text-text-muted mt-0.5">{algo.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Map Layer Overlays */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#06b6d4]" />
            Telemetry Layers
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { id: "powerGrid", label: "Power Distribution", color: "text-[#eab308]" },
              { id: "fiberLinks", label: "Fiber Backhauls", color: "text-[#10b981]" },
              { id: "coverageArea", label: "Coverage Radiuses", color: "text-[#06b6d4]" },
              { id: "packetsFlow", label: "Packet Traffic Flows", color: "text-[#10b981]" },
              { id: "mstBackbone", label: "MST Spanning Tree", color: "text-[#8b5cf6]" },
            ].map((layer) => (
              <label key={layer.id} className="flex items-center justify-between text-xs cursor-pointer select-none">
                <span className="text-text-secondary">{layer.label}</span>
                <input
                  type="checkbox"
                  checked={activeLayers[layer.id as keyof typeof activeLayers]}
                  onChange={() =>
                    setActiveLayers((prev) => ({
                      ...prev,
                      [layer.id]: !prev[layer.id as keyof typeof activeLayers],
                    }))
                  }
                  className="rounded border-white/10 bg-black text-[#10b981] focus:ring-0 focus:ring-offset-0"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Center: React Flow Canvas & Time Machine controls */}
      <div className="flex flex-col gap-3 h-full">
        {/* Speed & Timeline controls */}
        <div className="glass-card px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSimulationSpeed((prev) => (prev === 0 ? 1 : 0))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"
            >
              {simulationSpeed === 0 ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5">
              {[
                { val: 1, label: "1x" },
                { val: 2, label: "5x" },
                { val: 3, label: "20x" },
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => setSimulationSpeed(s.val)}
                  disabled={simulationSpeed === 0}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                    simulationSpeed === s.val
                      ? "bg-[#10b981] text-black font-bold"
                      : "text-text-muted hover:text-white disabled:opacity-40"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-text-muted font-mono uppercase">
              {simulationSpeed === 0 ? "⏸ Simulation Paused" : "⚡ Living Simulator Active"}
            </span>
          </div>

          {/* Time Machine Replay timeline scrub */}
          {history.length > 0 && (
            <div className="flex items-center gap-2 flex-1 max-w-[280px]">
              <span className="text-[10px] text-text-muted uppercase shrink-0">Time Machine</span>
              <input
                type="range"
                min={0}
                max={history.length - 1}
                value={historyIndex === -1 ? history.length - 1 : historyIndex}
                onChange={(e) => setTimelinePosition(parseInt(e.target.value))}
                className="w-full accent-[#10b981] cursor-pointer"
              />
              {historyIndex !== -1 && (
                <button onClick={resumeFromTimeline} className="text-[10px] text-[#10b981] hover:underline shrink-0">
                  Resume
                </button>
              )}
            </div>
          )}
        </div>

        {/* Visual Map Canvas */}
        <div className="flex-1 rounded-2xl border border-white/5 bg-black/60 relative overflow-hidden">
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            minZoom={0.3}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="rgba(255,255,255,0.03)" gap={25} />
            <Controls />
            <MiniMap
              nodeColor={(n) => {
                const status = n.data?.status;
                return status === "offline" ? "#ef4444" : status === "degraded" ? "#f59e0b" : "#10b981";
              }}
              maskColor="rgba(0,0,0,0.8)"
            />

            {/* Render moving packet dots inside React Flow's coordinate layer */}
            <div className="absolute inset-0 pointer-events-none z-50">
              <svg className="w-full h-full overflow-visible">
                <AnimatePresence>
                  {animatedPackets.map((dot) => (
                    <motion.circle
                      key={dot.id}
                      cx={dot.x}
                      cy={dot.y}
                      r={4}
                      fill="#34d399"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </AnimatePresence>
              </svg>
            </div>
          </ReactFlow>

          {/* Hint Overlay */}
          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 text-[10px] text-text-muted pointer-events-none">
            💡 Select nodes to execute manual actions. Drag coordinates to pan. Scroll wheel to zoom.
          </div>
        </div>
      </div>

      {/* 3. Right Panel: Metrics, Recovery Strategies & AI recommendations */}
      <div className="flex flex-col gap-3 overflow-y-auto pl-1">
        {/* Real-time metrics */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Digital Twin Stats
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-sm font-bold text-[#10b981]">{stats.coverage}%</span>
              <p className="text-[9px] text-text-muted uppercase">Coverage</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-sm font-bold text-[#06b6d4]">{stats.avgLatency}ms</span>
              <p className="text-[9px] text-text-muted uppercase">Latency</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-sm font-bold text-[#eab308]">{stats.totalUsers}</span>
              <p className="text-[9px] text-text-muted uppercase">Connected</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-sm font-bold text-[#8b5cf6]">{stats.packetDeliveryRate}%</span>
              <p className="text-[9px] text-text-muted uppercase">Delivery Success</p>
            </div>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div className="glass-card p-4 bg-purple-950/15 border-purple-500/20">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-semibold text-purple-200 uppercase tracking-wider">AI Operations Center</h3>
          </div>
          {aiRecommendation ? (
            <div className="flex flex-col gap-2 text-xs">
              <div>
                <span className="text-[9px] text-purple-300 uppercase font-bold tracking-wide">Analysis</span>
                <p className="text-text-secondary leading-relaxed mt-0.5">{aiRecommendation.analysis}</p>
              </div>
              <div>
                <span className="text-[9px] text-purple-300 uppercase font-bold tracking-wide">Recommendation</span>
                <p className="text-white font-medium leading-relaxed mt-0.5">{aiRecommendation.actionSuggested}</p>
              </div>
              <div className="flex items-center justify-between border-t border-purple-500/10 pt-2 mt-1">
                <span className="text-[9px] text-purple-300 uppercase">Est Coverage Gain</span>
                <span className="text-[#10b981] font-bold">{aiRecommendation.expectedGain}</span>
              </div>
            </div>
          ) : (
            <p className="text-[10px] text-text-muted">Analyzing state patterns...</p>
          )}
        </div>

        {/* Action Controls for selected node */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Deploy Recovery Infrastructure
          </h3>
          <div className="flex flex-col gap-2">
            {selectedNodeId ? (
              <button
                onClick={() => {
                  destroyNode(selectedNodeId);
                  setSelectedNodeId(null);
                }}
                className="sim-btn danger w-full justify-center"
              >
                Destroy selected node: {selectedNodeId}
              </button>
            ) : (
              <button onClick={simulateFiberCut} className="sim-btn danger w-full justify-center">
                Inject Fiber Cut
              </button>
            )}
            <button onClick={addMeshNode} className="sim-btn success w-full justify-center gap-1">
              <Plus className="w-4 h-4" />
              <span>Deploy Portable Mesh BTS</span>
            </button>
            <button onClick={deployDrone} className="sim-btn success w-full justify-center gap-1">
              <Plus className="w-4 h-4" />
              <span>Deploy Aerial Drone BS</span>
            </button>
            <button onClick={recoverNetwork} className="sim-btn success w-full justify-center gap-1">
              <RotateCcw className="w-4 h-4 animate-spin-slow" />
              <span>Execute Repair / Recover All</span>
            </button>
            <button onClick={resetNetwork} className="sim-btn w-full justify-center">
              Reset Network
            </button>
          </div>
        </div>

        {/* Event Logs list */}
        <div className="glass-card p-4 flex-1 min-h-[160px] max-h-[220px] flex flex-col">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 shrink-0">
            System Event Log
          </h3>
          <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1">
            <AnimatePresence initial={false}>
              {events.slice(0, 15).map((evt) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-[9px] p-2 rounded-lg border leading-tight ${
                    evt.type === "failure"
                      ? "bg-red-500/10 border-red-500/20 text-[#ef4444]"
                      : evt.type === "recovery"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-[#10b981]"
                      : evt.type === "warning"
                      ? "bg-amber-500/10 border-amber-500/20 text-[#f59e0b]"
                      : "bg-white/5 border-white/5 text-text-muted"
                  }`}
                >
                  {evt.message}
                </motion.div>
              ))}
            </AnimatePresence>
            {events.length === 0 && <span className="text-[10px] text-text-muted">Monitoring operational cycles...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
