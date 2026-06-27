"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeInUp, staggerContainer } from "@/lib/animation-config";

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
  withGrid?: boolean;
}

export function SectionWrapper({
  id,
  children,
  className = "",
  withGrid = false,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      className={`section-full ${withGrid ? "grid-bg" : ""} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <div className="section-content">{children}</div>
    </motion.section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div variants={fadeInUp} className="text-center mb-16 max-w-3xl mx-auto">
      {eyebrow && (
        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-accent-green mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="heading-lg mb-4">{title}</h2>
      {subtitle && <p className="text-body">{subtitle}</p>}
    </motion.div>
  );
}
