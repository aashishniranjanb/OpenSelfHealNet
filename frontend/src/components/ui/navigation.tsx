"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const chapters = [
  { id: "hero", label: "Welcome" },
  { id: "chapter-1", label: "Message Journey" },
  { id: "chapter-2", label: "Inside a Tower" },
  { id: "chapter-3", label: "Failure" },
  { id: "chapter-4", label: "Cascading Failure" },
  { id: "chapter-5", label: "Self-Healing" },
  { id: "chapter-6", label: "Open Source" },
  { id: "chapter-7", label: "Digital Twin" },
  { id: "chapter-8", label: "AI Controller" },
  { id: "chapter-9", label: "The Future" },
  { id: "dashboard", label: "Dashboard" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3 }
    );

    for (const ch of chapters) {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      {chapters.map((ch, i) => (
        <div
          key={ch.id}
          className="flex items-center gap-3"
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <AnimatePresence>
            {hoveredIdx === i && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-xs font-medium text-text-secondary whitespace-nowrap"
              >
                {ch.label}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={() => scrollTo(ch.id)}
            className={`nav-dot ${activeSection === ch.id ? "active" : ""}`}
            aria-label={`Navigate to ${ch.label}`}
          />
        </div>
      ))}
    </motion.nav>
  );
}
