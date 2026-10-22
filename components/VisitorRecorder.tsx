"use client";

import { useEffect } from "react";

/**
 * Records at most one visit per browser (httpOnly cookie + session guard).
 * Failures are ignored so the page always renders.
 */
export default function VisitorRecorder() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("kzh_visitor_ping") === "1") return;
    sessionStorage.setItem("kzh_visitor_ping", "1");

    fetch("/api/visitors/record", { method: "POST", credentials: "same-origin" })
      .then((res) => res.json())
      .then((data: { count?: number }) => {
        if (typeof data.count === "number") {
          window.dispatchEvent(new CustomEvent("kzh:visitor-count", { detail: { count: data.count } }));
        }
      })
      .catch(() => {
        /* fail soft */
      });
  }, []);

  return null;
}
