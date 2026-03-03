import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "An interdisciplinary design studio operating at the intersection of architecture, service design, and strategy.",
};

const principles = [
  {
    title: "Interdisciplinary by Design",
    text: "We draw from architecture, service design, interaction design, and business strategy. Our work sits at the intersection of disciplines that are typically siloed.",
  },
  {
    title: "Strategic Thinking",
    text: "Every project starts with a strategic question, not a brief. We understand the commercial logic before we touch the spatial form.",
  },
  {
    title: "Architecture + Service Integration",
    text: "Space and service are not separate layers. They are one system. We design them together, from day one, as a unified operating model.",
  },
  {
    title: "Cross-Sector Expertise",
    text: "Our methodology is sector-agnostic. The principles of spatial-service integration apply whether the context is hospitality, retail, workplace, or cultural infrastructure.",
  },
];

export default function StudioPage() {
  return (
    <section className="pt-32 pb-24 lg:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Studio
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Designing the logic of space.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
              Service Architecture Studio is an interdisciplinary practice
              operating at the intersection of spatial design, service design,
              and business strategy. We design environments that perform.
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand">
              <Image
                src="/images/studio.jpg"
                alt="Architectural studio workspace"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          </div>
          <div className="flex flex-col justify-end lg:col-span-3 lg:col-start-10">
            <div className="border-t border-border pt-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                We are not a traditional architecture firm. We are not a
                startup agency. We are a strategic design practice that
                builds spatial-service systems.
              </p>
            </div>
          </div>
        </div>

        {/* Positioning statement */}
        <div className="mt-24 border-t border-border pt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-serif text-2xl leading-[1.4] tracking-tight text-foreground md:text-3xl lg:text-4xl text-balance">
                We believe that the most impactful design happens when
                architecture, service, and strategy are conceived as one
                system.
              </p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-base leading-relaxed text-muted-foreground">
                Our work produces environments that reduce operational
                friction, increase engagement, and create measurable business
                value. Every project is grounded in strategic intent and
                validated through performance outcomes.
              </p>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="mt-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Principles
          </p>
          <div className="mt-10">
            {principles.map((principle, index) => (
              <div
                key={principle.title}
                className="grid grid-cols-1 gap-6 border-t border-border py-10 lg:grid-cols-12"
              >
                <div className="flex items-start gap-4 lg:col-span-4">
                  <span className="mt-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-medium text-foreground">
                    {principle.title}
                  </h3>
                </div>
                <div className="lg:col-span-6 lg:col-start-6">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {principle.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manifesto closing */}
        <div className="mt-24 border-t border-border pt-16">
          <div className="mx-auto max-w-2xl">
            <p className="font-serif text-xl leading-[1.5] tracking-tight text-foreground md:text-2xl">
              Architecture is not an object. It is infrastructure.
            </p>
            <p className="mt-4 font-serif text-xl leading-[1.5] tracking-tight text-foreground md:text-2xl">
              Experience is not a layer. It is a system.
            </p>
            <p className="mt-4 font-serif text-xl leading-[1.5] tracking-tight text-muted-foreground md:text-2xl">
              {"We design both — as one."}
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors duration-300 hover:text-foreground"
            >
              {"Let's talk →"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
