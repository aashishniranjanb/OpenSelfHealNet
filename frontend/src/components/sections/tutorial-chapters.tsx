"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Smartphone,
  Server,
  Globe,
  Wifi,
  ArrowRight,
  Shield,
  Zap,
  Activity,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface TutorialChaptersProps {
  onEnterSimulator: () => void;
}

export function TutorialChapters({ onEnterSimulator }: TutorialChaptersProps) {
  // Chapter 1: Message Journey state
  const [packetStep, setPacketStep] = useState(0);
  // Chapter 2: Tower blueprint
  const [activeComponent, setActiveComponent] = useState(0);
  // Chapter 3: Coverage failure
  const [stormActive, setStormActive] = useState(false);

  const towerComponents = [
    { title: "Antenna Array", desc: "Transmits and receives high-frequency radio waves to user devices." },
    { title: "Baseband Unit (BBU)", desc: "Processes signal codes, maps connections, and manages user queues." },
    { title: "Power Supply & Battery", desc: "Connects to grid station, with backup battery for power cuts." },
    { title: "Fiber Backhaul Link", desc: "Aggregates local user packets and pipes them back to telecom cores." }
  ];

  return (
    <div className="flex flex-col gap-24 max-w-4xl mx-auto py-12">
      {/* Chapter 1: Message Journey */}
      <section className="glass-card p-8 border-white/5 bg-black/30">
        <span className="text-[10px] uppercase font-mono text-[#10b981] font-bold tracking-widest">Chapter 1</span>
        <h2 className="text-xl font-bold mt-1 text-white">The Journey of a WhatsApp Message</h2>
        <p className="text-xs text-text-secondary leading-relaxed mt-2">
          Watch how a packet moves hop-by-hop from your device to the gateway.
        </p>

        {/* Animation canvas */}
        <div className="my-8 p-6 bg-black/40 rounded-2xl border border-white/5 flex flex-col items-center justify-between gap-6 relative">
          <div className="flex items-center justify-between w-full max-w-lg relative">
            {/* Edge line background */}
            <div className="absolute left-[20px] right-[20px] top-[20px] h-0.5 bg-white/10 z-0" />
            
            {/* Edge active line */}
            <div 
              className="absolute left-[20px] top-[20px] h-0.5 bg-[#10b981] z-0 transition-all duration-500"
              style={{ width: `${(packetStep / 3) * 100}%` }}
            />

            {[
              { id: 0, label: "Phone", icon: <Smartphone className="w-5 h-5" /> },
              { id: 1, label: "Tower", icon: <Radio className="w-5 h-5" /> },
              { id: 2, label: "Core", icon: <Server className="w-5 h-5" /> },
              { id: 3, label: "Gateway", icon: <Globe className="w-5 h-5" /> }
            ].map((node) => (
              <div key={node.id} className="flex flex-col items-center gap-1.5 relative z-10">
                <div 
                  className={`p-2.5 rounded-xl border transition-all ${
                    packetStep >= node.id 
                      ? "border-[#10b981] bg-[#10b981]/15 text-white" 
                      : "border-white/5 bg-black text-text-muted"
                  }`}
                >
                  {node.icon}
                </div>
                <span className="text-[10px] font-bold">{node.label}</span>
              </div>
            ))}
          </div>

          <div className="text-xs text-text-secondary text-center h-8 font-mono">
            {packetStep === 0 && "📱 Message sent: RF modulated waves broadcast from phone antenna."}
            {packetStep === 1 && "📡 Tower captures signal: Converts wave frames to fiber packet inputs."}
            {packetStep === 2 && "🏢 Telecom Core authorized: Validates SIM and routes backhaul tunnels."}
            {packetStep === 3 && "🌐 Gateway cleared: Packet leaves exchange out to public cloud servers."}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setPacketStep((p) => Math.max(p - 1, 0))}
              disabled={packetStep === 0}
              className="px-3 py-1 rounded-lg border border-white/5 text-xs hover:border-white/10 disabled:opacity-40"
            >
              Back
            </button>
            <button 
              onClick={() => setPacketStep((p) => Math.min(p + 1, 3))}
              disabled={packetStep === 3}
              className="px-3 py-1 rounded-lg bg-[#10b981] text-black text-xs font-bold disabled:opacity-40"
            >
              Forward
            </button>
          </div>
        </div>
      </section>

      {/* Chapter 2: Tower Blueprint */}
      <section className="glass-card p-8 border-white/5 bg-black/30">
        <span className="text-[10px] uppercase font-mono text-[#06b6d4] font-bold tracking-widest">Chapter 2</span>
        <h2 className="text-xl font-bold mt-1 text-white">Inside a Cell Tower</h2>
        <p className="text-xs text-text-secondary leading-relaxed mt-2">
          Hover or click on the components to inspect their architectural role.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-center">
          {/* Blueprint SVG */}
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex justify-center">
            <svg viewBox="0 0 200 240" className="w-full max-w-[150px]">
              {/* Mast line */}
              <line x1="100" y1="40" x2="100" y2="220" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <line x1="80" y1="220" x2="120" y2="220" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              
              {/* Antenna Array */}
              <circle cx="100" cy="50" r="15" fill={activeComponent === 0 ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)"} stroke={activeComponent === 0 ? "#10b981" : "rgba(255,255,255,0.15)"} className="cursor-pointer" onClick={() => setActiveComponent(0)} />
              <text x="100" y="54" textAnchor="middle" fontSize="10" fill="white">📡</text>

              {/* BBU */}
              <rect x="70" y="90" width="60" height="25" rx="4" fill={activeComponent === 1 ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.05)"} stroke={activeComponent === 1 ? "#06b6d4" : "rgba(255,255,255,0.15)"} className="cursor-pointer" onClick={() => setActiveComponent(1)} />
              <text x="100" y="106" textAnchor="middle" fontSize="10" fill="white">⚙️</text>

              {/* Battery */}
              <rect x="75" y="140" width="50" height="25" rx="4" fill={activeComponent === 2 ? "rgba(234,179,8,0.2)" : "rgba(255,255,255,0.05)"} stroke={activeComponent === 2 ? "#eab308" : "rgba(255,255,255,0.15)"} className="cursor-pointer" onClick={() => setActiveComponent(2)} />
              <text x="100" y="156" textAnchor="middle" fontSize="10" fill="white">🔋</text>

              {/* Fiber backhaul */}
              <path d="M 100 165 Q 150 200 100 230" fill="none" stroke={activeComponent === 3 ? "#8b5cf6" : "rgba(255,255,255,0.15)"} strokeWidth="3" className="cursor-pointer" onClick={() => setActiveComponent(3)} />
              <text x="135" y="200" textAnchor="middle" fontSize="10" fill="white">🔌</text>
            </svg>
          </div>

          <div className="flex flex-col gap-3">
            {towerComponents.map((comp, idx) => (
              <button
                key={idx}
                onClick={() => setActiveComponent(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeComponent === idx
                    ? "border-[#06b6d4] bg-[#06b6d4]/10 text-white"
                    : "border-white/5 bg-black/20 text-text-muted"
                }`}
              >
                <div className="text-xs font-bold">{comp.title}</div>
                <div className="text-[10px] text-text-secondary mt-0.5">{comp.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 3: Wireless Attenuation & Disasters */}
      <section className="glass-card p-8 border-white/5 bg-black/30">
        <span className="text-[10px] uppercase font-mono text-[#ef4444] font-bold tracking-widest">Chapter 3</span>
        <h2 className="text-xl font-bold mt-1 text-white">How Networks Fail</h2>
        <p className="text-xs text-text-secondary leading-relaxed mt-2">
          Under severe weather or storms, radio signals attenuate, shrinking tower coverage.
        </p>

        <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Signal circle overlay representation */}
          <div className="p-6 bg-black/40 rounded-2xl border border-white/5 flex flex-col items-center relative h-[200px] justify-center overflow-hidden">
            <div 
              className="absolute rounded-full border border-dashed transition-all duration-700"
              style={{
                width: stormActive ? 100 : 220,
                height: stormActive ? 100 : 220,
                borderColor: stormActive ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.3)",
                background: stormActive ? "rgba(239,68,68,0.05)" : "rgba(16,185,129,0.02)",
              }}
            />
            <Radio className={`w-8 h-8 z-10 ${stormActive ? "text-[#ef4444] animate-bounce" : "text-[#10b981] animate-pulse"}`} />
            <span className="text-[9px] font-mono mt-2 z-10">
              {stormActive ? "⚠️ Signal Attenuated (Radius: 50m)" : "🟢 Signal Normal (Radius: 180m)"}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs text-text-secondary leading-relaxed">
              When a cell tower goes offline or has its coverage radius reduced, nearby mobile devices lose their data link. If they can find neighboring towers, they will all migrate to them.
            </p>
            <button
              onClick={() => setStormActive(!stormActive)}
              className={`py-2 px-4 rounded-xl border font-bold text-xs transition-all ${
                stormActive 
                  ? "bg-[#ef4444]/20 border-[#ef4444] text-[#ef4444]" 
                  : "bg-white/5 border-white/10 text-white"
              }`}
            >
              {stormActive ? "⚠️ Clear Weather" : "⛈️ Trigger Storm"}
            </button>
          </div>
        </div>
      </section>

      {/* Chapter 4: Self-Healing & Open Source Ecosystem */}
      <section className="glass-card p-8 border-white/5 bg-black/30">
        <span className="text-[10px] uppercase font-mono text-purple-400 font-bold tracking-widest">Chapter 4</span>
        <h2 className="text-xl font-bold mt-1 text-white">Self-Healing Loops</h2>
        <p className="text-xs text-text-secondary leading-relaxed mt-2">
          Modern networks deploy portable mesh nodes, emergency LTE drones, and run pathfinding (Dijkstra) to self-heal.
        </p>

        <div className="my-8 p-5 bg-purple-950/10 rounded-2xl border border-purple-500/10 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Self-Healing Loop Steps</h3>
          </div>
          <ol className="list-decimal list-inside text-xs text-text-secondary leading-relaxed flex flex-col gap-2">
            <li><span className="text-white font-semibold">Monitor:</span> Continuously track signal strength and node battery status.</li>
            <li><span className="text-white font-semibold">Detect Outage:</span> Flag disconnected fiber links or unpowered cell nodes.</li>
            <li><span className="text-white font-semibold">Analyze & Route:</span> Run Dijkstra to bypass offline sections and calculate alternative routing paths.</li>
            <li><span className="text-white font-semibold">Execute:</span> Deploy temporary wireless backup mesh routers or hover emergency drones.</li>
          </ol>
        </div>
      </section>

      {/* Bottom Call to Action (Enter Simulator Sandbox) */}
      <section className="text-center py-6 flex flex-col items-center gap-4 border-t border-white/5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-[#10b981]" />
            Tutorial Completed
          </h2>
          <p className="text-xs text-text-muted mt-1">Ready to test these concepts in a live city grid simulator?</p>
        </div>
        <button 
          onClick={onEnterSimulator}
          className="btn-primary text-sm font-bold flex items-center gap-2 px-6 py-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <span>Enter Digital Twin Simulator Platform</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
