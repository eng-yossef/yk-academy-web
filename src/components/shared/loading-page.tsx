"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export function LoadingPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-electric-blue to-cyan shadow-lg shadow-electric-blue/25"
        >
          <GraduationCap className="h-8 w-8 text-white" />
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ duration: 0.8 }}
          className="h-1 overflow-hidden rounded-full bg-light-gray"
        >
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-1/2 rounded-full bg-gradient-to-r from-electric-blue to-cyan"
          />
        </motion.div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </motion.div>
    </div>
  );
}
