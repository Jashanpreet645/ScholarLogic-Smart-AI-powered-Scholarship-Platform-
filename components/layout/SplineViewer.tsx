"use client";

import { useEffect, useRef } from "react";

interface SplineViewerProps {
  url: string;
  className?: string;
}

export default function SplineViewer({ url, className = "" }: SplineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Suppress Spline's known "Missing property" warning that triggers the Next.js error overlay
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      if (typeof args[0] === "string" && args[0].includes("Missing property")) {
        return;
      }
      originalConsoleError(...args);
    };

    if (!scriptLoaded.current) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://unpkg.com/@splinetool/viewer@1.12.73/build/spline-viewer.js";
      document.head.appendChild(script);
      scriptLoaded.current = true;
    }

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {/* @ts-expect-error - spline-viewer is a web component */}
      <spline-viewer
        url={url}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
