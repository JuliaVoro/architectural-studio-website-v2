import type { Metadata } from "next";
import { SystemsGrid } from "@/components/systems/systems-grid";

export const metadata: Metadata = {
  title: "Systems",
  description:
    "Selected spatial-service systems. Case studies categorized by strategic system type.",
};

export default function SystemsPage() {
  return (
    <section className="pt-32 pb-24 lg:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Systems
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Selected Systems
            </h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-8">
            <p className="pt-2 text-base leading-relaxed text-muted-foreground lg:pt-16">
              Each case is categorized by strategic system type, not sector.
              We believe the logic of spatial-service integration transcends
              industry boundaries.
            </p>
          </div>
        </div>

        {/* Grid */}
        <SystemsGrid />
      </div>
    </section>
  );
}
