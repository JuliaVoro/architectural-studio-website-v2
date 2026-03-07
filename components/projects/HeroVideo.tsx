interface HeroVideoProps {
  src: string;
  title: string;
}

export function HeroVideo({ src, title }: HeroVideoProps) {
  return (
    <section className="border-b border-neutral-200 bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 md:pb-16 md:pt-20">
        <div className="space-y-4">
          <div className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
            Project Film
          </div>
          <h1 className="font-serif text-3xl tracking-tight md:text-4xl">
            {title}
          </h1>
        </div>
      </div>
      <div className="bg-black">
        <div className="mx-auto max-w-6xl px-6 pb-10">
          <div className="aspect-video overflow-hidden rounded-lg border border-neutral-800">
            <video
              src={src}
              controls
              className="h-full w-full bg-black object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

