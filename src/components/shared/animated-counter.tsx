"use client";

import * as React from "react";
import { useInView, motion, useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  prefix = "",
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = React.useState(from);

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, {
        duration,
        ease: "easeOut",
      });

      const unsubscribe = rounded.on("change", (v) => {
        setDisplayValue(v);
      });

      return () => {
        controls.stop();
        unsubscribe();
      };
    }
  }, [isInView, count, rounded, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
