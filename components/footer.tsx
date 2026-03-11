import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Designing spatial-service systems
              that perform.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 md:col-start-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Navigation
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {["Home", "Stories", "Approach", "Studio", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                      className="text-sm text-foreground transition-colors duration-300 hover:text-muted-foreground"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3 md:col-start-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Contact
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href="https://www.linkedin.com/in/pshkrv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground transition-colors duration-300 hover:text-muted-foreground"
                >
                  in/pshkrv
                </a>
              </li>
              <li>
                <span className="text-sm text-foreground">
                  Milan, Italy
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">
            {`© ${new Date().getFullYear()} PSHKRV. All rights reserved.`}
          </p>
          <p className="text-xs text-muted-foreground">
            <Link
              href="/privacy"
              className="transition-colors duration-300 hover:text-foreground"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
