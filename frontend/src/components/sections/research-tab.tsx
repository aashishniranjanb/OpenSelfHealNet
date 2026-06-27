"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink, Milestone, GitPullRequest } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface Citations {
  title: string;
  source: string;
  year: string;
  abstract: string;
  relevance: string;
  link: string;
}

const papers: Citations[] = [
  {
    title: "Graph Theory Applications in Resilient Communication Networks",
    source: "IEEE Communications Surveys & Tutorials",
    year: "2022",
    abstract: "This paper analyzes the mathematical foundations of network routing resiliency, focusing on Dijkstra-based link routing and shortest-path heuristics under single-node and multi-node failure models.",
    relevance: "Basis for Dijkstra and BFS pathfinding algorithms in the simulation engine.",
    link: "https://ieeexplore.ieee.org",
  },
  {
    title: "Self-Healing Ad-Hoc Mesh Routing Protocols: A Comparative Study",
    source: "ACM SIGCOMM Computer Communication Review",
    year: "2023",
    abstract: "Explores decentralized mesh structures and recovery tactics when primary cell towers suffer power station outages. Demonstrates portable mesh routing node deployments to re-establish emergency cellular service.",
    relevance: "Inspired the recovery simulation using dynamic mesh nodes.",
    link: "https://dl.acm.org",
  },
  {
    title: "OpenRAN: Principles, Architecture, and Standardization",
    source: "IEEE Wireless Communications",
    year: "2023",
    abstract: "Details standard specifications of disaggregating hardware RAN functions using Software Defined Radios (SDR) and open-source stacks.",
    relevance: "Inspired the design of the Telecom Stack Explorer highlighting srsRAN and GNU Radio.",
    link: "https://ieeexplore.ieee.org",
  },
];

export function ResearchTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto h-[calc(100vh-140px)] min-h-[500px] overflow-y-auto pr-1">
      {/* 1. Bibliography & Papers */}
      <div className="flex flex-col gap-3">
        <div className="text-xs text-text-muted uppercase tracking-wider font-mono flex items-center gap-1.5 mb-1">
          <BookOpen className="w-4 h-4 text-[#10b981]" />
          Citations & Academic Research
        </div>

        {papers.map((paper, idx) => (
          <GlassCard key={idx} className="p-4 border-white/5 bg-black/40 hover:border-white/10 transition-all flex flex-col gap-2">
            <div>
              <span className="text-[9px] text-[#10b981] font-mono font-bold tracking-wide">
                {paper.source} ({paper.year})
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5 leading-tight">{paper.title}</h3>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
              <span className="text-white/60 font-semibold">Abstract:</span> {paper.abstract}
            </p>
            <div className="text-[10px] text-text-muted mt-1 leading-normal">
              <span className="text-[#06b6d4] font-semibold">Simulation Relevance:</span> {paper.relevance}
            </div>
            <a
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#06b6d4] hover:text-[#22d3ee] flex items-center gap-1 mt-2 self-start"
            >
              <span>View Publication</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </GlassCard>
        ))}
      </div>

      {/* 2. Platform Roadmap & Contributor Specs */}
      <div className="flex flex-col gap-3">
        {/* Roadmap section */}
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Milestone className="w-4 h-4 text-[#06b6d4]" />
            Development Roadmap
          </h3>

          <div className="relative border-l border-white/10 ml-2 pl-4 flex flex-col gap-4">
            {[
              { phase: "Phase 1: Interactive Twin", desc: "Real-time state physics updates and path routing visualizations (Completed)." },
              { phase: "Phase 2: Graph Engine Extensions", desc: "Implementation of Dijkstra, BFS, A*, and Kruskal's MST (Completed)." },
              { phase: "Phase 3: Real-Time WebSockets", desc: "FastAPI NetworkX live backend syncing for heavy calculations." },
              { phase: "Phase 4: Contributor Plugins", desc: "Standard API schema for users to submit failure plugins." },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                {/* Dot */}
                <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${idx <= 1 ? "bg-[#10b981]" : "bg-white/10"}`} />
                <div className="text-xs font-bold text-white">{step.phase}</div>
                <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contributing specifications */}
        <div className="glass-card p-5 bg-emerald-950/10 border-emerald-500/10">
          <h3 className="text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <GitPullRequest className="w-4 h-4 text-[#10b981]" />
            Contribute to the Project
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            OpenSelfHealNet is an MIT-licensed community platform built for standard telecom mapping exploration.
          </p>
          <div className="flex flex-col gap-2 mt-3 text-[11px] text-text-secondary">
            <div className="flex items-start gap-2">
              <span className="text-[#10b981] font-bold">1.</span>
              <p>Fork the repository at <a href="https://github.com/aashishniranjanb/OpenSelfHealNet" className="text-[#10b981] hover:underline" target="_blank" rel="noopener noreferrer">github.com/aashishniranjanb/OpenSelfHealNet</a></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#10b981] font-bold">2.</span>
              <p>Implement a new routing algorithm or scenario trigger inside <code>graph-utils.ts</code></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#10b981] font-bold">3.</span>
              <p>Submit a Pull Request explaining your changes and linking the research publication.</p>
            </div>
          </div>
          <a
            href="https://github.com/aashishniranjanb/OpenSelfHealNet"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs inline-flex mt-4 items-center gap-1.5 w-full justify-center"
          >
            <GitPullRequest className="w-4 h-4" />
            Submit PR on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
