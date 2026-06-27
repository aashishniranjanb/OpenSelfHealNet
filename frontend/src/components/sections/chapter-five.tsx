"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Shield, Zap, ArrowRight } from "lucide-react";
import { SectionWrapper, SectionHeading } from "@/components/ui/section-wrapper";
import { fadeInUp, staggerContainer } from "@/lib/animation-config";

const networkNodes = [
  { id: "A", x: 80, y: 150, label: "Tower A" },
  { id: "B", x: 250, y: 80, label: "Tower B" },
  { id: "C", x: 420, y: 150, label: "Tower C" },
  { id: "D", x: 250, y: 250, label: "Mesh D" },
  { id: "E", x: 420, y: 280, label: "Mesh E" },
  { id: "F", x: 590, y: 150, label: "Tower F" },
];

const oldRoute = ["A", "B", "C"];
const newRoute = ["A", "D", "E", "C"];

const strategies = [
  {
    label: "Repair Tower",
    time: "30 min",
    coverage: "100%",
    cost: "High",
    icon: "🔧",
    desc: "Physical repair restores full capacity but takes time.",
  },
  {
    label: "Deploy Portable Tower",
    time: "15 min",
    coverage: "60%",
    cost: "Medium",
    icon: "📡",
    desc: "Quick temporary coverage with reduced capacity.",
  },
  {
    label: "Enable Mesh Routing",
    time: "Instant",
    coverage: "75%",
    cost: "Low",
    icon: "🔗",
    desc: "Reroute traffic through mesh nodes automatically.",
  },
  {
    label: "Deploy Drone BS",
    time: "5 min",
    coverage: "90%",
    cost: "Medium",
    icon: "🛸",
    desc: "Aerial base station provides wide coverage quickly.",
  },
];

export function ChapterFive() {
  const [healed, setHealed] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);
  const [coverage, setCoverage] = useState(42);

  const triggerHeal = () => {
    setHealed(true);
    const targetCoverage = selectedStrategy !== null ? parseInt(strategies[selectedStrategy].coverage) : 75;
    let current = 42;
    const interval = setInterval(() => {
      current += 2;
      if (current >= targetCoverage) {
        current = targetCoverage;
        clearInterval(interval);
      }
      setCoverage(current);
    }, 30);
  };

  const reset = () => {
    setHealed(false);
    setSelectedStrategy(null);
    setCoverage(42);
  };

  const getEdgeColor = (from: string, to: string) => {
    if (!healed) {
      if (oldRoute.includes(from) && oldRoute.includes(to)) {
        const fi = oldRoute.indexOf(from);
        const ti = oldRoute.indexOf(to);
        if (Math.abs(fi - ti) === 1) return "rgba(239,68,68,0.4)";
      }
      return "rgba(255,255,255,0.08)";
    }
    // Healed: highlight new route
    for (let i = 0; i < newRoute.length - 1; i++) {
      if (
        (newRoute[i] === from && newRoute[i + 1] === to) ||
        (newRoute[i] === to && newRoute[i + 1] === from)
      ) {
        return "#10b981";
      }
    }
    return "rgba(255,255,255,0.08)";
  };

  const allEdges: [string, string][] = [
    ["A", "B"],
    ["B", "C"],
    ["A", "D"],
    ["D", "E"],
    ["E", "C"],
    ["C", "F"],
    ["B", "D"],
    ["E", "F"],
  ];

  return (
    <SectionWrapper id="chapter-5">
      <SectionHeading
        eyebrow="Chapter 5"
        title="Self-Healing in Action"
        subtitle="When a tower fails, the network doesn't just break — it adapts. Watch mesh nodes create alternative routes."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Network graph */}
        <motion.div variants={fadeInUp} className="relative">
          <svg viewBox="0 0 660 360" className="w-full" preserveAspectRatio="xMidYMid meet">
            {/* Edges */}
            {allEdges.map(([from, to], i) => {
              const fromNode = networkNodes.find((n) => n.id === from)!;
              const toNode = networkNodes.find((n) => n.id === to)!;
              const color = getEdgeColor(from, to);
              const isNewRoute =
                healed &&
                newRoute.some(
                  (_, idx) =>
                    idx < newRoute.length - 1 &&
                    ((newRoute[idx] === from && newRoute[idx + 1] === to) ||
                      (newRoute[idx] === to && newRoute[idx + 1] === from))
                );
              return (
                <g key={`edge-${i}`}>
                  <motion.line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={color}
                    strokeWidth={isNewRoute ? 3 : 1.5}
                    animate={{ stroke: color }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Animated packet on new route */}
                  {isNewRoute && (
                    <motion.circle
                      r={4}
                      fill="#34d399"
                      animate={{
                        cx: [fromNode.x, toNode.x],
                        cy: [fromNode.y, toNode.y],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {networkNodes.map((node) => {
              const isFailedOld =
                !healed && node.id === "B";
              const isMesh = node.id === "D" || node.id === "E";
              const isActive = healed && newRoute.includes(node.id);

              return (
                <g key={node.id}>
                  {/* Pulse for mesh nodes when healed */}
                  {healed && isMesh && (
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={16}
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth={1}
                      animate={{ r: [16, 30], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={16}
                    fill={
                      isFailedOld
                        ? "#ef4444"
                        : isActive || (!healed && !isMesh && node.id !== "B")
                        ? "#10b981"
                        : healed && isMesh
                        ? "#10b981"
                        : "rgba(255,255,255,0.1)"
                    }
                    animate={isFailedOld ? { opacity: [1, 0.4, 1] } : {}}
                    transition={isFailedOld ? { duration: 0.8, repeat: Infinity } : {}}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fontSize={13}
                    className="pointer-events-none select-none"
                  >
                    {isFailedOld ? "💥" : isMesh ? "🔗" : "📡"}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 38}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#a1a1aa"
                    fontWeight={500}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Route comparison */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className={`text-center ${healed ? "opacity-40" : ""}`}>
              <p className="text-xs text-text-muted mb-1">Old Route</p>
              <div className="flex items-center gap-1 text-sm font-mono text-[#ef4444]">
                {oldRoute.map((n, i) => (
                  <span key={n} className="flex items-center gap-1">
                    {n}
                    {i < oldRoute.length - 1 && <ArrowRight className="w-3 h-3" />}
                  </span>
                ))}
              </div>
            </div>
            <div className={`text-center ${!healed ? "opacity-40" : ""}`}>
              <p className="text-xs text-text-muted mb-1">New Route</p>
              <div className="flex items-center gap-1 text-sm font-mono text-[#10b981]">
                {newRoute.map((n, i) => (
                  <span key={n} className="flex items-center gap-1">
                    {n}
                    {i < newRoute.length - 1 && <ArrowRight className="w-3 h-3" />}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recovery strategies */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-3"
        >
          <motion.p variants={fadeInUp} className="text-sm font-semibold text-text-secondary mb-2">
            Recovery Strategies
          </motion.p>
          {strategies.map((s, i) => (
            <motion.button
              key={i}
              variants={fadeInUp}
              className={`glass-card p-4 text-left transition-all duration-300 cursor-pointer ${
                selectedStrategy === i
                  ? "border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : ""
              }`}
              onClick={() => {
                setSelectedStrategy(i);
                if (healed) {
                  setCoverage(parseInt(s.coverage));
                }
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 font-semibold text-sm">
                  <span>{s.icon}</span>
                  {s.label}
                </span>
                <span className="text-xs text-[#10b981] font-mono">{s.coverage}</span>
              </div>
              <p className="text-xs text-text-secondary">{s.desc}</p>
              <div className="flex gap-4 mt-2 text-xs text-text-muted">
                <span>⏱ {s.time}</span>
                <span>💰 {s.cost}</span>
              </div>
            </motion.button>
          ))}

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            {!healed ? (
              <button onClick={triggerHeal} className="btn-primary flex-1">
                <Shield className="w-4 h-4" />
                {selectedStrategy !== null
                  ? `Apply: ${strategies[selectedStrategy].label}`
                  : "Enable Mesh Recovery"}
              </button>
            ) : (
              <button onClick={reset} className="btn-secondary flex-1">
                <Zap className="w-4 h-4" />
                Reset Simulation
              </button>
            )}
          </div>

          {/* Coverage bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Coverage</span>
              <span className={coverage > 70 ? "text-[#10b981]" : "text-[#f59e0b]"}>
                {coverage}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: coverage > 70
                    ? "linear-gradient(90deg, #10b981, #34d399)"
                    : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                }}
                animate={{ width: `${coverage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
