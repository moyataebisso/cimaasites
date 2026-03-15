import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Cimaa Sites — Websites for Minneapolis Community Businesses | $19/mo",
  description:
    "Professional websites built for Minneapolis small businesses and the East African community. Done for you, $19/mo, 24/7 monitored. Serving Oromo, Somali, and Ethiopian businesses.",
  keywords:
    "website Minneapolis, Oromo business website, Somali business website, East African community website, small business website Minneapolis, affordable website Minnesota",
  openGraph: {
    title: "Cimaa Sites — Powerful Websites for $19/mo",
    description:
      "We build and manage professional websites for local businesses in Minneapolis. Starting at $19/mo with 24/7 monitoring and direct support.",
    url: "https://cimaasites.ai",
    siteName: "Cimaa Sites",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cimaa Sites — Powerful Websites for $19/mo",
    description:
      "Professional websites for local businesses. Starting at $19/mo.",
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
                "Professional website development and management for local businesses in Minneapolis.",
              url: "https://cimaasites.ai",
              email: "arsitechgroup@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Minneapolis",
                addressRegion: "MN",
                addressCountry: "US",
              },
              priceRange: "$19-$49.99",
              parentOrganization: {
                "@type": "Organization",
                name: "Arsi Technology Group",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
