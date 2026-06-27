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
} from "lucide-react";
import { SectionWrapper, SectionHeading } from "@/components/ui/section-wrapper";
import { fadeInUp } from "@/lib/animation-config";
import { useNetworkSimulation } from "@/hooks/use-network-simulation";

// Custom Node Component
function NetworkNodeComponent({ data }: { data: Record<string, unknown> }) {
  const nodeType = data.nodeType as string;
  const status = data.status as string;
  const label = data.label as string;
  const load = data.load as number;

  const iconMap: Record<string, React.ReactNode> = {
    tower: <Radio className="w-5 h-5" />,
    phone: <Smartphone className="w-4 h-4" />,
    core: <Server className="w-5 h-5" />,
    gateway: <Globe className="w-5 h-5" />,
    mesh: <Wifi className="w-4 h-4" />,
    drone: <Zap className="w-4 h-4" />,
    router: <Activity className="w-4 h-4" />,
  };

  const statusColors: Record<string, { bg: string; border: string; text: string }> = {
    healthy: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)", text: "#10b981" },
    degraded: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", text: "#f59e0b" },
    offline: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", text: "#ef4444" },
  };

  const colors = statusColors[status] || statusColors.healthy;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ minWidth: 80 }}
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-3 !h-3" />

      {/* Pulse ring for active nodes */}
      {status === "healthy" && (
        <div
          className="absolute inset-0 rounded-2xl animate-glow-breathe"
          style={{ opacity: 0.3 }}
        />
      )}
      {status === "offline" && (
        <div className="absolute -inset-2 rounded-2xl animate-ripple" style={{ borderColor: "#ef4444", border: "1px solid" }} />
      )}

      <div
        className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl transition-all duration-300"
        style={{
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          boxShadow: status === "offline" ? "0 0 15px rgba(239,68,68,0.2)" : status === "healthy" ? "0 0 10px rgba(16,185,129,0.1)" : "none",
        }}
      >
        <span style={{ color: colors.text }}>{iconMap[nodeType] || iconMap.tower}</span>
        <span className="text-[10px] font-semibold text-white whitespace-nowrap">{label}</span>
        {status !== "offline" && (
          <div className="w-full h-1 rounded-full bg-[rgba(255,255,255,0.1)] mt-0.5">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${load}%`,
                background: (load as number) > 80 ? "#ef4444" : (load as number) > 60 ? "#f59e0b" : "#10b981",
              }}
            />
          </div>
        )}
        {status === "offline" && (
          <span className="text-[9px] text-[#ef4444] font-medium">OFFLINE</span>
        )}
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  networkNode: NetworkNodeComponent,
};

export function ChapterSeven() {
  const {
    graph,
    events,
    getStats,
    destroyNode,
    triggerStormScenario,
    simulateFiberCut,
    addMeshNode,
    deployDrone,
    recoverNetwork,
    resetNetwork,
  } = useNetworkSimulation();

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const stats = getStats();

  // Convert graph to React Flow format
  const rfNodes: Node[] = useMemo(
    () =>
      graph.nodes.map((n) => ({
        id: n.id,
        type: "networkNode",
        position: n.position,
        data: {
          label: n.label,
          nodeType: n.type,
          status: n.status,
          load: n.load,
          latency: n.latency,
          connectedUsers: n.connectedUsers,
          battery: n.battery,
          capacity: n.capacity,
        },
      })),
    [graph.nodes]
  );

  const rfEdges: Edge[] = useMemo(
    () =>
      graph.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: "default",
        animated: e.status === "active",
        style: {
          stroke:
            e.status === "broken"
              ? "#ef4444"
              : e.status === "congested"
              ? "#f59e0b"
              : e.type === "mesh"
              ? "#06b6d4"
              : "#10b981",
          strokeWidth: e.status === "broken" ? 1 : 2,
          strokeDasharray: e.status === "broken" ? "6 4" : undefined,
          opacity: e.status === "broken" ? 0.3 : 0.6,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 12,
          height: 12,
          color: e.status === "broken" ? "#ef4444" : "#10b981",
        },
      })),
    [graph.edges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  return (
    <SectionWrapper id="chapter-7" className="!py-12">
      <SectionHeading
        eyebrow="Chapter 7"
        title="Digital Twin Simulator"
        subtitle="Your personal network sandbox. Add towers, trigger failures, deploy recovery — everything updates in real time."
      />

      <motion.div
        variants={fadeInUp}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4"
      >
        {/* Sidebar Controls */}
        <div className="flex flex-col gap-3 order-2 lg:order-1">
          {/* Stats */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Network Status
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 rounded-lg bg-[rgba(255,255,255,0.02)]">
                <p className="text-lg font-bold text-[#10b981]">{stats.healthyNodes}</p>
                <p className="text-[10px] text-text-muted">Healthy</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-[rgba(255,255,255,0.02)]">
                <p className="text-lg font-bold text-[#ef4444]">{stats.offlineNodes}</p>
                <p className="text-[10px] text-text-muted">Offline</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-[rgba(255,255,255,0.02)]">
                <p className="text-lg font-bold text-[#06b6d4]">{stats.coverage}%</p>
                <p className="text-[10px] text-text-muted">Coverage</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-[rgba(255,255,255,0.02)]">
                <p className="text-lg font-bold text-[#f59e0b]">{stats.avgLatency}ms</p>
                <p className="text-[10px] text-text-muted">Latency</p>
              </div>
            </div>
          </div>

          {/* Failure Actions */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Simulate Failures
            </h3>
            <div className="flex flex-col gap-2">
              {selectedNode && (
                <button
                  onClick={() => { destroyNode(selectedNode); setSelectedNode(null); }}
                  className="sim-btn danger"
                >
                  <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
                  Destroy: {selectedNode}
                </button>
              )}
              <button onClick={triggerStormScenario} className="sim-btn danger">
                <CloudLightning className="w-4 h-4 text-[#ef4444]" />
                Simulate Storm
              </button>
              <button onClick={simulateFiberCut} className="sim-btn danger">
                <Scissors className="w-4 h-4 text-[#ef4444]" />
                Fiber Cut
              </button>
            </div>
          </div>

          {/* Recovery Actions */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Recovery Actions
            </h3>
            <div className="flex flex-col gap-2">
              <button onClick={addMeshNode} className="sim-btn success">
                <Plus className="w-4 h-4 text-[#10b981]" />
                Add Mesh Node
              </button>
              <button onClick={deployDrone} className="sim-btn success">
                <Zap className="w-4 h-4 text-[#10b981]" />
                Deploy Drone BS
              </button>
              <button onClick={recoverNetwork} className="sim-btn success">
                <Wifi className="w-4 h-4 text-[#10b981]" />
                Recover All
              </button>
              <button onClick={resetNetwork} className="sim-btn">
                <RotateCcw className="w-4 h-4" />
                Reset Network
              </button>
            </div>
          </div>

          {/* Event Log */}
          <div className="glass-card p-4 flex-1 max-h-[200px] overflow-auto">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Event Log
            </h3>
            <div className="flex flex-col gap-1.5">
              <AnimatePresence>
                {events.slice(0, 8).map((evt) => (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-[10px] p-1.5 rounded-md ${
                      evt.type === "failure"
                        ? "bg-[rgba(239,68,68,0.08)] text-[#ef4444]"
                        : evt.type === "recovery"
                        ? "bg-[rgba(16,185,129,0.08)] text-[#10b981]"
                        : evt.type === "warning"
                        ? "bg-[rgba(245,158,11,0.08)] text-[#f59e0b]"
                        : "bg-[rgba(255,255,255,0.03)] text-text-muted"
                    }`}
                  >
                    {evt.message}
                  </motion.div>
                ))}
              </AnimatePresence>
              {events.length === 0 && (
                <p className="text-[10px] text-text-muted">
                  Click nodes or use controls to begin
                </p>
              )}
            </div>
          </div>
        </div>

        {/* React Flow Graph */}
        <div className="order-1 lg:order-2 h-[500px] lg:h-[650px] rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[#050505]">
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            minZoom={0.3}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
            className="!bg-[#050505]"
          >
            <Background color="rgba(255,255,255,0.03)" gap={30} />
            <Controls />
            <MiniMap
              nodeColor={(n) => {
                const status = n.data?.status;
                return status === "offline"
                  ? "#ef4444"
                  : status === "degraded"
                  ? "#f59e0b"
                  : "#10b981";
              }}
              maskColor="rgba(5,5,5,0.8)"
            />
          </ReactFlow>
        </div>
      </motion.div>

      {/* Hint */}
      <motion.p
        variants={fadeInUp}
        className="text-center text-xs text-text-muted mt-4"
      >
        💡 Click any node to select it, then use &quot;Destroy&quot; to simulate a failure. Drag to pan, scroll to zoom.
      </motion.p>
    </SectionWrapper>
  );
}
