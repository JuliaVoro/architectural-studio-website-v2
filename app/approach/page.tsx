import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ApproachDiagram } from "@/components/approach/approach-diagram";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "Designing systems, not isolated solutions. A methodology that transforms fragmented interactions into integrated experiences.",
};

const methodology = [
  {
    number: "01",
    title: "Discover",
    description:
      "Understanding people, systems, and contexts through research, observation, and stakeholder dialogue.",
  },
  {
    number: "02",
    title: "Define",
    description:
      "Transforming insights into clear strategic direction, identifying opportunities and framing the right design challenges.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "Developing concepts, prototypes, and experiences through iterative exploration and collaboration.",
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "Translating ideas into implementable solutions and supporting organizations in bringing them to life.",
  },
];

const principles = [
  {
    title: "Systems before objects",
    description: "Design focuses on relationships between people, services, and environments rather than isolated artifacts.",
  },
  {
    title: "Human-centered yet strategic",
    description: "Successful solutions align human needs with business objectives and organizational realities.",
  },
  {
    title: "Clarity through design",
    description: "Design helps transform complexity into understandable and engaging experiences.",
  },
  {
    title: "Collaboration as a catalyst",
    description: "The most impactful solutions emerge through collaboration between diverse disciplines and perspectives.",
  },
];

export default function ApproachPage() {
  return (
    <section className="pt-32 pb-24 lg:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-8">
              Approach
            </p>
            <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-7xl xl:text-8xl text-balance">
              Designing systems, not isolated solutions
            </h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex items-start">
            <div className="lg:pt-16">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Organizations today operate through complex networks of services, products, digital platforms, and physical environments. What people experience, however, is not this complexity — but the clarity, coherence, and meaning created from it.
              </p>
            </div>
          </div>
        </div>

        {/* What this means in practice */}
        <div className="mt-16 md:mt-32 border-t border-border pt-12 md:pt-20">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-6">
                What this means in practice
              </p>
              <p className="font-serif text-3xl leading-[1.2] tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance mb-8">
                In practice, this approach helps organizations:
              </p>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0"></span>
                  <span className="text-lg leading-relaxed text-muted-foreground">rethink fragmented customer journeys</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0"></span>
                  <span className="text-lg leading-relaxed text-muted-foreground">connect digital and physical experiences</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0"></span>
                  <span className="text-lg leading-relaxed text-muted-foreground">design services that scale across systems</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0"></span>
                  <span className="text-lg leading-relaxed text-muted-foreground">turn strategy into tangible experiences</span>
                </li>
              </ul>
            </div>
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

        {/* How I Work */}
        <div className="mt-16 md:mt-32 border-t border-border pt-12 md:pt-20">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-6">
                How I Work
              </p>
              <div className="space-y-8">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Every project begins by understanding the broader ecosystem in which it exists: people, technologies, organizational processes, and physical environments.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Through research and collaboration, hidden patterns and opportunities emerge. These insights guide the development of strategies and design concepts that connect human needs with business goals.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  The process is iterative, collaborative, and grounded in real contexts, ensuring that ideas evolve into solutions that are both meaningful for people and viable for organizations.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="lg:mt-16 space-y-8">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  My work focuses on transforming fragmented interactions into integrated experiences. By connecting research, strategy, digital design, and spatial thinking, I help organizations shape systems that work seamlessly across touchpoints.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Rather than designing individual artifacts, the goal is to design how people move through experiences — how they discover, understand, and engage with services and environments.
                </p>
              </div>
            </div>
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

        {/* Methodology */}
        <div className="mt-16 md:mt-32">
          <p className="font-serif text-3xl leading-[1.2] tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance mb-16">
            A flexible framework guides the design process while allowing projects to adapt to their specific context.
          </p>
        </div>

        {/* Principles */}
        <div className="mt-16 md:mt-32">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-6">
            Principles
          </p>
          <div className="space-y-16">
            {principles.map((principle, index) => (
              <div
                key={principle.title}
                className="grid grid-cols-1 gap-6 border-t border-border pt-16 lg:grid-cols-12 lg:gap-12"
              >
                <div className="lg:col-span-4">
                  <span className="text-[11px] font-medium tabular-nums text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-lg font-medium text-foreground">
                    {principle.title}
                  </h3>
                </div>
                <div className="lg:col-span-7 lg:col-start-6">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 md:mt-32 border-t border-border pt-12 md:pt-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-7">
              <p className="font-serif text-3xl leading-[1.2] tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
                Interested in how this approach applies to your context?
              </p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 flex items-start lg:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 text-lg font-medium text-primary transition-colors duration-300 hover:text-foreground"
              >
                Start a conversation →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
