"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Users } from "lucide-react";

type VisitorCounterProps = {
  initialCount: number;
};

const DISPLAY_STORAGE_KEY = "kzh_visitor_count_display";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function readStoredCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = sessionStorage.getItem(DISPLAY_STORAGE_KEY);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function persistCount(count: number) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DISPLAY_STORAGE_KEY, String(count));
}

function resolveStartingCount(initialCount: number): number {
  return Math.max(initialCount, readStoredCount());
}

export default function VisitorCounter({ initialCount }: VisitorCounterProps) {
  const pathname = usePathname();
  const [display, setDisplay] = useState(initialCount);
  const displayRef = useRef(initialCount);
  const rafRef = useRef<number | null>(null);

  const setCountImmediate = useCallback((target: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    displayRef.current = target;
    setDisplay(target);
    persistCount(target);
  }, []);

  const animateTo = useCallback(
    (target: number) => {
      if (target === displayRef.current) {
        persistCount(target);
        return;
      }

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
        } else {
          persistCount(target);
        }
      };

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    },
    []
  );

  const applyServerCount = useCallback(
    (target: number) => {
      if (typeof target !== "number" || target < 0) return;
      if (displayRef.current === 0 && target > 0) {
        animateTo(target);
        return;
      }
      if (target !== displayRef.current) {
        animateTo(target);
        return;
      }
      persistCount(target);
    },
    [animateTo]
  );

  useLayoutEffect(() => {
    const restored = resolveStartingCount(initialCount);
    if (restored !== displayRef.current) {
      setCountImmediate(restored);
    }
  }, [initialCount, setCountImmediate]);

  useEffect(() => {
    applyServerCount(initialCount);
  }, [initialCount, applyServerCount]);

  useEffect(() => {
    const onRecorded = (event: Event) => {
      const detail = (event as CustomEvent<{ count: number }>).detail;
      if (typeof detail?.count === "number") applyServerCount(detail.count);
    };
    window.addEventListener("kzh:visitor-count", onRecorded);
    return () => window.removeEventListener("kzh:visitor-count", onRecorded);
  }, [applyServerCount]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/visitors/record", { method: "GET", credentials: "same-origin" })
      .then((res) => res.json())
      .then((data: { count?: number }) => {
        if (!cancelled && typeof data.count === "number") {
          applyServerCount(data.count);
        }
      })
      .catch(() => {
        const stored = readStoredCount();
        if (!cancelled && stored > 0) setCountImmediate(stored);
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, applyServerCount, setCountImmediate]);

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
