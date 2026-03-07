"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Login failed");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
          Studio Admin
        </h1>
        <p className="mb-6 text-sm text-neutral-600">
          Enter the administrator password to access the dashboard.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500"
            >
              Access Key
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="border-neutral-300 bg-neutral-50 text-sm"
            />
          </div>
          {error ? (
            <p className="text-xs text-red-600">{error}</p>
          ) : (
            <p className="text-[11px] text-neutral-500">
              Protected area for internal use only.
            </p>
          )}
          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-neutral-900 text-xs uppercase tracking-[0.2em] text-white hover:bg-neutral-800"
          >
            {loading ? "Signing in…" : "Enter"}
          </Button>
        </form>
      </div>
    </div>
  );
}

