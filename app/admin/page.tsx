import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
          Dashboard
        </h1>
        <p className="max-w-xl text-sm text-neutral-600">
          Create and curate AI-generated architectural case studies. Start a
          new project to upload material and let the system assemble a
          magazine-style presentation.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/projects/new"
          className="group flex flex-col justify-between rounded-lg border border-dashed border-neutral-300 bg-white p-4 transition hover:border-neutral-900"
        >
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              New Project
            </div>
            <p className="text-sm text-neutral-600">
              Upload imagery, drawings, and key facts. The AI editor will
              generate a full case study layout.
            </p>
          </div>
          <div className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-neutral-900">
            Start →
          </div>
        </Link>
        <Link
          href="/admin/projects"
          className="group flex flex-col justify-between rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-900"
        >
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              All Projects
            </div>
            <p className="text-sm text-neutral-600">
              Review generated case studies, adjust featured projects, and
              copy editorial text.
            </p>
          </div>
          <div className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-neutral-900">
            View →
          </div>
        </Link>
        <Link
          href="/admin/hero-slides"
          className="group flex flex-col justify-between rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-900"
        >
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              Header Slider
            </div>
            <p className="text-sm text-neutral-600">
              Edit the homepage hero slideshow. Add, hide, or remove slides and
              adjust their text and media URLs.
            </p>
          </div>
          <div className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-neutral-900">
            Edit →
          </div>
        </Link>
      </div>
    </div>
  );
}

