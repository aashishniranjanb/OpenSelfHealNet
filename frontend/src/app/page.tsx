"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, BookOpen, Layers, Milestone, Radio, HelpCircle, ArrowLeft } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { TutorialChapters } from "@/components/sections/tutorial-chapters";
import { SimulationTab } from "@/components/sections/simulation-tab";
import { ExploreTab } from "@/components/sections/explore-tab";
import { LearnTab } from "@/components/sections/learn-tab";
import { ResearchTab } from "@/components/sections/research-tab";
import { Footer } from "@/components/sections/footer";

type TabId = "simulate" | "learn" | "explore" | "research";
type ViewMode = "tutorial" | "simulator";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("tutorial");
  const [activeTab, setActiveTab] = useState<TabId>("simulate");

  const enterSimulator = () => {
    setViewMode("simulator");
  };

  const backToTutorial = () => {
    setViewMode("tutorial");
  };

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

          {/* Mode-specific actions */}
          <div className="flex items-center gap-3">
            {viewMode === "tutorial" ? (
              <button
                onClick={enterSimulator}
                className="btn-primary text-xs font-bold flex items-center gap-1.5 px-4 py-2"
              >
                <span>Skip to Simulator Sandbox</span>
                <Activity className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={backToTutorial}
                  className="btn-secondary text-xs font-bold flex items-center gap-1.5 px-3 py-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Story</span>
                </button>

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
            )}
          </div>
        </div>
      </header>

      {/* 2. Main content area depending on viewMode */}
      <section className="max-w-7xl mx-auto px-6 py-6 w-full flex-1">
        <AnimatePresence mode="wait">
          {viewMode === "tutorial" ? (
            <motion.div
              key="tutorial-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-12"
            >
              <Hero />
              <TutorialChapters onEnterSimulator={enterSimulator} />
            </motion.div>
          ) : (
            <motion.div
              key="simulator-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full"
            >
              {activeTab === "simulate" && <SimulationTab />}
              {activeTab === "learn" && <LearnTab />}
              {activeTab === "explore" && <ExploreTab />}
              {activeTab === "research" && <ResearchTab />}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 3. Footer */}
      <Footer />
    </main>
  );
}
