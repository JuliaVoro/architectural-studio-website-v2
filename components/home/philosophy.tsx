import Link from "next/link";

export function Philosophy() {
  return (
    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Philosophy text */}
          <div className="lg:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Philosophy
            </p>
            <div className="mt-10 flex flex-col gap-8">
              <p className="font-serif text-2xl leading-[1.4] tracking-tight text-foreground md:text-3xl">
                Architecture is not an object.
                <br />
                It is infrastructure.
              </p>
              <p className="font-serif text-2xl leading-[1.4] tracking-tight text-foreground md:text-3xl">
                Experience is not a layer.
                <br />
                It is a system.
              </p>
              <p className="font-serif text-xl leading-[1.4] tracking-tight text-muted-foreground md:text-2xl">
                {"We design both — as one."}
              </p>
            </div>
          </div>

          {/* Final CTA */}
          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <div className="border-t border-border pt-8">
              <p className="font-serif text-xl leading-[1.3] text-foreground md:text-2xl text-balance">
                {"Let's build environments that work."}
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors duration-300 hover:text-foreground"
              >
                {"Contact →"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
