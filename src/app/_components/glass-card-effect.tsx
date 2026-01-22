"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function GlassCardEffect({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);

  return (
    <motion.div
      ref={cardRef}
      style={{
        y,
        opacity,
      }}
      className="relative"
    >
      <div className="relative bg-dark-card/40 backdrop-blur-xl border border-primary-500/20 rounded-2xl p-8 shadow-2xl hover:border-primary-500/40 transition-all duration-500">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-primary-500/5 rounded-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(0,200,150,0.1)_50%,transparent_100%)] rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
