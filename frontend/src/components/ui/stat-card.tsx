"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { fadeInUp } from "@/lib/animation-config";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  color?: "green" | "cyan" | "red" | "amber" | "white";
  trend?: "up" | "down" | "neutral";
}

const colorMap = {
  green: "text-[#10b981]",
  cyan: "text-[#06b6d4]",
  red: "text-[#ef4444]",
  amber: "text-[#f59e0b]",
  white: "text-white",
};

const borderColorMap = {
  green: "border-[rgba(16,185,129,0.2)]",
  cyan: "border-[rgba(6,182,212,0.2)]",
  red: "border-[rgba(239,68,68,0.2)]",
  amber: "border-[rgba(245,158,11,0.2)]",
  white: "border-[rgba(255,255,255,0.08)]",
};

export function StatCard({
  label,
  value,
  suffix = "",
  icon,
  color = "white",
  trend,
}: StatCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [count, value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = `${v}${suffix}`;
      }
    });
    return () => unsubscribe();
  }, [rounded, suffix]);

  return (
    <motion.div
      variants={fadeInUp}
      className={`stat-card ${borderColorMap[color]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-secondary font-medium">{label}</span>
        <span className={`${colorMap[color]} opacity-70`}>{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span
          ref={displayRef}
          className={`text-3xl font-bold ${colorMap[color]}`}
        >
          0{suffix}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium pb-1 ${
              trend === "up"
                ? "text-[#10b981]"
                : trend === "down"
                ? "text-[#ef4444]"
                : "text-text-secondary"
            }`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "–"}
          </span>
        )}
      </div>
    </motion.div>
  );
}
