import type { Project } from "@/lib/projects";

interface KeyFactsTableProps {
  project: Project;
}

export function KeyFactsTable({ project }: KeyFactsTableProps) {
  const facts = [
    ["Location", project.keyFacts.location],
    ["Year", project.keyFacts.year?.toString()],
    ["Size", project.keyFacts.size],
    ["Client", project.keyFacts.client],
    ["Materials", project.keyFacts.materials],
  ].filter(([label, value]) => {
    // Only filter out empty strings, null, and undefined
    // But keep valid values like "0" for year
    return value !== null && value !== undefined && value !== "";
  });

  if (!facts.length) return null;

  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-8 md:py-10">
        <div className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
          Key Facts
        </div>
        <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm text-neutral-800 md:grid-cols-2">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                {label}
              </dt>
              <dd className="mt-1">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

