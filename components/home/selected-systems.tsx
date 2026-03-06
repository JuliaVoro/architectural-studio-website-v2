"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const cases = [
  {
    slug: "flow-optimization",
    title: "Flow Optimization System",
    summary:
      "Reconfigured spatial sequences to reduce queue friction and increase throughput by 34% across peak hours.",
    image: "/images/case-flow.jpg",
  },
  {
    slug: "behavior-shaping",
    title: "Behavior-Shaping Environment",
    summary:
      "Material and spatial cues designed to guide intuitive wayfinding, increasing dwell time and engagement.",
    image: "/images/case-behavior.jpg",
  },
  {
    slug: "hybrid-model",
    title: "Hybrid Physical-Digital Model",
    summary:
      "An integrated interface layer merging physical space with digital touchpoints for seamless service delivery.",
    image: "/images/case-hybrid.jpg",
  },
  {
    slug: "operational-transformation",
    title: "Operational Transformation",
    summary:
      "Full-scale spatial-service redesign that increased revenue per square meter by 28% within six months.",
    image: "/images/case-operations.jpg",
  },
];

export function SelectedSystems() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Selected Systems
            </p>
            <h2 className="mt-6 font-serif text-3xl leading-[1.2] tracking-tight text-foreground md:text-4xl text-balance">
              Recent Work
            </h2>
          </div>
          <Link
            href="/systems"
            className="hidden text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground md:inline-block"
          >
            {"View All →"}
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {cases.map((item, index) => (
            <Link
              href={`/systems/${item.slug}`}
              key={item.slug}
              className="group"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s`,
              }}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="mt-5">
                <h3 className="text-base font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/systems"
          className="mt-10 inline-block text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground md:hidden"
        >
          {"View All →"}
        </Link>
      </div>
    </section>
  );
}
