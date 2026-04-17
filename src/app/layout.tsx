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
  title: "Cimaa Sites — Professional Websites for Local Businesses | $299/mo",
  description:
    "Professional websites built for local businesses and community entrepreneurs. Done for you, $599 setup + $299/mo, 24/7 monitored. Enterprise tech stack at small business prices.",
  keywords:
    "affordable website, small business website, community business website, local business website, professional website, done for you website, website monitoring, Next.js website, Supabase website builder",
  openGraph: {
    title: "Cimaa Sites — Powerful Websites for Local Businesses",
    description:
      "We build and manage professional websites for local businesses. $599 setup + $299/mo with 24/7 monitoring and direct support.",
    url: "https://cimaasites.ai",
    siteName: "Cimaa Sites",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cimaa Sites — Powerful Websites for Local Businesses",
    description:
      "Professional websites for local businesses. $599 setup + $299/mo.",
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
              priceRange: "$49.99-$599",
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
        {/* Animated page border — top */}
        <div className="fixed top-0 left-0 w-full h-[3px] z-[9999] pointer-events-none overflow-hidden">
          <div className="border-travel-top absolute top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
        </div>
        {/* Animated page border — bottom */}
        <div className="fixed bottom-0 left-0 w-full h-[3px] z-[9999] pointer-events-none overflow-hidden">
          <div className="border-travel-bottom absolute top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
        {/* Animated page border — left */}
        <div className="fixed left-0 top-0 w-[3px] h-full z-[9999] pointer-events-none overflow-hidden">
          <div className="border-travel-left absolute left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-violet-500 to-transparent" />
        </div>
        {/* Animated page border — right */}
        <div className="fixed right-0 top-0 w-[3px] h-full z-[9999] pointer-events-none overflow-hidden">
          <div className="border-travel-right absolute left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>

        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
