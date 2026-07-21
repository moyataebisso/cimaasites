import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HomeFinalCTA } from "@/components/home/HomeFinalCTA";

export const metadata: Metadata = {
  title: "Wajii vs SpotHopper — Restaurant Website Comparison",
  description:
    "Compare Wajii Websites vs SpotHopper for your restaurant. See pricing, ownership, SEO, and support differences side by side.",
};

interface Row {
  feature: string;
  wajii: string;
  spothopper: string;
  wajiiAdvantage?: boolean;
}

const comparison: Row[] = [
  {
    feature: "Monthly Cost",
    wajii: "$99–399/mo",
    spothopper: "$249–499/mo",
    wajiiAdvantage: true,
  },
  {
    feature: "Setup Fee",
    wajii: "One-time flat fee",
    spothopper: "$1,500–3,000 setup",
    wajiiAdvantage: true,
  },
  {
    feature: "Site Ownership",
    wajii: "You own everything",
    spothopper: "SpotHopper owns the site",
    wajiiAdvantage: true,
  },
  {
    feature: "Custom Domain",
    wajii: "Yes — yours forever",
    spothopper: "Yes, but tied to platform",
  },
  {
    feature: "SEO Control",
    wajii: "Full — sitemap, meta, JSON-LD included",
    spothopper: "Limited — platform controls your SEO settings",
    wajiiAdvantage: true,
  },
  {
    feature: "Design",
    wajii: "Custom per restaurant",
    spothopper: "Template-based",
    wajiiAdvantage: true,
  },
  {
    feature: "Support",
    wajii: "Direct — text or email",
    spothopper: "Ticketing system",
    wajiiAdvantage: true,
  },
  {
    feature: "Contract",
    wajii: "Cancel anytime",
    spothopper: "Annual contract",
    wajiiAdvantage: true,
  },
  {
    feature: "Demo site risk",
    wajii: "Never — single domain",
    spothopper: "Demo URLs in production observed",
    wajiiAdvantage: true,
  },
];

export default function CompareSpotHopperPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-cimaa-bg-tan pt-28 pb-16 md:pt-32 md:pb-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-cimaa-green-light text-cimaa-green text-xs font-semibold uppercase tracking-wider">
              Comparison
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-heading font-semibold leading-[1.05] tracking-tight text-cimaa-text">
              Wajii Websites vs.{" "}
              <span className="text-cimaa-green">SpotHopper</span>
            </h1>
            <p className="mt-6 text-lg text-cimaa-text-muted leading-relaxed">
              If you are paying $249–499/mo for SpotHopper, here is what you are
              — and are not — getting.
            </p>
          </div>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="max-w-5xl mx-auto rounded-2xl border border-cimaa-border overflow-hidden shadow-sm">
            {/* Header row */}
            <div className="grid grid-cols-3 bg-cimaa-bg-tan">
              <div className="px-4 py-4 sm:px-6 sm:py-5 font-heading text-sm sm:text-base font-semibold text-cimaa-text">
                Feature
              </div>
              <div className="px-4 py-4 sm:px-6 sm:py-5 font-heading text-sm sm:text-base font-semibold text-cimaa-green border-l border-cimaa-border">
                Wajii Websites
              </div>
              <div className="px-4 py-4 sm:px-6 sm:py-5 font-heading text-sm sm:text-base font-semibold text-cimaa-text-muted border-l border-cimaa-border">
                SpotHopper
              </div>
            </div>

            {/* Data rows */}
            {comparison.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 border-t border-cimaa-border ${
                  i % 2 === 0 ? "bg-white" : "bg-cimaa-bg-tan/30"
                }`}
              >
                <div className="px-4 py-4 sm:px-6 sm:py-5 text-sm font-semibold text-cimaa-text">
                  {row.feature}
                </div>
                <div className="px-4 py-4 sm:px-6 sm:py-5 border-l border-cimaa-border">
                  <div className="flex items-start gap-2">
                    {row.wajiiAdvantage && (
                      <Check
                        size={16}
                        strokeWidth={3}
                        className="shrink-0 mt-0.5 text-cimaa-green"
                      />
                    )}
                    <span className="text-sm text-cimaa-text leading-relaxed">
                      {row.wajii}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-4 sm:px-6 sm:py-5 border-l border-cimaa-border">
                  <div className="flex items-start gap-2">
                    {row.wajiiAdvantage && (
                      <X
                        size={16}
                        strokeWidth={3}
                        className="shrink-0 mt-0.5 text-cimaa-text-subtle"
                      />
                    )}
                    <span className="text-sm text-cimaa-text-muted leading-relaxed">
                      {row.spothopper}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Migration CTA */}
      <section className="bg-cimaa-bg-tan py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-cimaa-text leading-tight">
              Ready to switch?
            </h2>
            <p className="mt-5 text-lg text-cimaa-text-muted leading-relaxed">
              We will migrate your content and launch in 7 days.
            </p>
            <div className="mt-8">
              <Button href="/contact" variant="primary" size="lg" withArrow>
                Get a Free Site Review
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <HomeFinalCTA
        headline="Own your restaurant site."
        accent="Cancel anytime."
      />
    </main>
  );
}
