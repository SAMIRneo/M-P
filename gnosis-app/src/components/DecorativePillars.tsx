"use client";

import { motion } from "framer-motion";

interface DecorativePillarsProps {
  position: "left" | "right";
}

export function DecorativePillars({ position }: DecorativePillarsProps) {
  const isLeft = position === "left";
  
  // Newspaper/Typography decorative elements
  const ornaments = ["❧", "☙", "✦", "◆", "✧", "❦"];
  const headlines = ["NEWS", "EXTRA", "FLASH", "SCOOP", "HOT"];
  
  return (
    <div 
      className={`fixed top-0 bottom-0 ${isLeft ? "left-0" : "right-0"} w-12 md:w-16 pointer-events-none z-[5] hidden lg:flex flex-col`}
    >
      {/* Vertical border line */}
      <div 
        className={`absolute top-0 bottom-0 ${isLeft ? "right-0" : "left-0"} w-[2px]`}
        style={{ background: "var(--ink-black)" }}
      />
      
      {/* Second thin line */}
      <div 
        className={`absolute top-0 bottom-0 ${isLeft ? "right-1" : "left-1"} w-[1px]`}
        style={{ background: "var(--ink-black)", opacity: 0.3 }}
      />

      {/* Top ornament */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-2xl text-ink-gray opacity-40">✦</span>
      </motion.div>

      {/* Vertical text */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          className="font-headline text-[10px] tracking-[0.4em] text-ink-gray opacity-30 uppercase"
          style={{ 
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: isLeft ? "rotate(180deg)" : "none",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.7 }}
        >
          {isLeft ? "GNOSIS ARCHIVES" : "KNOWLEDGE BASE"}
        </motion.div>
      </div>

      {/* Decorative dashes */}
      <div className={`absolute top-1/4 ${isLeft ? "right-3" : "left-3"} flex flex-col gap-2`}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-[2px]"
            style={{ background: "var(--ink-black)", opacity: 0.2 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          />
        ))}
      </div>

      {/* Middle ornament */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-lg text-ink-gray">❧</span>
      </motion.div>

      {/* Bottom decorative dashes */}
      <div className={`absolute bottom-1/4 ${isLeft ? "right-3" : "left-3"} flex flex-col gap-2`}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-[2px]"
            style={{ background: "var(--ink-black)", opacity: 0.2 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
          />
        ))}
      </div>

      {/* Bottom ornament */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-2xl text-ink-gray opacity-40">✦</span>
      </motion.div>

      {/* Page number style decoration */}
      <motion.div
        className={`absolute bottom-20 ${isLeft ? "right-2" : "left-2"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.2 }}
      >
        <span className="font-serif text-xs text-ink-gray italic">
          {isLeft ? "i" : "ii"}
        </span>
      </motion.div>
    </div>
  );
}
