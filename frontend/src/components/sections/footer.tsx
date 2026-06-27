"use client";

import { motion } from "framer-motion";
import { ExternalLink, Heart } from "lucide-react";
import { fadeInUp } from "@/lib/animation-config";

export function Footer() {
  return (
    <motion.footer
      className="border-t border-[rgba(255,255,255,0.06)] py-16 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-lg font-bold mb-3">
              <span className="bg-gradient-to-r from-[#10b981] to-[#06b6d4] bg-clip-text text-transparent">
                OpenSelfHealNet
              </span>
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              An open-source interactive digital twin that visualizes how
              communication networks operate, fail, recover, and evolve.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-sm font-semibold mb-3 text-text-secondary">
              Resources
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: "GitHub Repository", href: "https://github.com/aashishniranjanb/OpenSelfHealNet" },
                { label: "Open5GS", href: "https://open5gs.org" },
                { label: "srsRAN", href: "https://www.srsran.com" },
                { label: "Meshtastic", href: "https://meshtastic.org" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-muted hover:text-[#10b981] transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contribute */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-sm font-semibold mb-3 text-text-secondary">
              Contribute
            </h4>
            <p className="text-sm text-text-muted mb-4">
              OpenSelfHealNet is MIT licensed. Contributions, ideas, and feedback
              are welcome.
            </p>
            <a
              href="https://github.com/aashishniranjanb/OpenSelfHealNet"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
              Star on GitHub
            </a>
          </motion.div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} OpenSelfHealNet. MIT License.
          </p>
          <p className="text-xs text-text-muted flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-[#ef4444]" /> for the FOSS community
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
