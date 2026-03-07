import Link from "next/link";

async function getProjects() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000";

  const url =
    typeof baseUrl === "string" && !baseUrl.startsWith("http")
      ? `https://${baseUrl}`
      : baseUrl;

  const res = await fetch(`${url}/api/projects`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load projects");
  }

  const data = (await res.json()) as {
    projects: Array<{
      id: string;
      slug: string;
      createdAt: string;
      status: string;
      keyFacts: { title: string; location?: string; year?: number };
    }>;
  };

  return data.projects;
}

export default async function AdminProjectsPage() {
  const projects = await getProjects().catch(() => []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
            Projects
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-600">
            Overview of AI-generated case studies. Click through to preview the
            public project page.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-full border border-neutral-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-900 hover:bg-neutral-900 hover:text-white"
        >
          New Project
        </Link>
      </header>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-[0.18em] text-neutral-500">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Open</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-neutral-500"
                >
                  No projects yet. Start by creating a new one.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">
                      {project.keyFacts.title}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {project.keyFacts.location ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {project.keyFacts.year ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-neutral-300 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-neutral-900 underline underline-offset-4"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

