"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowLeft, Radio, Sparkles } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { ChapterOne } from "@/components/sections/chapter-one";
import { ChapterTwo } from "@/components/sections/chapter-two";
import { ChapterThree } from "@/components/sections/chapter-three";
import { ChapterFour } from "@/components/sections/chapter-four";
import { ChapterFive } from "@/components/sections/chapter-five";
import { ChapterSix } from "@/components/sections/chapter-six";
import { ChapterSeven } from "@/components/sections/chapter-seven";
import { ChapterEight } from "@/components/sections/chapter-eight";
import { ChapterNine } from "@/components/sections/chapter-nine";
import { Dashboard } from "@/components/sections/dashboard";
import { Footer } from "@/components/sections/footer";
import { Navigation } from "@/components/ui/navigation";
import { SimulationTab } from "@/components/sections/simulation-tab";

export default function Home() {
  const [viewMode, setViewMode] = useState<"story" | "v2-twin">("story");

  return (
    <main className="relative bg-[#050505] text-white min-h-screen flex flex-col justify-between">
      <AnimatePresence mode="wait">
        {viewMode === "story" ? (
          <motion.div
            key="story-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Floating Top Banner to trigger v2 */}
            <div className="fixed top-4 left-6 z-50 flex items-center gap-3">
              <button
                onClick={() => setViewMode("v2-twin")}
                className="btn-primary text-xs font-bold flex items-center gap-2 px-4 py-2.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-[#10b981]/40 backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-emerald-300 animate-spin-slow" />
                <span>Launch Full v2 Digital Twin Sandbox</span>
              </button>
            </div>

            <Navigation />
            <Hero />
            <ChapterOne />
            <ChapterTwo />
            <ChapterThree />
            <ChapterFour />
            <ChapterFive />
            <ChapterSix />
            <ChapterSeven />
            <ChapterEight />
            <ChapterNine />
            
            {/* CTA section before dashboard */}
            <section className="text-center py-12 flex flex-col items-center gap-4 border-t border-white/5 bg-black/40">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#10b981]" />
                Ready for Full Interactive Simulation Control?
              </h2>
              <p className="text-xs text-text-muted max-w-md leading-relaxed">
                Switch from storytelling mode to the full real-time digital twin sandbox with custom algorithm toggles, packet tracing, and scenario builders.
              </p>
              <button
                onClick={() => setViewMode("v2-twin")}
                className="btn-primary text-sm font-bold flex items-center gap-2 px-6 py-3 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open v2 Digital Twin Platform</span>
              </button>
            </section>

            <Dashboard />
            <Footer />
          </motion.div>
        ) : (
          <motion.div
            key="v2-twin-mode"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen"
          >
            {/* Header for v2 Standalone mode */}
            <header className="border-b border-white/5 bg-black/60 backdrop-blur-md px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("story")}
                  className="btn-secondary text-xs font-bold flex items-center gap-1.5 px-3 py-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Storytelling Mode</span>
                </button>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#10b981] animate-pulse" />
                  <span className="text-xs font-bold text-white">v2.0 Digital Twin Control Operations</span>
                </div>
              </div>
            </header>

            <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
              <SimulationTab />
            </div>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
