"use client";

import { motion } from "framer-motion";
import { SectionWrapper, SectionHeading } from "@/components/ui/section-wrapper";
import { fadeInUp, staggerContainer } from "@/lib/animation-config";

const timeline = [
  { year: "1837", label: "Telegraph", icon: "⚡", desc: "First electrical long-distance communication" },
  { year: "1876", label: "Telephone", icon: "☎️", desc: "Voice over wire" },
  { year: "1991", label: "2G / GSM", icon: "📱", desc: "First digital cellular networks" },
  { year: "2001", label: "3G / UMTS", icon: "📶", desc: "Mobile internet begins" },
  { year: "2009", label: "4G / LTE", icon: "🌐", desc: "High-speed mobile broadband" },
  { year: "2020", label: "5G / NR", icon: "🚀", desc: "Ultra-low latency, massive IoT" },
  { year: "2023", label: "Open RAN", icon: "🔓", desc: "Disaggregated, vendor-neutral architecture" },
  { year: "2025", label: "AI Networks", icon: "🧠", desc: "Self-optimizing, autonomous operations" },
  { year: "2030+", label: "6G", icon: "✨", desc: "Sensing, computing, and communication converge" },
];

const futureFeatures = [
  { label: "Live SDR Spectrum", desc: "Real-time software-defined radio visualization", icon: "📻" },
  { label: "Drone Base Stations", desc: "Aerial coverage for disaster recovery", icon: "🛸" },
  { label: "5G Network Slicing", desc: "Visualize virtual network partitioning", icon: "🔪" },
  { label: "Digital Twin Cities", desc: "Multi-city network simulation", icon: "🏙️" },
  { label: "Traffic Forecasting", desc: "ML-based demand prediction", icon: "📈" },
  { label: "Anomaly Detection", desc: "Real-time network threat identification", icon: "🔍" },
];

export function ChapterNine() {
  return (
    <SectionWrapper id="chapter-9">
      <SectionHeading
        eyebrow="Chapter 9"
        title="The Future of Networking"
        subtitle="From telegraph to autonomous self-healing networks — and what comes next."
      />

      {/* Timeline */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-20"
      >
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[rgba(16,185,129,0.3)] to-transparent" />

          {timeline.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={item.year}
                variants={fadeInUp}
                className={`relative flex items-center gap-6 mb-8 ${
                  isLeft ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${isLeft ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block glass-card p-4 ${
                      isLeft ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1" style={{ justifyContent: isLeft ? "flex-end" : "flex-start" }}>
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-bold text-[#10b981]">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary">{item.desc}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="relative z-10 shrink-0">
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2"
                    style={{
                      background: i >= 7 ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)",
                      borderColor: i >= 7 ? "#10b981" : "rgba(255,255,255,0.15)",
                      color: i >= 7 ? "#10b981" : "#a1a1aa",
                    }}
                    whileHover={{ scale: 1.2, borderColor: "#10b981" }}
                  >
                    {item.year.slice(-2)}
                  </motion.div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Future Features */}
      <motion.div variants={fadeInUp} className="max-w-4xl mx-auto">
        <h3 className="heading-md text-center mb-8">What&apos;s Coming</h3>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {futureFeatures.map((feat) => (
            <motion.div
              key={feat.label}
              variants={fadeInUp}
              className="glass-card p-5 text-center"
              whileHover={{
                borderColor: "rgba(16,185,129,0.3)",
                boxShadow: "0 0 20px rgba(16,185,129,0.1)",
              }}
            >
              <span className="text-2xl block mb-2">{feat.icon}</span>
              <h4 className="text-sm font-semibold mb-1">{feat.label}</h4>
              <p className="text-xs text-text-secondary">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
