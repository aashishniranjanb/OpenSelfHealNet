import type { Transition, Variants } from "framer-motion";

// Standard transitions
export const transition: Record<string, Transition> = {
  fast: { duration: 0.2, ease: "easeOut" },
  base: { duration: 0.3, ease: "easeOut" },
  slow: { duration: 0.5, ease: "easeOut" },
  spring: { type: "spring", stiffness: 300, damping: 30 },
  springGentle: { type: "spring", stiffness: 200, damping: 25 },
  springBouncy: { type: "spring", stiffness: 400, damping: 20 },
};

// Fade in from bottom
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Fade in from left
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Fade in from right
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Scale in
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger with more delay
export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

// For chapter headings
export const headingReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// For pipeline steps
export const pipelineStep: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Path drawing animation
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.5, ease: "easeInOut" },
  },
};

// Glow animation
export const glowPulse: Variants = {
  idle: {
    boxShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
  },
  active: {
    boxShadow: [
      "0 0 10px rgba(16, 185, 129, 0.2)",
      "0 0 30px rgba(16, 185, 129, 0.5)",
      "0 0 10px rgba(16, 185, 129, 0.2)",
    ],
    transition: { duration: 2, repeat: Infinity },
  },
};
