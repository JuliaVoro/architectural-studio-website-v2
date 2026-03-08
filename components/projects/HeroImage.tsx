import Image from "next/image";
import type { Project } from "@/lib/projects";
import { getProjectMediaUrl, getValidProjectMediaUrl } from "@/lib/projects";

interface HeroImageProps {
  project: Project;
}

export function HeroImage({ project }: HeroImageProps) {
  const src = getValidProjectMediaUrl(project.heroImagePath);

  return (
    <section className="border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 md:pb-16 md:pt-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)] md:items-end">
          <div className="space-y-6">
            <div className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
              Case Study
            </div>
            <h1 className="font-serif text-3xl tracking-tight text-neutral-900 md:text-4xl">
              {project.keyFacts.title}
            </h1>
            {project.introText && (
              <p className="max-w-xl text-sm leading-relaxed text-neutral-600">
                {project.introText}
              </p>
            )}
          </div>
          <div className="grid gap-4 text-xs text-neutral-600 md:justify-end">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-3">
              <div>
                <dt className="uppercase tracking-[0.22em] text-neutral-400">
                  Location
                </dt>
                <dd className="mt-1 text-neutral-800">
                  {project.keyFacts.location ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.22em] text-neutral-400">
                  Year
                </dt>
                <dd className="mt-1 text-neutral-800">
                  {project.keyFacts.year ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.22em] text-neutral-400">
                  Size
                </dt>
                <dd className="mt-1 text-neutral-800">
                  {project.keyFacts.size ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.22em] text-neutral-400">
                  Client
                </dt>
                <dd className="mt-1 text-neutral-800">
                  {project.keyFacts.client ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.22em] text-neutral-400">
                  Materials
                </dt>
                <dd className="mt-1 text-neutral-800">
                  {project.keyFacts.materials ?? "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      {src && (
        <div className="border-t border-neutral-200 bg-neutral-100">
          <div className="relative mx-auto h-[320px] max-w-6xl overflow-hidden px-6 pb-8 pt-4 md:h-[440px] md:pb-10">
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              <Image
                src={src}
                alt={project.keyFacts.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 1024px, 100vw"
              />
            </div>
          </div>
        </div>
      )}
      {!src && (
        <div className="border-t border-neutral-200 bg-neutral-100">
          <div className="relative mx-auto h-[320px] max-w-6xl overflow-hidden px-6 pb-8 pt-4 md:h-[440px] md:pb-10">
            <div className="relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
              <div className="text-center text-neutral-500">
                <div className="text-6xl mb-4">🏗️</div>
                <p className="text-lg font-medium">Architectural Project</p>
                <p className="text-sm mt-2">Hero image will be uploaded here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

