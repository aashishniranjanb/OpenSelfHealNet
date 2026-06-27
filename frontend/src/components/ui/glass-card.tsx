"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeInUp } from "@/lib/animation-config";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "green" | "cyan" | "red" | "amber";
  onClick?: () => void;
  hoverable?: boolean;
}

const glowMap = {
  green: "hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]",
  cyan: "hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]",
  red: "hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]",
  amber: "hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]",
};

export function GlassCard({
  children,
  className = "",
  glowColor = "green",
  onClick,
  hoverable = true,
}: GlassCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`glass-card p-6 ${hoverable ? glowMap[glowColor] : ""} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
      whileHover={hoverable ? { y: -4, transition: { duration: 0.2 } } : undefined}
    >
      {children}
    </motion.div>
  );
}
