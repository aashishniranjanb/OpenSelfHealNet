"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Network, ExternalLink, Cpu, HardDrive, Wifi, Radio } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface StackLayer {
  id: string;
  name: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  projects: {
    name: string;
    icon: string;
    description: string;
    role: string;
    link: string;
  }[];
}

const stackLayers: StackLayer[] = [
  {
    id: "device",
    name: "1. User Devices (UE)",
    icon: <Radio className="w-5 h-5" />,
    tagline: "Cellphones, LoRa sensors, IoT terminals",
    description: "The end-user equipment seeking network signal to establish a connection. Operates over standard cellular (LTE/5G NR) or off-grid unlicensed frequencies.",
    projects: [
      {
        name: "Meshtastic Devices",
        icon: "📡",
        description: "ESP32 or nRF52 devices running open firmware to connect cellular-less clients.",
        role: "Off-grid last-mile client device nodes.",
        link: "https://meshtastic.org",
      },
    ],
  },
  {
    id: "ran",
    name: "2. Radio Access Network (RAN)",
    icon: <Wifi className="w-5 h-5" />,
    tagline: "Antennas, Base stations, SDR Transceivers",
    description: "The physical base-station towers that transmit electromagnetic radio waves, scheduling spectrum frequencies for user connections.",
    projects: [
      {
        name: "srsRAN",
        icon: "📻",
        description: "Open-source 4G/5G software radio suite for base stations.",
        role: "Runs on general purpose x86 CPUs with SDR RF frontends (USRPs) to create fully functional private cells.",
        link: "https://www.srsran.com",
      },
      {
        name: "OpenAirInterface (OAI)",
        icon: "🔬",
        description: "Research-grade 3GPP software-defined cell simulator.",
        role: "Provides full-stack standards-compliant physical and MAC-layer RAN components.",
        link: "https://openairinterface.org",
      },
    ],
  },
  {
    id: "backhaul",
    name: "3. Transport & Backhaul",
    icon: <Network className="w-5 h-5" />,
    tagline: "Fiber optic rings, microwave links, satellite relays",
    description: "The transport network carrying aggregated traffic from localized cell towers back to centralized switching nodes and cores.",
    projects: [
      {
        name: "GNU Radio Toolkit",
        icon: "🎚️",
        description: "Signal processing block architecture framework.",
        role: "Analyzes spectrum health, filters interference, and routes customized wireless microwave bridge waveforms.",
        link: "https://www.gnuradio.org",
      },
    ],
  },
  {
    id: "core",
    name: "4. Evolved Core Network",
    icon: <HardDrive className="w-5 h-5" />,
    tagline: "Centralized control plane, authentication, session managers",
    description: "The brain of the system. Validates user SIM credentials, sets billing policies, manages roaming profiles, and maps local users to the public Internet.",
    projects: [
      {
        name: "Open5GS",
        icon: "⚙️",
        description: "Complete C-language implementation of 5G Core and LTE EPC.",
        role: "Executes AMF, SMF, UPF, and HSS parameters to authorize devices and launch standard mobile data tunnels.",
        link: "https://open5gs.org",
      },
    ],
  },
  {
    id: "internet",
    name: "5. Gateway & Public Internet",
    icon: <GlobeIcon className="w-5 h-5" />,
    tagline: "Global data networks, CDNs, cloud infrastructure",
    description: "The target destination of user traffic. Once a packet clears authentication and core encapsulation tunnels, it traverses local gateways out to the World Wide Web.",
    projects: [
      {
        name: "FRRouting (FRR)",
        icon: "🛣️",
        description: "IP routing protocol suite for Unix platforms.",
        role: "Handles Border Gateway Protocol (BGP) and OSPF to distribute route metrics across public exchange routers.",
        link: "https://frrouting.org",
      },
    ],
  },
];

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function ExploreTab() {
  const [selectedLayerId, setSelectedLayerId] = useState<string>("ran");

  const currentLayer = stackLayers.find((l) => l.id === selectedLayerId) || stackLayers[1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 max-w-5xl mx-auto h-[calc(100vh-140px)] min-h-[500px]">
      {/* 1. Stack Layer Selector */}
      <div className="flex flex-col gap-3 justify-center">
        <div className="text-xs text-text-muted uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#10b981]" />
          Telecom Architecture Stack
        </div>

        {stackLayers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setSelectedLayerId(layer.id)}
            className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
              selectedLayerId === layer.id
                ? "border-[#10b981] bg-[#10b981]/10 text-white shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                : "border-white/5 bg-black/20 hover:border-white/10 text-text-muted"
            }`}
          >
            <div
              className={`p-2 rounded-xl ${selectedLayerId === layer.id ? "bg-[#10b981]/20 text-[#10b981]" : "bg-white/5"}`}
            >
              {layer.icon}
            </div>
            <div>
              <div className="text-xs font-bold">{layer.name}</div>
              <div className="text-[10px] text-text-muted mt-0.5 line-clamp-1">{layer.tagline}</div>
            </div>
          </button>
        ))}
      </div>

      {/* 2. Detail Explorer Panel */}
      <div className="flex flex-col gap-4 justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLayerId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full flex flex-col justify-center"
          >
            <GlassCard className="p-6 border-white/10 flex flex-col gap-4 bg-black/40">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#10b981] font-bold tracking-wide">
                  Layer Specifications
                </span>
                <h2 className="text-xl font-bold mt-1 text-white">{currentLayer.name}</h2>
                <p className="text-xs text-text-muted mt-0.5 italic">{currentLayer.tagline}</p>
                <p className="text-xs text-text-secondary leading-relaxed mt-3">{currentLayer.description}</p>
              </div>

              {/* Matching FOSS Projects */}
              <div className="mt-4 border-t border-white/5 pt-4">
                <span className="text-[10px] uppercase font-mono text-[#06b6d4] font-bold tracking-wide flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" />
                  Key Open Source Implementations
                </span>

                <div className="flex flex-col gap-3 mt-3">
                  {currentLayer.projects.map((proj) => (
                    <div
                      key={proj.name}
                      className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-0.5">{proj.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-white">{proj.name}</div>
                          <p className="text-[11px] text-text-secondary mt-0.5">{proj.description}</p>
                          <p className="text-[10px] text-text-muted mt-1 font-mono">
                            <span className="text-[#06b6d4]">Integration role:</span> {proj.role}
                          </p>
                        </div>
                      </div>

                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#06b6d4] hover:text-[#22d3ee] flex items-center gap-1 font-medium shrink-0 self-end sm:self-center"
                      >
                        <span>Inspect Code</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
