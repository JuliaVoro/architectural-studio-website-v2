import Image from "next/image";
import { getProjectMediaUrl } from "@/lib/projects";

interface FullWidthImageProps {
  imagePath: string;
  caption?: string;
}

export function FullWidthImage({ imagePath, caption }: FullWidthImageProps) {
  const src = getProjectMediaUrl(imagePath);

  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <div className="relative h-[260px] overflow-hidden rounded-lg bg-neutral-200 md:h-[420px]">
          <Image
            src={src}
            alt={caption || "Project image"}
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
        </div>
        {caption && (
          <p className="mt-3 text-xs text-neutral-500">{caption}</p>
        )}
      </div>
    </section>
  );
}

