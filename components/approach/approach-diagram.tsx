"use client";

import { useEffect, useRef, useState } from "react";

const layers = ["Business", "Service", "Spatial", "Interaction", "Performance"];

export function ApproachDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mx-auto max-w-3xl">
      <div className="flex flex-col items-center">
        {layers.map((layer, index) => (
          <div key={layer} className="flex w-full flex-col items-center">
            {/* Layer block */}
            <div
              className="flex w-full items-center justify-center border border-border bg-sand py-5 transition-all"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`,
                maxWidth: `${100 - index * 4}%`,
              }}
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground">
                {layer}
              </span>
            </div>

            {/* Connector line */}
            {index < layers.length - 1 && (
              <div
                className="h-6 w-px bg-border"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: `opacity 0.5s ease ${index * 0.15 + 0.1}s`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Arrow at bottom */}
      <div
        className="mt-4 flex justify-center"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease 0.9s",
        }}
      >
        <svg width="12" height="20" viewBox="0 0 12 20" fill="none" className="text-primary">
          <path d="M6 0L6 18M6 18L1 13M6 18L11 13" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      <p
        className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.15em] text-primary"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease 1s",
        }}
      >
        Measurable Impact
      </p>
    </div>
  );
}
