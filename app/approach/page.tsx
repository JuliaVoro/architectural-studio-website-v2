import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ApproachDiagram } from "@/components/approach/approach-diagram";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "Our 5-layer methodology: Business, Service, Spatial, Interaction, Performance.",
};

const layers = [
  {
    number: "01",
    title: "Business",
    description:
      "Every project begins with strategic clarity. We map commercial logic, revenue mechanics, and organizational goals to establish the operating parameters that all design decisions must serve.",
  },
  {
    number: "02",
    title: "Service",
    description:
      "We choreograph the full service journey, defining touchpoints, handoffs, and operational sequences. This is where human behavior meets business logic in a structured protocol.",
  },
  {
    number: "03",
    title: "Spatial",
    description:
      "Architecture becomes the physical translation of the service system. Form, material, proportion, and circulation are designed to enable and amplify the intended operational choreography.",
  },
  {
    number: "04",
    title: "Interaction",
    description:
      "Digital and physical interface systems are integrated as a single layer. Technology serves the spatial-service logic rather than operating as an independent channel.",
  },
  {
    number: "05",
    title: "Performance",
    description:
      "Every system is designed with measurable outcomes. We define KPIs at the outset and build feedback loops that allow the spatial-service system to be continuously optimized.",
  },
];

export default function ApproachPage() {
  return (
    <section className="pt-32 pb-24 lg:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Approach
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              A methodology, not a style.
            </h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-8">
            <p className="pt-2 text-base leading-relaxed text-muted-foreground lg:pt-16">
              Our 5-layer model structures every engagement, from strategic
              intent through spatial translation to measurable performance. Each
              layer builds on the previous. None operate in isolation.
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="mt-16 relative aspect-[21/9] w-full overflow-hidden bg-sand">
          <Image
            src="/images/approach.jpg"
            alt="Intersecting architectural planes with light and shadow"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Diagram */}
        <div className="mt-24">
          <ApproachDiagram />
        </div>

        {/* Layers detail */}
        <div className="mt-24">
          {layers.map((layer) => (
            <div
              key={layer.number}
              className="grid grid-cols-1 gap-6 border-t border-border py-10 lg:grid-cols-12"
            >
              <div className="flex items-start gap-4 lg:col-span-4">
                <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
                  {layer.number}
                </span>
                <h3 className="font-serif text-2xl tracking-tight text-foreground">
                  {layer.title}
                </h3>
              </div>
              <div className="lg:col-span-6 lg:col-start-6">
                <p className="text-base leading-relaxed text-muted-foreground">
                  {layer.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 border-t border-border pt-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="font-serif text-2xl leading-[1.3] tracking-tight text-foreground md:text-3xl text-balance">
                {"Interested in how this applies to your context?"}
              </p>
            </div>
            <div className="flex items-end lg:col-span-3 lg:col-start-10">
              <Link
                href="/contact"
                className="text-sm font-medium text-primary transition-colors duration-300 hover:text-foreground"
              >
                {"Start a Conversation →"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
