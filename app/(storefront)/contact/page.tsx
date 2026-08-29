import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { getChrome } from "@/lib/storefront";
import { NewsletterForm } from "@/components/storefront/NewsletterForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Marvel's Online Clothings.",
};

export default async function ContactPage() {
  const { settings } = await getChrome();
  return (
    <Container className="py-14">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-3xl text-primary">Contact us</h1>
        <p className="mt-3 text-sm text-muted">
          We&apos;re a small team and we read every message. Expect a reply within
          one business day.
        </p>
        <dl className="mt-8 space-y-3 text-sm">
          <div>
            <dt className="text-muted">Email</dt>
            <dd>
              <a href={`mailto:${settings.supportEmail}`} className="text-primary">
                {settings.supportEmail}
              </a>
            </dd>
          </div>
          {settings.supportPhone && (
            <div>
              <dt className="text-muted">Phone</dt>
              <dd>{settings.supportPhone}</dd>
            </div>
          )}
          {settings.whatsappNumber && (
            <div>
              <dt className="text-muted">WhatsApp</dt>
              <dd>{settings.whatsappNumber}</dd>
            </div>
          )}
          {settings.businessAddress && (
            <div>
              <dt className="text-muted">Address</dt>
              <dd>{settings.businessAddress}</dd>
            </div>
          )}
        </dl>
        <div className="mt-10">
          <h2 className="font-display text-xl text-primary">Get launch updates</h2>
          <div className="mt-3">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </Container>
  );
}
