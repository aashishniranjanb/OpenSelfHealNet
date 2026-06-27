"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { CloudLightning, AlertTriangle } from "lucide-react";
import { SectionWrapper, SectionHeading } from "@/components/ui/section-wrapper";
import { fadeInUp } from "@/lib/animation-config";

const towerPositions = [
  { x: 100, y: 200, label: "Tower A", users: 542 },
  { x: 300, y: 150, label: "Tower B", users: 891 },
  { x: 500, y: 220, label: "Tower C", users: 634 },
  { x: 700, y: 170, label: "Tower D", users: 423 },
  { x: 900, y: 210, label: "Tower E", users: 756 },
];

const connections = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 2], [1, 3], [2, 4],
];

export function ChapterThree() {
  const [failed, setFailed] = useState(false);
  const [failedTower, setFailedTower] = useState(2);
  const coverageValue = useMotionValue(100);
  const coverageDisplay = useTransform(coverageValue, (v) => `${Math.round(v)}%`);
  const coverageRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsubscribe = coverageDisplay.on("change", (v) => {
      if (coverageRef.current) coverageRef.current.textContent = v;
    });
    return () => unsubscribe();
  }, [coverageDisplay]);

  const triggerFailure = () => {
    if (failed) return;
    setFailed(true);
    animate(coverageValue, 42, { duration: 1.5, ease: "easeOut" });
  };

  const reset = () => {
    setFailed(false);
    animate(coverageValue, 100, { duration: 1, ease: "easeOut" });
  };

  return (
    <SectionWrapper id="chapter-3">
      <SectionHeading
        eyebrow="Chapter 3"
        title="When a Tower Falls"
        subtitle="A single point of failure can cascade through the entire network, affecting thousands of users instantly."
      />

      {/* Network visualization */}
      <motion.div variants={fadeInUp} className="relative max-w-4xl mx-auto mb-8">
        <svg viewBox="0 0 1000 380" className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Connections */}
          {connections.map(([from, to], i) => {
            const isConnectedToFailed =
              failed && (from === failedTower || to === failedTower);
            return (
              <motion.line
                key={`conn-${i}`}
                x1={towerPositions[from].x}
                y1={towerPositions[from].y}
                x2={towerPositions[to].x}
                y2={towerPositions[to].y}
                stroke={isConnectedToFailed ? "#ef4444" : "#10b981"}
                strokeWidth={isConnectedToFailed ? 1 : 2}
                strokeDasharray={isConnectedToFailed ? "6 4" : "0"}
                animate={{
                  opacity: isConnectedToFailed ? 0.3 : 0.5,
                  strokeWidth: isConnectedToFailed ? 1 : 2,
                }}
                transition={{ duration: 0.5 }}
              />
            );
          })}

          {/* Towers */}
          {towerPositions.map((tower, i) => {
            const isDown = failed && i === failedTower;
            const isAffected =
              failed &&
              connections.some(
                ([a, b]) =>
                  (a === failedTower && b === i) ||
                  (b === failedTower && a === i)
              );
            return (
              <g key={i}>
                {/* Glow / ripple for failed tower */}
                {isDown && (
                  <>
                    <motion.circle
                      cx={tower.x}
                      cy={tower.y}
                      r={20}
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth={1}
                      animate={{ r: [20, 60], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.circle
                      cx={tower.x}
                      cy={tower.y}
                      r={20}
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth={1}
                      animate={{ r: [20, 60], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    />
                  </>
                )}

                {/* Coverage area */}
                <motion.circle
                  cx={tower.x}
                  cy={tower.y}
                  r={isDown ? 0 : isAffected ? 50 : 70}
                  fill={isDown ? "transparent" : isAffected ? "rgba(245,158,11,0.05)" : "rgba(16,185,129,0.05)"}
                  stroke={isDown ? "transparent" : isAffected ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.1)"}
                  strokeWidth={1}
                  animate={{
                    r: isDown ? 0 : isAffected ? 50 : 70,
                  }}
                  transition={{ duration: 0.8 }}
                />

                {/* Tower node */}
                <motion.circle
                  cx={tower.x}
                  cy={tower.y}
                  r={16}
                  fill={isDown ? "#ef4444" : isAffected ? "#f59e0b" : "#10b981"}
                  animate={
                    isDown
                      ? { opacity: [1, 0.4, 1] }
                      : isAffected
                      ? { opacity: [1, 0.7, 1] }
                      : { opacity: 1 }
                  }
                  transition={
                    isDown || isAffected
                      ? { duration: 1, repeat: Infinity }
                      : {}
                  }
                />

                {/* Tower icon */}
                <text
                  x={tower.x}
                  y={tower.y + 5}
                  textAnchor="middle"
                  fontSize={14}
                  className="pointer-events-none select-none"
                >
                  {isDown ? "💥" : "📡"}
                </text>

                {/* Label */}
                <text
                  x={tower.x}
                  y={tower.y + 40}
                  textAnchor="middle"
                  fontSize={11}
                  fill={isDown ? "#ef4444" : isAffected ? "#f59e0b" : "#a1a1aa"}
                  fontWeight={500}
                >
                  {tower.label}
                </text>

                {/* User count */}
                <text
                  x={tower.x}
                  y={tower.y + 55}
                  textAnchor="middle"
                  fontSize={10}
                  fill={isDown ? "#ef4444" : "#71717a"}
                >
                  {isDown ? "0 users" : `${tower.users} users`}
                </text>
              </g>
            );
          })}

          {/* Storm effect */}
          {failed && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.text
                x={towerPositions[failedTower].x}
                y={towerPositions[failedTower].y - 45}
                textAnchor="middle"
                fontSize={28}
                animate={{ y: [towerPositions[failedTower].y - 45, towerPositions[failedTower].y - 50, towerPositions[failedTower].y - 45] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⛈️
              </motion.text>
            </motion.g>
          )}
        </svg>
      </motion.div>

      {/* Stats & Controls */}
      <motion.div variants={fadeInUp} className="flex flex-col items-center gap-6">
        {/* Coverage counter */}
        <div className="text-center">
          <p className="text-sm text-text-secondary mb-2">Network Coverage</p>
          <div className="flex items-baseline gap-1">
            <span
              ref={coverageRef}
              className={`text-5xl font-bold font-mono transition-colors duration-500 ${
                failed ? "text-[#ef4444]" : "text-[#10b981]"
              }`}
            >
              100%
            </span>
          </div>
          {failed && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-text-muted mt-3 max-w-md flex items-center gap-2 justify-center"
            >
              <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
              One tower failed. {towerPositions[failedTower].users} devices lost connectivity.
            </motion.p>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          {!failed ? (
            <button onClick={triggerFailure} className="sim-btn danger w-auto">
              <CloudLightning className="w-4 h-4 text-[#ef4444]" />
              Trigger Storm
            </button>
          ) : (
            <button onClick={reset} className="sim-btn success w-auto">
              Reset Network
            </button>
          )}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
