"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      organization: formData.get("organization") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 border-t border-border pt-10">
        <p className="font-serif text-2xl tracking-tight text-foreground">
          Thank you.
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          {"We'll be in touch within 48 hours."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={submitting}
            className="border-b border-border bg-transparent py-3 text-base text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300 disabled:opacity-50"
            placeholder="Your name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={submitting}
            className="border-b border-border bg-transparent py-3 text-base text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300 disabled:opacity-50"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="organization"
          className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground"
        >
          Organization
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          disabled={submitting}
          className="border-b border-border bg-transparent py-3 text-base text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300 disabled:opacity-50"
          placeholder="Company or organization"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          disabled={submitting}
          className="resize-none border-b border-border bg-transparent py-3 text-base leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300 disabled:opacity-50"
          placeholder="Tell us about your project or challenge"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 border border-foreground bg-foreground px-8 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-background transition-all duration-300 hover:bg-transparent hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}
