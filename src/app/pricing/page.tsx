import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HomeFinalCTA } from "@/components/home/HomeFinalCTA";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "How It Works — Cimaa Sites",
  description:
    "What you get with Cimaa Sites. Tell us about your business and we'll send a custom quote within 24 hours.",
};

interface Tier {
  name: string;
  bestFor: string;
  description: string;
  features: string[];
  highlight?: boolean;
  ctaLabel?: string;
}

const tiers: Tier[] = [
  {
    name: "Starter",
    bestFor: "Solo owners and family-run shops",
    description:
      "Everything you need to look polished online and start collecting leads.",
    features: [
      "Custom industry layout",
      "Hand-crafted copy that fits your business",
      "Mobile-first, SEO-optimized",
      "Hosting + security included",
      "Direct support from a real person",
    ],
  },
  {
    name: "Growth",
    bestFor: "Multi-location and growing teams",
    description:
      "Everything in Starter, plus tools to bring more customers back.",
    features: [
      "Everything in Starter",
      "Bookings, leads, and reviews dashboard",
      "Email follow-up automation",
      "Custom domain + branded email",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Custom",
    bestFor: "Anyone with specific needs",
    description:
      "Built around your workflow — integrations, custom flows, and your own data.",
    features: [
      "Everything in Growth",
      "Custom integrations (POS, CRM, etc.)",
      "Multi-page custom design",
      "Source code ownership available",
      "Dedicated account manager",
    ],
  },
];

export default function PricingPage() {
  return (
    <main>
      <section className="bg-cimaa-bg-tan pt-28 pb-16 md:pt-32 md:pb-20">
        <Container>
          <SectionHeading
            eyebrow="What you get"
            headline="What you get with"
            accent="Cimaa Sites."
            subtitle="Every business is different — so instead of one-size-fits-all pricing, we send you a custom quote within 24 hours."
          />
        </Container>
      </section>

      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <TierCard key={tier.name} tier={tier} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-cimaa-bg-tan py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-cimaa-green-light text-cimaa-green text-xs font-semibold uppercase tracking-wider">
              Why no prices?
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-cimaa-text leading-tight">
              Every business is different. Tell us about yours and we&apos;ll
              send you a quote in 24 hours.
            </h2>
            <p className="mt-5 text-cimaa-text-muted">
              We&apos;d rather build something that fits than sell a tier you
              don&apos;t need. Quick form, real human reads it, real human
              writes back.
            </p>
            <div className="mt-8">
              <Button href="/contact" variant="primary" size="lg" withArrow>
                Get a Quote
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <HomeFinalCTA
        headline="Tell us about your business and"
        accent="we'll send you a quote."
        buttonText="Get a Quote"
      />
    </main>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  return (
    <div
      className={cn(
        "rounded-2xl p-7 flex flex-col h-full ring-1 transition-all",
        tier.highlight
          ? "ring-2 ring-cimaa-green bg-white shadow-lg shadow-emerald-900/5"
          : "ring-cimaa-border bg-white hover:shadow-md"
      )}
    >
      {tier.highlight && (
        <span className="inline-block self-start px-3 py-1 rounded-full bg-cimaa-green-light text-cimaa-green text-xs font-semibold uppercase tracking-wider mb-4">
          Most popular
        </span>
      )}
      <h3 className="text-2xl font-bold text-cimaa-text">{tier.name}</h3>
      <p className="mt-1 text-sm text-cimaa-text-muted">
        Best for: <span className="text-cimaa-text">{tier.bestFor}</span>
      </p>
      <p className="mt-4 text-cimaa-text-muted leading-relaxed">
        {tier.description}
      </p>

      <ul className="mt-6 space-y-3 flex-1">
        {tier.features.map((feature) => (
          <li key={feature} className="flex gap-2.5 text-sm text-cimaa-text">
            <Check
              size={16}
              strokeWidth={3}
              className="shrink-0 mt-0.5 text-cimaa-green"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7">
        <Button
          href="/contact"
          variant={tier.highlight ? "primary" : "outline"}
          size="md"
          className="w-full"
          withArrow
        >
          Get a Quote
        </Button>
      </div>
    </div>
  );
}
