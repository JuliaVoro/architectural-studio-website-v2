import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for PSHKRV website.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="pt-32 pb-24 lg:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            Privacy Policy
          </h1>
          <p className="mt-6 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <p className="mt-8 text-base leading-relaxed text-foreground">
            This website is operated by PSHKRV. We respect your privacy and are committed to protecting any personal information you choose to share.
          </p>

          <div className="mt-12 space-y-12">
            <div>
              <h2 className="font-serif text-2xl leading-tight tracking-tight text-foreground">
                1. Information We Collect
              </h2>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-tight text-foreground">
                    a) Contact Form
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-foreground">
                    If you submit a message via the contact form, we collect:
                  </p>
                  <ul className="mt-3 ml-6 list-disc space-y-2 text-base leading-relaxed text-foreground">
                    <li>Your name</li>
                    <li>Your email address</li>
                    <li>Your organization (optional)</li>
                    <li>Your message</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl leading-tight tracking-tight text-foreground">
                2. How Your Information Is Used
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground">
                We use your information to:
              </p>
              <ul className="mt-3 ml-6 list-disc space-y-2 text-base leading-relaxed text-foreground">
                <li>Respond to inquiries sent via the contact form</li>
                <li>Send email notifications about your submission</li>
              </ul>
              <p className="mt-3 text-base leading-relaxed text-foreground">
                We do not sell, rent, or share your information with third parties.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl leading-tight tracking-tight text-foreground">
                3. Data Storage
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground">
                Messages submitted through the contact form are stored securely in our database and handled via Resend, a third-party email platform. Your data may be temporarily stored on Resend's secure servers for processing and delivery.
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground">
                We take reasonable steps to keep your data secure, but please note that no method of transmission over the internet is completely secure.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl leading-tight tracking-tight text-foreground">
                4. Your Rights
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground">
                You have the right to:
              </p>
              <ul className="mt-3 ml-6 list-disc space-y-2 text-base leading-relaxed text-foreground">
                <li>Request access to the personal data we hold about you</li>
                <li>Request correction or deletion of your data</li>
              </ul>
              <p className="mt-3 text-base leading-relaxed text-foreground">
                To do so, please contact us at: sergeipushkaryov@gmail.com
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl leading-tight tracking-tight text-foreground">
                5. Cookies & Analytics
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground">
                This website does not use cookies or tracking tools unless otherwise stated.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl leading-tight tracking-tight text-foreground">
                6. Contact
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground">
                For any privacy-related questions, please contact us via LinkedIn at <a href="https://www.linkedin.com/in/pshkrv/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">/pshkrv</a> or email at: sergeipushkaryov@gmail.com
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-border pt-8">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PSHKRV. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
