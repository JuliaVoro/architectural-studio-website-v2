"use client";

import { useEffect, useRef, useState } from "react";

const outcomes = [
  "Reduced operational friction",
  "Increased dwell time",
  "Higher retention",
  "Improved spatial clarity",
  "Increased revenue per square meter",
  "Elevated perceived value",
];

export function Outcomes() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Outcomes
            </p>
            <h2 className="mt-6 font-serif text-3xl leading-[1.2] tracking-tight text-foreground md:text-4xl text-balance">
              When Space Becomes Service
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="flex flex-col">
              {outcomes.map((item, index) => (
                <li
                  key={item}
                  className="flex items-center gap-4 border-t border-border py-5"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? "translateX(0)"
                      : "translateX(-12px)",
                    transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  <span className="text-base text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
