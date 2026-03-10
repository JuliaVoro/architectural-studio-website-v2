"use client";

import { useEffect, useRef, useState } from "react";

const layers = [
  {
    label: "Business",
    description: "Strategic intent and commercial logic",
  },
  {
    label: "Service",
    description: "Operational choreography and touchpoints",
  },
  {
    label: "Spatial",
    description: "Architectural form and material language",
  },
  {
    label: "Interaction",
    description: "Digital and physical interface systems",
  },
  {
    label: "Performance",
    description: "Measurable outcomes and feedback loops",
  },
];

export function SystemModel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              System
            </p>
            <h2 className="mt-6 font-serif text-3xl leading-[1.2] tracking-tight text-foreground md:text-4xl text-balance">
              The 5-Layer Model
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Every project begins with strategic intent and ends with
              measurable impact.
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="flex flex-col">
              {layers.map((layer, index) => (
                <div
                  key={layer.label}
                  className="group flex items-start gap-6 border-t border-border py-6 transition-opacity duration-700"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? "translateY(0)"
                      : "translateY(12px)",
                    transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
                  }}
                >
                  <span className="mt-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-base font-medium text-foreground">
                      {layer.label}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {layer.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
