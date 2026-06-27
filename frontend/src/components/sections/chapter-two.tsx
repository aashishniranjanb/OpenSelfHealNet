"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { SectionWrapper, SectionHeading } from "@/components/ui/section-wrapper";
import { fadeInUp, staggerContainer } from "@/lib/animation-config";

const layers = [
  {
    id: "antenna",
    label: "Antenna Array",
    icon: "📶",
    color: "#10b981",
    description:
      "Transmits and receives radio signals. Modern towers use MIMO (Multiple-Input Multiple-Output) with multiple antenna elements to serve more users simultaneously.",
    detail: "Frequency: 700MHz–3.5GHz • Range: up to 45km",
  },
  {
    id: "radio",
    label: "Radio Unit (RU)",
    icon: "📻",
    color: "#06b6d4",
    description:
      "Converts radio waves to digital signals and vice versa. Handles signal amplification, filtering, and analog-to-digital conversion.",
    detail: "Processes up to 400MHz bandwidth • Low-noise amplifier",
  },
  {
    id: "baseband",
    label: "Baseband Unit (BBU)",
    icon: "🖥️",
    color: "#8b5cf6",
    description:
      "The brain of the tower. Handles digital signal processing, encoding/decoding, scheduling, and user management.",
    detail: "Runs scheduling algorithms • Manages 500+ simultaneous connections",
  },
  {
    id: "transport",
    label: "Transport / Backhaul",
    icon: "🔗",
    color: "#f59e0b",
    description:
      "Connects the tower to the wider network. Usually fiber optic, but can be microwave or satellite in remote areas.",
    detail: "Fiber: 10–100 Gbps • Microwave: 1–10 Gbps",
  },
  {
    id: "core",
    label: "Core Network Connection",
    icon: "🌐",
    color: "#ec4899",
    description:
      "Links to the operator's core network for authentication, routing, billing, and connection to the global internet.",
    detail: "Handles mobility management • IP routing • QoS enforcement",
  },
];

export function ChapterTwo() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  return (
    <SectionWrapper id="chapter-2" withGrid>
      <SectionHeading
        eyebrow="Chapter 2"
        title="Inside a Cellular Tower"
        subtitle="Every cell tower is a complex system with multiple layers. Hover over each component to understand what it does."
      />

      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto"
      >
        {/* Tower visualization */}
        <div className="relative flex justify-center">
          <svg
            viewBox="0 0 300 500"
            className="w-full max-w-[280px]"
            fill="none"
          >
            {/* Tower structure */}
            <motion.path
              d="M150 30 L120 470 M150 30 L180 470 M120 470 L180 470"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
            {/* Cross beams */}
            {[100, 180, 260, 340, 420].map((y, i) => (
              <motion.line
                key={i}
                x1={150 - (y - 30) * 0.068}
                y1={y}
                x2={150 + (y - 30) * 0.068}
                y2={y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1.5}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              />
            ))}
            {/* Layer indicators */}
            {layers.map((layer, i) => {
              const y = 60 + i * 95;
              const isActive = activeLayer === layer.id;
              return (
                <g key={layer.id}>
                  <motion.circle
                    cx={150}
                    cy={y}
                    r={isActive ? 18 : 14}
                    fill={isActive ? layer.color + "33" : "rgba(255,255,255,0.05)"}
                    stroke={isActive ? layer.color : "rgba(255,255,255,0.15)"}
                    strokeWidth={isActive ? 2 : 1}
                    animate={
                      isActive
                        ? {
                            r: [18, 22, 18],
                            strokeOpacity: [1, 0.5, 1],
                          }
                        : {}
                    }
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setActiveLayer(layer.id)}
                    onMouseLeave={() => setActiveLayer(null)}
                  />
                  {isActive && (
                    <motion.circle
                      cx={150}
                      cy={y}
                      r={30}
                      fill="transparent"
                      stroke={layer.color}
                      strokeWidth={1}
                      initial={{ r: 18, opacity: 0.6 }}
                      animate={{ r: 40, opacity: 0 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                    />
                  )}
                  <text
                    x={150}
                    y={y + 5}
                    textAnchor="middle"
                    fontSize={14}
                    className="pointer-events-none"
                  >
                    {layer.icon}
                  </text>
                </g>
              );
            })}
            {/* Signal waves from antenna */}
            {[1, 2, 3].map((i) => (
              <motion.path
                key={`wave-${i}`}
                d={`M${115 - i * 20} ${40 + i * 5} Q150 ${20 - i * 5} ${185 + i * 20} ${40 + i * 5}`}
                stroke="#10b981"
                strokeWidth={1}
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </svg>
        </div>

        {/* Layer details */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-3"
        >
          {layers.map((layer) => (
            <motion.div
              key={layer.id}
              variants={fadeInUp}
              className={`glass-card p-4 cursor-pointer transition-all duration-300 ${
                activeLayer === layer.id
                  ? "border-[1px]"
                  : ""
              }`}
              style={
                activeLayer === layer.id
                  ? { borderColor: layer.color + "66", boxShadow: `0 0 20px ${layer.color}22` }
                  : {}
              }
              onMouseEnter={() => setActiveLayer(layer.id)}
              onMouseLeave={() => setActiveLayer(null)}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{layer.icon}</span>
                <h3
                  className="font-semibold text-sm"
                  style={
                    activeLayer === layer.id
                      ? { color: layer.color }
                      : {}
                  }
                >
                  {layer.label}
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {layer.description}
              </p>
              {activeLayer === layer.id && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-xs text-text-muted mt-2 font-mono"
                >
                  {layer.detail}
                </motion.p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
