import Link from "next/link";
import { InteractiveGeometry } from "./interactive-geometry";

export function Hero() {
  return (
    <section className="relative min-h-screen pt-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 items-end gap-12 pb-16 pt-16 lg:grid-cols-12 lg:pt-24">
          {/* Left column - Text */}
          <div className="lg:col-span-7">
            <h1 className="font-serif text-5xl leading-[1.1] tracking-tight text-foreground md:text-7xl lg:text-8xl text-balance">
              Service, built
              <br />
              in space.
            </h1>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground lg:text-lg">
              We design spatial-service systems that align business strategy,
              operational performance, and human experience.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/systems"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-300 hover:text-primary"
              >
                {"View Selected Systems"}
                <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  {"→"}
                </span>
              </Link>
              <span className="hidden text-border sm:inline">{"/"}</span>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {"Start a Conversation →"}
              </Link>
            </div>
          </div>

          {/* Right column - Interactive Geometry */}
          <div className="lg:col-span-5">
            <InteractiveGeometry />
          </div>
        </div>
      </div>
    </section>
  );
}
