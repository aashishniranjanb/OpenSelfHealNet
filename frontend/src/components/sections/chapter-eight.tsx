"use client";

import { motion } from "framer-motion";
import { Brain, Activity, GitBranch, Shield, ArrowDown } from "lucide-react";
import { SectionWrapper, SectionHeading } from "@/components/ui/section-wrapper";
import { fadeInUp, staggerContainer, pipelineStep } from "@/lib/animation-config";

const pipeline = [
  {
    icon: <Activity className="w-6 h-6" />,
    title: "Monitor Node Health",
    description: "Continuously track status, latency, battery, load, and connectivity for every node in the network.",
    inputs: ["Node status", "Latency measurements", "Battery levels", "Traffic load"],
    color: "#10b981",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Analyze Traffic Patterns",
    description: "Identify congestion points, predict bottlenecks, and detect anomalies in real-time traffic flows.",
    inputs: ["Packet flow rates", "Queue depths", "Bandwidth utilization", "Error rates"],
    color: "#06b6d4",
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: "Compute Routing Decisions",
    description: "Run graph algorithms to find optimal alternative paths, considering latency, capacity, and reliability.",
    inputs: ["Network topology", "Edge weights", "Path constraints", "QoS requirements"],
    color: "#8b5cf6",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Execute Recovery Plan",
    description: "Automatically deploy mesh nodes, reroute traffic, adjust power levels, or request human intervention.",
    inputs: ["Deploy mesh node", "Reroute traffic", "Increase power", "Alert operator"],
    color: "#f59e0b",
  },
];

export function ChapterEight() {
  return (
    <SectionWrapper id="chapter-8" withGrid>
      <SectionHeading
        eyebrow="Chapter 8"
        title="AI Recovery Engine"
        subtitle="Not a chatbot — a decision support system that analyzes network state and recommends optimal recovery actions."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        {pipeline.map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <motion.div
              variants={pipelineStep}
              className="glass-card p-6 w-full"
              whileHover={{
                borderColor: step.color + "44",
                boxShadow: `0 0 20px ${step.color}15`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl shrink-0"
                  style={{ background: step.color + "15", color: step.color }}
                >
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3
                    className="font-semibold text-base mb-1"
                    style={{ color: step.color }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-3">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {step.inputs.map((input) => (
                      <span
                        key={input}
                        className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                        style={{
                          background: step.color + "10",
                          color: step.color,
                          border: `1px solid ${step.color}22`,
                        }}
                      >
                        {input}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Connector */}
            {i < pipeline.length - 1 && (
              <motion.div
                variants={pipelineStep}
                className="flex flex-col items-center py-2"
              >
                <div className="h-6 w-px bg-[rgba(255,255,255,0.1)]" />
                <ArrowDown className="w-4 h-4 text-text-muted" />
                <div className="h-6 w-px bg-[rgba(255,255,255,0.1)]" />
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Note */}
      <motion.div variants={fadeInUp} className="text-center mt-10">
        <div className="inline-block glass-card px-5 py-3">
          <p className="text-xs text-text-secondary">
            <span className="text-[#06b6d4] font-semibold">MVP:</span> Heuristic algorithms with explainable decisions
            <span className="text-text-muted mx-2">→</span>
            <span className="text-[#8b5cf6] font-semibold">Future:</span> Graph neural networks & reinforcement learning
          </p>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
