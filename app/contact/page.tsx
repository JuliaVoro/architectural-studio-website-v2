import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation with PSHKRV.",
};

export default function ContactPage() {
  return (
    <section className="pt-32 pb-24 lg:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Contact
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-7xl text-balance">
              {"Let's build environments that work."}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Info column */}
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-10">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  LinkedIn
                </p>
                <a
                  href="https://www.linkedin.com/in/pshkrv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-base text-foreground transition-colors duration-300 hover:text-primary"
                >
                  /pshkrv
                </a>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Location
                </p>
                <p className="mt-3 text-base text-foreground">
                  Milan, Italy
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Availability
                </p>
                <p className="mt-3 text-base text-foreground">
                  Available for new projects and collaborations. Feel free to get in touch.
                </p>
              </div>
              <div className="border-t border-border pt-8">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  We work with organizations that understand design as a
                  strategic investment, not a cosmetic exercise. If that
                  describes your context, we should talk.
                </p>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
