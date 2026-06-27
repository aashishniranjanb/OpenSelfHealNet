"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ExternalLink, ChevronRight } from "lucide-react";
import { SectionWrapper, SectionHeading } from "@/components/ui/section-wrapper";
import { fadeInUp, staggerContainer } from "@/lib/animation-config";

const projects = [
  {
    name: "Meshtastic",
    icon: "🟩",
    color: "#10b981",
    tagline: "Off-grid mesh communication",
    description:
      "An open-source mesh networking platform that uses LoRa radios for long-range, low-power communication without any cellular or internet infrastructure.",
    solves: "Communication when all infrastructure is down",
    fits: "Last-mile resilience layer — provides communication even without towers",
    link: "https://meshtastic.org",
    features: ["LoRa mesh networking", "No infrastructure required", "AES-256 encryption", "GPS tracking"],
  },
  {
    name: "GNU Radio",
    icon: "🟩",
    color: "#06b6d4",
    tagline: "Software-defined radio toolkit",
    description:
      "A free, open-source software development toolkit for signal processing. Allows building software radios using general-purpose hardware.",
    solves: "Flexible radio signal processing and prototyping",
    fits: "Research & development layer — experiment with radio protocols without dedicated hardware",
    link: "https://www.gnuradio.org",
    features: ["Signal processing", "Custom waveforms", "SDR support", "Python/C++ extensible"],
  },
  {
    name: "Open5GS",
    icon: "🟩",
    color: "#8b5cf6",
    tagline: "Open-source 5G core network",
    description:
      "A C-language implementation of the 5G Core and EPC (Evolved Packet Core). Provides the complete core network functions needed to run a private LTE/5G network.",
    solves: "Running private cellular networks without vendor lock-in",
    fits: "Core network layer — handles authentication, session management, and routing",
    link: "https://open5gs.org",
    features: ["5G SA/NSA support", "AMF/SMF/UPF", "Private LTE/5G", "Docker deployment"],
  },
  {
    name: "srsRAN",
    icon: "🟩",
    color: "#f59e0b",
    tagline: "Open-source radio access network",
    description:
      "A 4G/5G software radio suite. Includes a full-stack RAN implementation that can run on commercial off-the-shelf hardware with standard SDR frontends.",
    solves: "Building base stations with commodity hardware",
    fits: "Radio access layer — the software that runs on the tower",
    link: "https://www.srsran.com",
    features: ["4G/5G compatible", "COTS hardware", "Full UE & eNB", "Real-time processing"],
  },
  {
    name: "OpenAirInterface",
    icon: "🟩",
    color: "#ec4899",
    tagline: "Research-grade telecom platform",
    description:
      "A software alliance providing open-source implementations of 3GPP standards for LTE and 5G. Used by universities and research labs worldwide.",
    solves: "Academic research and standards-compliant prototyping",
    fits: "Research platform — test new algorithms and protocols in standards-compliant environments",
    link: "https://openairinterface.org",
    features: ["3GPP compliant", "Research platform", "Full stack", "Global community"],
  },
];

export function ChapterSix() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <SectionWrapper id="chapter-6">
      <SectionHeading
        eyebrow="Chapter 6"
        title="The Open Source Ecosystem"
        subtitle="Real open-source projects that make resilient communication infrastructure possible. Click any project to explore."
      />

      {/* Architecture overview */}
      <motion.div variants={fadeInUp} className="max-w-2xl mx-auto mb-12">
        <div className="flex flex-col items-center gap-0">
          {["📱 User Device", "📡 srsRAN", "🏢 Open5GS", "🌐 Internet", "📻 GNU Radio", "🔗 Meshtastic"].map(
            (label, i) => (
              <div key={i} className="flex flex-col items-center">
                <motion.div
                  className="px-5 py-2 rounded-xl text-sm font-medium glass-card"
                  whileHover={{ scale: 1.05 }}
                >
                  {label}
                </motion.div>
                {i < 5 && (
                  <div className="h-6 w-px bg-[rgba(255,255,255,0.1)]" />
                )}
              </div>
            )
          )}
        </div>
      </motion.div>

      {/* Project cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
      >
        {projects.map((project) => (
          <motion.div
            key={project.name}
            variants={fadeInUp}
            className="glass-card p-5 cursor-pointer transition-all duration-300 flex flex-col"
            style={
              expanded === project.name
                ? {
                    borderColor: project.color + "44",
                    boxShadow: `0 0 20px ${project.color}15`,
                  }
                : {}
            }
            onClick={() =>
              setExpanded(expanded === project.name ? null : project.name)
            }
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{project.icon}</span>
                <div>
                  <h3
                    className="font-semibold text-sm"
                    style={{ color: project.color }}
                  >
                    {project.name}
                  </h3>
                  <p className="text-xs text-text-muted">{project.tagline}</p>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-text-muted transition-transform ${
                  expanded === project.name ? "rotate-90" : ""
                }`}
              />
            </div>

            <p className="text-xs text-text-secondary leading-relaxed mb-3 flex-1">
              {project.description}
            </p>

            <AnimatePresence>
              {expanded === project.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-[rgba(255,255,255,0.06)] pt-3 mt-1"
                >
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-text-secondary mb-1">
                      Problem Solved
                    </p>
                    <p className="text-xs text-text-muted">{project.solves}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-text-secondary mb-1">
                      Where It Fits
                    </p>
                    <p className="text-xs text-text-muted">{project.fits}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.features.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-[rgba(255,255,255,0.08)] text-text-muted"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                    style={{ color: project.color }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Project <ExternalLink className="w-3 h-3" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
