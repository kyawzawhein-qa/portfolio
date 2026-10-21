"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";

type VisitorCounterProps = {
  initialCount: number;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function VisitorCounter({ initialCount }: VisitorCounterProps) {
  const [display, setDisplay] = useState(0);
  const displayRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const animateTo = useCallback((target: number) => {
    const from = displayRef.current;
    const start = performance.now();
    const duration = 1400;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const value = Math.round(from + (target - from) * easeOutCubic(progress));
      displayRef.current = value;
      setDisplay(value);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    animateTo(initialCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCount]);

  useEffect(() => {
    const onRecorded = (event: Event) => {
      const detail = (event as CustomEvent<{ count: number }>).detail;
      if (typeof detail?.count === "number") animateTo(detail.count);
    };
    window.addEventListener("kzh:visitor-count", onRecorded);
    return () => window.removeEventListener("kzh:visitor-count", onRecorded);
  }, [animateTo]);

  const digits = String(Math.max(0, display)).padStart(1, "0");

  return (
    <div
      className="visitor-counter animate-pulse-glow inline-flex items-center gap-3 rounded-2xl border border-cyan-500/35 bg-cyan-500/10 px-4 py-2.5"
      aria-label={`${display} unique visitors`}
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/40 bg-slate-950/80 text-cyan-300">
        <Users className="h-4 w-4" />
      </span>
      <div className="text-left">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300/90">Unique visitors</p>
        <p className="font-mono text-2xl font-bold tabular-nums text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]">
          {digits.split("").map((char, index) => (
            <span key={`${index}-${char}`} className="inline-block min-w-[0.65em] text-center">
              {char}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
