import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { GlobalFontLoader } from "@/components/global-font-loader";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "PSHKRV",
    template: "%s | PSHKRV",
  },
  description: "Designing spatial-service systems that perform.",
  openGraph: {
    title: "PSHKRV",
    description: "Designing spatial-service systems that perform.",
    images: [
      {
        url: "/images/photo.png",
        width: 1200,
        height: 630,
        alt: "PSHKRV - Designing spatial-service systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PSHKRV",
    description: "Designing spatial-service systems that perform.",
    images: ["/images/photo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F2EF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <GlobalFontLoader />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
