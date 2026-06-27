"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Send, Check } from "lucide-react";
import { SectionWrapper, SectionHeading } from "@/components/ui/section-wrapper";
import { fadeInUp } from "@/lib/animation-config";

const hops = [
  { label: "Your Phone", emoji: "📱", color: "#10b981", desc: "Message created and encrypted" },
  { label: "Cell Tower", emoji: "📡", color: "#06b6d4", desc: "Radio signal received by nearest tower" },
  { label: "Regional Router", emoji: "🔀", color: "#8b5cf6", desc: "Routed through regional infrastructure" },
  { label: "Core Network", emoji: "🏢", color: "#f59e0b", desc: "Processed by carrier core network" },
  { label: "Internet Gateway", emoji: "🌐", color: "#ec4899", desc: "Crosses into the global internet" },
  { label: "Destination Core", emoji: "🏢", color: "#f59e0b", desc: "Arrives at recipient's carrier" },
  { label: "Cell Tower", emoji: "📡", color: "#06b6d4", desc: "Transmitted to recipient's tower" },
  { label: "Recipient Phone", emoji: "📱", color: "#10b981", desc: "Message delivered and decrypted" },
];

export function ChapterOne() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [activeHop, setActiveHop] = useState(-1);
  const [delivered, setDelivered] = useState(false);
  const [latency, setLatency] = useState(0);

  const sendMessage = () => {
    if (!message.trim() || sending) return;
    setSending(true);
    setDelivered(false);
    setActiveHop(-1);
    setLatency(0);

    let hop = 0;
    const interval = setInterval(() => {
      if (hop < hops.length) {
        setActiveHop(hop);
        setLatency((prev) => prev + Math.floor(3 + Math.random() * 8));
        hop++;
      } else {
        clearInterval(interval);
        setDelivered(true);
        setSending(false);
      }
    }, 600);
  };

  return (
    <SectionWrapper id="chapter-1">
      <SectionHeading
        eyebrow="Chapter 1"
        title="How Does a Message Travel?"
        subtitle="Type a message and watch it traverse the entire communication network — from your phone to the recipient."
      />

      {/* Message input */}
      <motion.div
        variants={fadeInUp}
        className="max-w-md mx-auto mb-12"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder='Type "Hello" and press send...'
            className="flex-1 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-text-muted focus:outline-none focus:border-[#10b981] transition-colors"
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            disabled={sending || !message.trim()}
            className="btn-primary px-4 py-3 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Journey visualization */}
      <motion.div variants={fadeInUp} className="relative max-w-4xl mx-auto">
        <div className="flex flex-col gap-0 items-center">
          {hops.map((hop, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Node */}
              <motion.div
                className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all duration-300 w-full max-w-sm ${
                  activeHop === i
                    ? "bg-[rgba(255,255,255,0.08)] border-[rgba(255,255,255,0.2)]"
                    : activeHop > i
                    ? "bg-[rgba(16,185,129,0.05)] border-[rgba(16,185,129,0.2)]"
                    : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)]"
                }`}
                animate={
                  activeHop === i
                    ? { scale: [1, 1.03, 1], boxShadow: `0 0 25px ${hop.color}33` }
                    : {}
                }
                transition={{ duration: 0.4 }}
              >
                <span className="text-2xl">{hop.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{hop.label}</p>
                  <AnimatePresence>
                    {activeHop >= i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs text-text-secondary mt-0.5"
                      >
                        {hop.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                {activeHop > i && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-[rgba(16,185,129,0.2)] flex items-center justify-center"
                  >
                    <Check className="w-3.5 h-3.5 text-[#10b981]" />
                  </motion.div>
                )}
                {activeHop === i && (
                  <motion.div
                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full"
                    style={{ backgroundColor: hop.color }}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Connector */}
              {i < hops.length - 1 && (
                <div className="relative h-8 w-[2px]">
                  <div className="absolute inset-0 bg-[rgba(255,255,255,0.08)]" />
                  {activeHop >= i && activeHop <= i + 1 && (
                    <motion.div
                      className="absolute top-0 left-0 w-full bg-[#10b981]"
                      initial={{ height: "0%" }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  {activeHop > i + 1 && (
                    <div className="absolute inset-0 bg-[#10b981] opacity-50" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Delivery confirmation */}
        <AnimatePresence>
          {delivered && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)]">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <Check className="w-5 h-5 text-[#10b981]" />
                </motion.div>
                <span className="text-[#10b981] font-semibold">
                  Delivered in {latency}ms
                </span>
              </div>
              <p className="text-text-muted text-sm mt-3">
                &quot;{message}&quot; traveled through {hops.length} network hops
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Latency counter */}
        {sending && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-text-secondary text-sm">
              Latency: <span className="text-[#06b6d4] font-mono">{latency}ms</span>
            </span>
          </motion.div>
        )}
      </motion.div>
    </SectionWrapper>
  );
}
