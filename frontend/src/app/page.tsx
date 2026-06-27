"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, BookOpen, Layers, Milestone, Radio, Laptop, ShieldCheck } from "lucide-react";
import { SimulationTab } from "@/components/sections/simulation-tab";
import { ExploreTab } from "@/components/sections/explore-tab";
import { LearnTab } from "@/components/sections/learn-tab";
import { ResearchTab } from "@/components/sections/research-tab";
import { Footer } from "@/components/sections/footer";

type TabId = "simulate" | "learn" | "explore" | "research";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("simulate");

  return (
    <main className="relative min-h-screen bg-[#050505] text-white flex flex-col justify-between">
      {/* 1. Header Banner */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20">
              <Radio className="w-5 h-5 text-[#10b981] animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-white via-white to-text-secondary bg-clip-text text-transparent flex items-center gap-1.5">
                OpenSelfHealNet
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 font-mono font-normal">
                  v2.0 Digital Twin
                </span>
              </h1>
              <p className="text-[10px] text-text-muted mt-0.5">Chennai Central Telecom Grid Simulation Model</p>
            </div>
          </div>

          {/* Tab Selection buttons */}
          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/5">
            {[
              { id: "simulate", label: "Simulate Twin", icon: <Activity className="w-4 h-4" /> },
              { id: "learn", label: "Learn Physics", icon: <BookOpen className="w-4 h-4" /> },
              { id: "explore", label: "Explore Stack", icon: <Layers className="w-4 h-4" /> },
              { id: "research", label: "Research", icon: <Milestone className="w-4 h-4" /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as TabId)}
                className={`flex items-center gap-2 text-xs px-3.5 py-2 rounded-lg font-medium transition-all ${
                  activeTab === t.id
                    ? "bg-[#10b981] text-black font-bold"
                    : "text-text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Main Tab View content */}
      <section className="max-w-7xl mx-auto px-6 py-6 w-full flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {activeTab === "simulate" && <SimulationTab />}
            {activeTab === "learn" && <LearnTab />}
            {activeTab === "explore" && <ExploreTab />}
            {activeTab === "research" && <ResearchTab />}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 3. Footer */}
      <Footer />
    </main>
  );
}
