"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  glowColor?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, children, glowColor = "rgba(25, 118, 210, 0.15)", onClick }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group relative rounded-xl border border-light-gray bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl cursor-pointer",
          className
        )}
        onClick={onClick}
        style={{
          "--glow-color": glowColor,
        } as React.CSSProperties}
      >
        <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 40%)`,
          }}
        />
        <div className="relative">{children}</div>
      </motion.div>
    );
  }
);
GlowCard.displayName = "GlowCard";

export { GlowCard };
