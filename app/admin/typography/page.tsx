import { CleanTypographyAdmin } from "@/components/clean-typography-admin";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminTypographyPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Typography</h1>
          <p className="text-muted-foreground mt-2">
            Manage website fonts and type scale globally.
          </p>
        </div>

        <CleanTypographyAdmin />
      </div>
    </div>
  );
}
