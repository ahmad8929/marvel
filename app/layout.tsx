import type { Metadata } from "next";
import {
  Playfair_Display,
  Cormorant_Garamond,
  Jost,
  Dancing_Script,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marvelsazamgarh.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Marvel's Online Clothings — Style that defines you",
    template: "%s | Marvel's Online Clothings",
  },
  description:
    "Elegant, feminine, effortless women's ethnic and fusion wear — kurtis, dresses and co-ord sets. Launching soon at marvelsazamgarh.in.",
  openGraph: {
    title: "Marvel's Online Clothings",
    description: "Timeless style. Made for you.",
    url: siteUrl,
    siteName: "Marvel's Online Clothings",
    locale: "en_IN",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${jost.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
