"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Play, RotateCcw } from "lucide-react";
import { SectionWrapper, SectionHeading } from "@/components/ui/section-wrapper";
import { fadeInUp } from "@/lib/animation-config";

interface PacketState {
  id: number;
  x: number;
  y: number;
  status: "moving" | "stuck" | "lost";
}

const nodes = [
  { id: 0, x: 120, y: 100, label: "Tower A" },
  { id: 1, x: 320, y: 80, label: "Tower B" },
  { id: 2, x: 500, y: 130, label: "Tower C" },
  { id: 3, x: 680, y: 90, label: "Tower D" },
  { id: 4, x: 880, y: 120, label: "Tower E" },
  { id: 5, x: 200, y: 260, label: "Router 1" },
  { id: 6, x: 500, y: 280, label: "Core" },
  { id: 7, x: 800, y: 260, label: "Router 2" },
];

const edges = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [1, 5], [2, 6], [3, 7], [4, 7],
  [5, 6], [6, 7],
];

export function ChapterFour() {
  const [playing, setPlaying] = useState(false);
  const [stage, setStage] = useState(0);
  const [packets, setPackets] = useState<PacketState[]>([]);
  const [congestionLevel, setCongestionLevel] = useState(0);
  const [latency, setLatency] = useState(12);
  const failedNode = 2;

  const stages = [
    { label: "Normal Operation", description: "All traffic flows smoothly through the network." },
    { label: "Tower C Fails", description: "Tower C goes offline. Direct connections severed." },
    { label: "Traffic Redirects", description: "Packets try alternative routes. Congestion begins." },
    { label: "Queues Build", description: "Neighboring nodes overloaded. Latency rising." },
    { label: "Cascading Effect", description: "Congestion spreads to adjacent nodes. Service degraded." },
  ];

  useEffect(() => {
    if (!playing) return;

    const stageTimers = [
      setTimeout(() => { setStage(1); setCongestionLevel(20); setLatency(25); }, 1500),
      setTimeout(() => { setStage(2); setCongestionLevel(45); setLatency(58); }, 3000),
      setTimeout(() => { setStage(3); setCongestionLevel(72); setLatency(120); }, 4500),
      setTimeout(() => { setStage(4); setCongestionLevel(90); setLatency(250); setPlaying(false); }, 6000),
    ];

    return () => stageTimers.forEach(clearTimeout);
  }, [playing]);

  const startSimulation = () => {
    setStage(0);
    setCongestionLevel(0);
    setLatency(12);
    setPlaying(true);
  };

  const reset = () => {
    setPlaying(false);
    setStage(0);
    setCongestionLevel(0);
    setLatency(12);
  };

  const getNodeColor = (nodeId: number) => {
    if (stage >= 1 && nodeId === failedNode) return "#ef4444";
    if (stage >= 3 && edges.some(([a, b]) => (a === failedNode && b === nodeId) || (b === failedNode && a === nodeId)))
      return "#f59e0b";
    if (stage >= 4 && (nodeId === 5 || nodeId === 7)) return "#f59e0b";
    return "#10b981";
  };

  const getEdgeColor = (from: number, to: number) => {
    if (stage >= 1 && (from === failedNode || to === failedNode)) return "#ef4444";
    if (stage >= 3 && edges.some(([a, b]) =>
      (a === failedNode || b === failedNode) &&
      ((a === from && b === to) || (a === to && b === from))
    )) return "#ef4444";
    if (stage >= 4) return "#f59e0b";
    return "rgba(16,185,129,0.4)";
  };

  return (
    <SectionWrapper id="chapter-4" withGrid>
      <SectionHeading
        eyebrow="Chapter 4"
        title="Why Does One Failure Affect So Many?"
        subtitle="Watch how congestion spreads like ripples through the network when a single node fails."
      />

      {/* Network visualization */}
      <motion.div variants={fadeInUp} className="relative max-w-4xl mx-auto mb-8">
        <svg viewBox="0 0 1000 350" className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Edges */}
          {edges.map(([from, to], i) => {
            const isBroken = stage >= 1 && (from === failedNode || to === failedNode);
            return (
              <motion.line
                key={`e-${i}`}
                x1={nodes[from].x}
                y1={nodes[from].y}
                x2={nodes[to].x}
                y2={nodes[to].y}
                stroke={getEdgeColor(from, to)}
                strokeWidth={isBroken ? 1 : 2}
                strokeDasharray={isBroken ? "4 4" : "0"}
                animate={{
                  opacity: isBroken ? 0.2 : stage >= 3 ? 0.7 : 0.5,
                }}
                transition={{ duration: 0.5 }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isDown = stage >= 1 && node.id === failedNode;
            const color = getNodeColor(node.id);
            return (
              <g key={node.id}>
                {/* Congestion ripple */}
                {stage >= 3 &&
                  !isDown &&
                  edges.some(
                    ([a, b]) =>
                      (a === failedNode && b === node.id) ||
                      (b === failedNode && a === node.id)
                  ) && (
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={14}
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth={1}
                      animate={{ r: [14, 35], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}

                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={14}
                  fill={color}
                  animate={isDown ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
                  transition={isDown ? { duration: 0.8, repeat: Infinity } : {}}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fontSize={12}
                  className="pointer-events-none select-none"
                >
                  {isDown ? "💥" : node.id < 5 ? "📡" : "🔀"}
                </text>
                <text
                  x={node.x}
                  y={node.y + 35}
                  textAnchor="middle"
                  fontSize={10}
                  fill={color}
                  fontWeight={500}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Metrics */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8"
      >
        <div className="stat-card text-center">
          <p className="text-xs text-text-muted mb-1">Congestion</p>
          <p className={`text-2xl font-bold font-mono ${congestionLevel > 60 ? "text-[#ef4444]" : congestionLevel > 30 ? "text-[#f59e0b]" : "text-[#10b981]"}`}>
            {congestionLevel}%
          </p>
        </div>
        <div className="stat-card text-center">
          <p className="text-xs text-text-muted mb-1">Latency</p>
          <p className={`text-2xl font-bold font-mono ${latency > 100 ? "text-[#ef4444]" : latency > 40 ? "text-[#f59e0b]" : "text-[#10b981]"}`}>
            {latency}ms
          </p>
        </div>
        <div className="stat-card text-center">
          <p className="text-xs text-text-muted mb-1">Packet Loss</p>
          <p className={`text-2xl font-bold font-mono ${stage >= 3 ? "text-[#ef4444]" : "text-[#10b981]"}`}>
            {stage >= 4 ? "23%" : stage >= 3 ? "12%" : stage >= 1 ? "5%" : "0%"}
          </p>
        </div>
        <div className="stat-card text-center">
          <p className="text-xs text-text-muted mb-1">Stage</p>
          <p className="text-2xl font-bold font-mono text-text-secondary">
            {stage + 1}/5
          </p>
        </div>
      </motion.div>

      {/* Stage description */}
      <motion.div variants={fadeInUp} className="text-center mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card inline-block px-6 py-3"
          >
            <p className="text-sm font-semibold text-[#f59e0b]">{stages[stage].label}</p>
            <p className="text-xs text-text-secondary mt-1">{stages[stage].description}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Controls */}
      <motion.div variants={fadeInUp} className="flex justify-center gap-4">
        {!playing && stage === 0 && (
          <button onClick={startSimulation} className="sim-btn danger w-auto">
            <Play className="w-4 h-4" /> Start Cascade
          </button>
        )}
        {stage > 0 && (
          <button onClick={reset} className="sim-btn success w-auto">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        )}
      </motion.div>
    </SectionWrapper>
  );
}
