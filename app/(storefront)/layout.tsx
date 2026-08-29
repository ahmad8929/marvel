import { AuthProvider } from "@/lib/auth-client";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { getChrome } from "@/lib/storefront";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories, settings } = await getChrome();

  return (
    <AuthProvider>
      <Header
        categories={categories}
        announcement={settings.announcementText}
        announcementHref={settings.announcementHref}
        freeShipThreshold={settings.freeShipThreshold}
      />
      <div className="flex-1">{children}</div>
      <Footer categories={categories} settings={settings} />
    </AuthProvider>
  );
}
