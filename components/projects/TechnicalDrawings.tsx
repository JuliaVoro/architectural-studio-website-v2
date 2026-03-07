import { getProjectMediaUrl } from "@/lib/projects";

interface TechnicalDrawingsProps {
  drawingPaths: string[];
  notes?: string;
}

export function TechnicalDrawings({
  drawingPaths,
  notes,
}: TechnicalDrawingsProps) {
  if (!drawingPaths.length) return null;

  return (
    <section className="border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
              Technical Drawings
            </div>
            {notes && (
              <p className="mt-2 max-w-xl text-xs text-neutral-600">{notes}</p>
            )}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {drawingPaths.map((path) => {
            const url = getProjectMediaUrl(path);
            const isPdf = path.toLowerCase().endsWith(".pdf");

            if (isPdf) {
              return (
                <a
                  key={path}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-[220px] items-center justify-center rounded-lg border border-neutral-200 bg-white text-xs text-neutral-600 hover:border-neutral-900"
                >
                  Open drawing PDF
                </a>
              );
            }

            return (
              <figure
                key={path}
                className="flex h-[220px] items-center justify-center rounded-lg border border-neutral-200 bg-white"
              >
                <img
                  src={url}
                  alt="Technical drawing"
                  className="max-h-full max-w-full object-contain"
                />
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

