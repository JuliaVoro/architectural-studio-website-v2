import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sergii Pushkarov is a multidisciplinary designer working at the intersection of service design, digital products and spatial experience.",
};

const expertise = [
  {
    title: "Service Design & Strategy",
    text: "Rethinking how people interact with services, environments and technologies through strategic design thinking.",
  },
  {
    title: "Spatial Experience Design",
    text: "Translating complex systems into clear, human-centered spatial experiences that connect strategy and execution.",
  },
  {
    title: "Multidisciplinary Practice",
    text: "Bridging business objectives with human needs across retail, healthcare, hospitality, and technology sectors.",
  },
  {
    title: "International Collaboration",
    text: "Excels in remote work environments, building effective collaboration across time zones and cultures to deliver seamless project outcomes.",
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
              About
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Sergii Pushkarov
            </h1>
            <p className="mt-2 text-sm font-medium text-primary uppercase tracking-[0.15em]">
              Strategy and Spatial Design
            </p>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
              A multidisciplinary designer working at the intersection of service design, digital products and spatial experience. Over more than fifteen years of practice, he has helped organizations rethink how people interact with services, environments and technologies.
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand">
              <Image
                src="/images/portrate.png"
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
                Partners with organizations across retail, healthcare, hospitality, and technology sectors, helping them transform complex systems into clear, human-centered experiences that connect strategic intent with operational execution.
              </p>
            </div>
          </div>
        </div>

        {/* Positioning statement */}
        <div className="mt-24 border-t border-border pt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-serif text-2xl leading-[1.4] tracking-tight text-foreground md:text-3xl lg:text-4xl text-balance">
                Based in Milan and working internationally, combines strategic thinking with hands-on design practice, bridging business objectives with human needs.
              </p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-base leading-relaxed text-muted-foreground">
                Connects with a network of professionals and providers to deliver projects end-to-end, from initial idea to successful launch.
              </p>
            </div>
          </div>
        </div>

        {/* Expertise */}
        <div className="mt-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Expertise
          </p>
          <div className="mt-10">
            {expertise.map((area, index) => (
              <div
                key={area.title}
                className="grid grid-cols-1 gap-6 border-t border-border py-10 lg:grid-cols-12"
              >
                <div className="flex items-start gap-4 lg:col-span-4">
                  <span className="mt-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-medium text-foreground">
                    {area.title}
                  </h3>
                </div>
                <div className="lg:col-span-6 lg:col-start-6">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {area.text}
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
              Design is not about objects. It is about systems.
            </p>
            <p className="mt-4 font-serif text-xl leading-[1.5] tracking-tight text-foreground md:text-2xl">
              Experience is not a layer. It is a connection.
            </p>
            <p className="mt-4 font-serif text-xl leading-[1.5] tracking-tight text-muted-foreground md:text-2xl">
              {"I design both — as one."}
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors duration-300 hover:text-foreground"
            >
              {"Let's work together →"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
