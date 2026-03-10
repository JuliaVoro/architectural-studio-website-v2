export function TheShift() {
  return (
    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              The Shift
            </p>
            <h2 className="mt-6 font-serif text-3xl leading-[1.2] tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
              From designing objects to systems
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="flex flex-col gap-6 pt-2 lg:pt-16">
              <p className="text-base leading-relaxed text-muted-foreground">
                Architecture without service becomes static.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Service without space becomes abstract.
              </p>
              <p className="text-base leading-relaxed text-foreground">
                Designing both as one operational model.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
