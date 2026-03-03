import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { systems } from "@/lib/systems-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return systems.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const system = systems.find((s) => s.slug === slug);
  if (!system) return {};
  return {
    title: system.title,
    description: system.summary,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const system = systems.find((s) => s.slug === slug);
  if (!system) notFound();

  return (
    <article className="pt-32 pb-24 lg:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Link
              href="/systems"
              className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              {"← Back to Systems"}
            </Link>
            <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.15em] text-primary">
              {system.category}
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl text-balance">
              {system.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              {system.summary}
            </p>
          </div>
        </div>

        {/* Hero image */}
        <div className="mt-16 relative aspect-[21/9] w-full overflow-hidden bg-sand">
          <Image
            src={system.image}
            alt={system.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Content sections */}
        <div className="mt-24 grid grid-cols-1 gap-24 lg:grid-cols-12">
          {/* Strategic Context */}
          <div className="lg:col-span-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Strategic Context
                </p>
              </div>
              <div className="lg:col-span-7">
                <p className="text-base leading-relaxed text-foreground">
                  {system.context}
                </p>
              </div>
            </div>
          </div>

          {/* Business Shift */}
          <div className="lg:col-span-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Business Shift
                </p>
              </div>
              <div className="lg:col-span-7">
                <p className="text-base leading-relaxed text-foreground">
                  {system.businessShift}
                </p>
              </div>
            </div>
          </div>

          {/* Service Architecture */}
          <div className="lg:col-span-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Service Architecture
                </p>
              </div>
              <div className="lg:col-span-7">
                <p className="text-base leading-relaxed text-foreground">
                  {system.serviceArchitecture}
                </p>
              </div>
            </div>
          </div>

          {/* Spatial Translation */}
          <div className="lg:col-span-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Spatial Translation
                </p>
              </div>
              <div className="lg:col-span-7">
                <p className="text-base leading-relaxed text-foreground">
                  {system.spatialTranslation}
                </p>
              </div>
            </div>
          </div>

          {/* Interaction Layer */}
          <div className="lg:col-span-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Interaction Layer
                </p>
              </div>
              <div className="lg:col-span-7">
                <p className="text-base leading-relaxed text-foreground">
                  {system.interactionLayer}
                </p>
              </div>
            </div>
          </div>

          {/* Performance Outcomes */}
          <div className="lg:col-span-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Performance Outcomes
                </p>
              </div>
              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 gap-8">
                  {system.performanceOutcomes.map((outcome) => (
                    <div key={outcome.metric} className="border-t border-border pt-4">
                      <p className="font-serif text-3xl tracking-tight text-primary md:text-4xl">
                        {outcome.value}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {outcome.metric}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Insight */}
          <div className="lg:col-span-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Strategic Insight
                </p>
              </div>
              <div className="lg:col-span-7">
                <p className="font-serif text-xl leading-[1.4] tracking-tight text-foreground md:text-2xl">
                  {system.strategicInsight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next CTA */}
        <div className="mt-24 border-t border-border pt-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <Link
              href="/systems"
              className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              {"← All Systems"}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-primary transition-colors duration-300 hover:text-foreground"
            >
              {"Start a Conversation →"}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
