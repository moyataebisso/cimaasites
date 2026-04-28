import type { Metadata } from "next";
import { Inter, Manrope, Outfit } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

// Outfit kept for backwards compatibility with any styles still referencing it.
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Cimaa Sites — Websites built for your local business",
  description:
    "We build, launch, and run the website for your local business. Custom quote within 24 hours, 24/7 monitoring, real human support.",
  keywords:
    "small business website, local business website, professional website, done for you website, website monitoring, restaurant website, salon website, healthcare website, fleet website, home services website",
  openGraph: {
    title: "Cimaa Sites — Websites built for your local business",
    description:
      "We build and run websites for local businesses. Tell us about yours and we'll send a custom quote within 24 hours.",
    url: "https://cimaasites.ai",
    siteName: "Cimaa Sites",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cimaa Sites — Websites built for your local business",
    description:
      "We build and run websites for local businesses. Get a custom quote in 24 hours.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Cimaa Sites",
              description:
                "Professional website development and management for local businesses and community entrepreneurs.",
              url: "https://cimaasites.ai",
              email: "arsitechgroup@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressCountry: "US",
              },
              priceRange: "$$",
              parentOrganization: {
                "@type": "Organization",
                name: "Arsi Technology Group",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} ${outfit.variable} font-sans antialiased`}
      >
        {/* Animated page border — top */}
        <div className="fixed top-0 left-0 w-full h-[3px] z-[9999] pointer-events-none overflow-hidden">
          <div className="border-travel-top absolute top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-cimaa-yellow to-transparent" />
        </div>
        {/* Animated page border — bottom */}
        <div className="fixed bottom-0 left-0 w-full h-[3px] z-[9999] pointer-events-none overflow-hidden">
          <div className="border-travel-bottom absolute top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-cimaa-yellow to-transparent" />
        </div>
        {/* Animated page border — left */}
        <div className="fixed left-0 top-0 w-[3px] h-full z-[9999] pointer-events-none overflow-hidden">
          <div className="border-travel-left absolute left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-cimaa-yellow to-transparent" />
        </div>
        {/* Animated page border — right */}
        <div className="fixed right-0 top-0 w-[3px] h-full z-[9999] pointer-events-none overflow-hidden">
          <div className="border-travel-right absolute left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-cimaa-yellow to-transparent" />
        </div>

        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
