"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

// Animated network node
function NetworkDot({
  cx,
  cy,
  delay,
  size = 6,
}: {
  cx: number;
  cy: number;
  delay: number;
  size?: number;
}) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={size}
      fill="#10b981"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.4, 1, 0.4],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

// Animated edge with packet
function NetworkLine({
  x1,
  y1,
  x2,
  y2,
  delay,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}) {
  return (
    <g>
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="rgba(16, 185, 129, 0.2)"
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay }}
      />
      <motion.circle
        r={3}
        fill="#34d399"
        initial={{ opacity: 0 }}
        animate={{
          cx: [x1, x2],
          cy: [y1, y2],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: delay + 1.5,
          ease: "linear",
        }}
      />
    </g>
  );
}

// Network topology nodes and edges
const heroNodes = [
  { x: 200, y: 120 },
  { x: 400, y: 80 },
  { x: 600, y: 130 },
  { x: 800, y: 90 },
  { x: 150, y: 280 },
  { x: 350, y: 240 },
  { x: 550, y: 300 },
  { x: 750, y: 250 },
  { x: 950, y: 280 },
  { x: 100, y: 420 },
  { x: 300, y: 380 },
  { x: 500, y: 440 },
  { x: 700, y: 400 },
  { x: 900, y: 430 },
  { x: 250, y: 520 },
  { x: 500, y: 560 },
  { x: 750, y: 530 },
];

const heroEdges = [
  [0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 6], [3, 7],
  [4, 5], [5, 6], [6, 7], [7, 8], [4, 9], [5, 10], [6, 11],
  [7, 12], [8, 13], [9, 10], [10, 11], [11, 12], [12, 13],
  [10, 14], [11, 15], [12, 16], [14, 15], [15, 16],
  [0, 5], [3, 8], [9, 14],
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  const [typed, setTyped] = useState("");
  const subtitle =
    "Explore how communication networks work, fail, and recover using open-source technologies.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= subtitle.length) {
        setTyped(subtitle.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const scrollToStart = () => {
    document
      .getElementById("chapter-1")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ opacity }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Animated network SVG */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 1100 650"
          className="w-full h-full max-w-6xl opacity-40"
          preserveAspectRatio="xMidYMid meet"
        >
          {heroEdges.map(([from, to], i) => (
            <NetworkLine
              key={`edge-${i}`}
              x1={heroNodes[from].x}
              y1={heroNodes[from].y}
              x2={heroNodes[to].x}
              y2={heroNodes[to].y}
              delay={i * 0.08}
            />
          ))}
          {heroNodes.map((node, i) => (
            <NetworkDot
              key={`node-${i}`}
              cx={node.x}
              cy={node.y}
              delay={i * 0.15}
              size={i < 4 ? 8 : i < 9 ? 6 : 5}
            />
          ))}
        </svg>
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_70%)]" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl"
        style={{ y, scale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[rgba(16,185,129,0.1)] text-[#10b981] border border-[rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            Open Source Network Simulator
          </span>
        </motion.div>

        <motion.h1
          className="heading-xl mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Every Message Travels a{" "}
          <span className="bg-gradient-to-r from-[#10b981] to-[#06b6d4] bg-clip-text text-transparent">
            Hidden Journey
          </span>
        </motion.h1>

        <motion.p
          className="text-body max-w-2xl mx-auto mb-10 h-[3.4em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {typed}
          <span className="inline-block w-[2px] h-5 bg-[#10b981] ml-1 animate-pulse" />
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <button
            onClick={scrollToStart}
            className="btn-primary text-lg px-8 py-4"
          >
            Start the Simulation
          </button>
          <a
            href="https://github.com/aashishniranjanb/OpenSelfHealNet"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            View on GitHub
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2 cursor-pointer"
        onClick={scrollToStart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-xs text-text-muted tracking-wider uppercase">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-text-muted" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
