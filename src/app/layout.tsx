import type { Metadata } from "next";
import { Inter, Manrope, Outfit } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WajiiJsonLd } from "@/components/WajiiJsonLd";
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
  metadataBase: new URL("https://wajiiwebsites.com"),
  title: {
    default:
      "Wajii Websites — Done-For-You Custom Websites for Small Businesses",
    template: "%s | Wajii Websites",
  },
  description:
    "Done-for-you custom websites for small businesses in Minneapolis and Minnesota. We build, host, and manage everything. Starting at $99/mo. No tech skills needed.",
  keywords: [
    "custom website Minneapolis",
    "managed website service Minnesota",
    "done for you website small business",
    "SpotHopper alternative",
    "restaurant website Minneapolis",
    "home care agency website MN",
    "Wajii Websites",
  ],
  openGraph: {
    title: "Wajii Websites — Custom Websites for Small Businesses",
    description:
      "We build and manage professional websites for small businesses. Starting at $99/mo.",
    url: "https://wajiiwebsites.com",
    siteName: "Wajii Websites",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wajii Websites — Custom Websites for Small Businesses",
    description:
      "We build and manage professional websites for small businesses. Starting at $99/mo.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${manrope.variable} ${outfit.variable} font-sans antialiased`}
      >
        <WajiiJsonLd />
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
