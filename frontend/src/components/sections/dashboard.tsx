"use client";

import { motion } from "framer-motion";
import {
  Radio,
  Heart,
  WifiOff,
  Gauge,
  Clock,
  Users,
  Activity,
  Shield,
} from "lucide-react";
import { SectionWrapper, SectionHeading } from "@/components/ui/section-wrapper";
import { fadeInUp, staggerContainer } from "@/lib/animation-config";
import { StatCard } from "@/components/ui/stat-card";

export function Dashboard() {
  return (
    <SectionWrapper id="dashboard" withGrid>
      <SectionHeading
        eyebrow="Mission Control"
        title="Network Dashboard"
        subtitle="Real-time monitoring overview of the entire communication network."
      />

      {/* Stats grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10"
      >
        <StatCard
          label="Total Nodes"
          value={24}
          icon={<Radio className="w-5 h-5" />}
          color="cyan"
        />
        <StatCard
          label="Healthy"
          value={22}
          icon={<Heart className="w-5 h-5" />}
          color="green"
          trend="up"
        />
        <StatCard
          label="Offline"
          value={2}
          icon={<WifiOff className="w-5 h-5" />}
          color="red"
          trend="down"
        />
        <StatCard
          label="Coverage"
          value={87}
          suffix="%"
          icon={<Shield className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          label="Avg Latency"
          value={23}
          suffix="ms"
          icon={<Clock className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          label="Active Users"
          value={3246}
          icon={<Users className="w-5 h-5" />}
          color="cyan"
        />
        <StatCard
          label="Throughput"
          value={847}
          suffix=" Mbps"
          icon={<Activity className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          label="Uptime"
          value={99}
          suffix="%"
          icon={<Gauge className="w-5 h-5" />}
          color="green"
          trend="up"
        />
      </motion.div>

      {/* Animated chart area */}
      <motion.div
        variants={fadeInUp}
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Latency chart */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">
            Latency Over Time
          </h3>
          <svg viewBox="0 0 400 120" className="w-full">
            <defs>
              <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[30, 60, 90].map((y) => (
              <line
                key={y}
                x1={0}
                y1={y}
                x2={400}
                y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={1}
              />
            ))}
            {/* Area */}
            <motion.path
              d="M0,80 C50,75 80,60 120,55 C160,50 200,70 240,45 C280,30 320,50 360,40 C380,35 400,38 400,38 L400,120 L0,120 Z"
              fill="url(#latGrad)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
            {/* Line */}
            <motion.path
              d="M0,80 C50,75 80,60 120,55 C160,50 200,70 240,45 C280,30 320,50 360,40 C380,35 400,38 400,38"
              stroke="#10b981"
              strokeWidth={2}
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
            />
            {/* Labels */}
            <text x={5} y={115} fontSize={8} fill="#71717a">0h</text>
            <text x={195} y={115} fontSize={8} fill="#71717a">12h</text>
            <text x={385} y={115} fontSize={8} fill="#71717a">24h</text>
          </svg>
        </div>

        {/* Coverage chart */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">
            Coverage Distribution
          </h3>
          <svg viewBox="0 0 400 120" className="w-full">
            <defs>
              <linearGradient id="covGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[30, 60, 90].map((y) => (
              <line
                key={y}
                x1={0}
                y1={y}
                x2={400}
                y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={1}
              />
            ))}
            {/* Bars */}
            {[
              { x: 20, h: 85 },
              { x: 60, h: 92 },
              { x: 100, h: 78 },
              { x: 140, h: 95 },
              { x: 180, h: 88 },
              { x: 220, h: 70 },
              { x: 260, h: 82 },
              { x: 300, h: 90 },
              { x: 340, h: 75 },
              { x: 380, h: 87 },
            ].map((bar, i) => (
              <motion.rect
                key={i}
                x={bar.x}
                y={120 - bar.h}
                width={25}
                height={bar.h}
                rx={4}
                fill={bar.h > 85 ? "#10b981" : bar.h > 75 ? "#06b6d4" : "#f59e0b"}
                fillOpacity={0.4}
                initial={{ height: 0, y: 120 }}
                whileInView={{ height: bar.h, y: 120 - bar.h }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
            ))}
            <text x={5} y={115} fontSize={8} fill="#71717a">Zone 1</text>
            <text x={375} y={115} fontSize={8} fill="#71717a">Zone 10</text>
          </svg>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
