"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Wifi, ShieldAlert, Cpu } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface LessonSlide {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: string[];
  visualExample: React.ReactNode;
}

const lessons: LessonSlide[] = [
  {
    id: 1,
    title: "1. The Path of a Data Packet",
    subtitle: "How messages travel from user phone to public cloud servers.",
    icon: <Cpu className="w-5 h-5 text-[#10b981]" />,
    content: [
      "Your phone modulates binary data onto electromagnetic radio frequencies (RF) waves.",
      "The local Cell Tower (RAN) captures the radio waves and forwards the frame via Fiber backhaul.",
      "Edge routers direct the traffic into the central Core network switching system.",
      "The Core verifies your subscription, decrypts the packet, and routes it out via the Internet Gateway."
    ],
    visualExample: (
      <div className="flex flex-col gap-2 p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-[10px]">
        <div className="flex items-center justify-between text-[#10b981]">
          <span>📱 UE Phone</span>
          <ArrowRight className="w-3.5 h-3.5" />
          <span>📡 Base Tower</span>
        </div>
        <div className="text-text-muted text-center py-1">RF Modulated Wireless Link</div>
        <div className="flex items-center justify-between text-[#06b6d4]">
          <span>📡 Base Tower</span>
          <ArrowRight className="w-3.5 h-3.5" />
          <span>🏢 Telecom Core</span>
        </div>
        <div className="text-text-muted text-center py-1">High-Speed Fiber Backhaul Ring</div>
        <div className="flex items-center justify-between text-purple-400">
          <span>🏢 Telecom Core</span>
          <ArrowRight className="w-3.5 h-3.5" />
          <span>🌐 Internet Gateway</span>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "2. Radio Frequency & Signal Attenuation",
    subtitle: "Understanding cellular range boundaries and spectrum limits.",
    icon: <Wifi className="w-5 h-5 text-[#06b6d4]" />,
    content: [
      "Cell towers broadcast radio waves in specific frequency bands (e.g., 700MHz, 2.1GHz, 3.5GHz).",
      "Higher frequencies carry more bandwidth/speed but suffer rapid signal decay (attenuation).",
      "Buildings, foliage, and weather factors (heavy rain, snow) block high-frequency waves.",
      "When signal decay occurs, devices drop to lower frequency backups, increasing connection latency."
    ],
    visualExample: (
      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#ef4444]">High Freq (3.5 GHz)</span>
          <span className="text-text-muted">Short Range / High Attenuation</span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#ef4444] to-[#ef4444]/10 rounded-full w-[40%]" />
        </div>
        <div className="flex items-center justify-between text-xs font-mono mt-2">
          <span className="text-[#10b981]">Low Freq (700 MHz)</span>
          <span className="text-text-muted">Long Range / Low Attenuation</span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#10b981] to-[#10b981]/10 rounded-full w-[90%]" />
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "3. Cascading Network Failure Loops",
    subtitle: "Why a single node outage can trigger system-wide overload.",
    icon: <ShieldAlert className="w-5 h-5 text-[#ef4444]" />,
    content: [
      "If Tower A goes offline (due to power outage or storm), its connected users immediately disconnect.",
      "Devices search for signal and connect to neighboring Tower B, driving B's load past capacity.",
      "Overloaded Tower B queues up packets, causing extreme latency spikes and connection timeouts.",
      "Tower B eventually crashes under congestion, forcing users to Tower C and cascading the collapse."
    ],
    visualExample: (
      <div className="flex flex-col gap-2 p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-[10px]">
        <div className="flex justify-between items-center bg-red-950/20 p-2 rounded-lg border border-red-500/20 text-[#ef4444]">
          <span>Tower A Offline</span>
          <span>💥 Power Outage</span>
        </div>
        <div className="text-center text-text-muted">⚡ Traffic migrates to Tower B</div>
        <div className="flex justify-between items-center bg-amber-950/20 p-2 rounded-lg border border-amber-500/20 text-[#f59e0b]">
          <span>Tower B Load: 120%</span>
          <span>⚠️ Congested Link</span>
        </div>
        <div className="text-center text-text-muted">⚡ Latency spikes (35ms → 180ms)</div>
      </div>
    )
  }
];

export function LearnTab() {
  const [slideIndex, setSlideIndex] = useState(0);
  const currentSlide = lessons[slideIndex];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] min-h-[500px] flex flex-col justify-center gap-6">
      {/* 1. Progress Indicator */}
      <div className="flex items-center justify-between px-4">
        <span className="text-xs text-text-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#10b981]" />
          Lesson Chapters ({slideIndex + 1}/{lessons.length})
        </span>
        <div className="flex gap-1">
          {lessons.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-8 rounded-full transition-all ${
                slideIndex === idx ? "bg-[#10b981]" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. Interactive Slides container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slideIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <GlassCard className="p-6 md:p-8 border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-black/40">
            {/* Slide explanation text */}
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {currentSlide.icon}
                  <h2 className="text-xl font-bold text-white">{currentSlide.title}</h2>
                </div>
                <p className="text-xs text-text-secondary mt-1">{currentSlide.subtitle}</p>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                {currentSlide.content.map((point, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs text-text-muted">
                    <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide visual demo diagram */}
            <div className="flex flex-col justify-center h-full">
              <span className="text-[9px] uppercase font-mono text-text-muted tracking-wider mb-2 block">
                Interactive Visual Architecture
              </span>
              {currentSlide.visualExample}
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* 3. Navigation Controls */}
      <div className="flex items-center justify-between px-4">
        <button
          onClick={() => setSlideIndex((prev) => Math.max(prev - 1, 0))}
          disabled={slideIndex === 0}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border border-white/5 hover:border-white/10 text-text-secondary disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <button
          onClick={() => setSlideIndex((prev) => Math.min(prev + 1, lessons.length - 1))}
          disabled={slideIndex === lessons.length - 1}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-black disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
