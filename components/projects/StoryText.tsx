interface StoryTextProps {
  story: string;
}

export function StoryText({ story }: StoryTextProps) {
  const paragraphs = story
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (!paragraphs.length) return null;

  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <div className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
          Story
        </div>
        <div className="mt-6 space-y-6 text-sm leading-relaxed text-neutral-800 md:text-[15px] md:leading-loose">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

