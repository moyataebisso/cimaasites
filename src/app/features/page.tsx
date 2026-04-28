import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HomeFinalCTA } from "@/components/home/HomeFinalCTA";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything you need to launch, run, and grow a website for your local business — included with every Waji site.",
};

interface CategoryDef {
  eyebrow: string;
  headline: string;
  blurb: string;
  features: string[];
}

const categories: CategoryDef[] = [
  {
    eyebrow: "Launch",
    headline: "Get online without the lift",
    blurb:
      "From the moment you say go, we have the layout, copy, and photos ready for your industry.",
    features: [
      "Industry-specific layouts: Restaurant, Salon, Healthcare, Fleet, Community, Home Services",
      "Hand-crafted copy that fits your business",
      "Custom photography sourced for your industry",
      "Mobile-friendly out of the box",
      "Live in 5–10 minutes after sign-off",
    ],
  },
  {
    eyebrow: "Grow",
    headline: "Bring more customers in",
    blurb:
      "Every site is built to be found. SEO, performance, and lead capture come standard.",
    features: [
      "Built-in SEO that gets you found on Google",
      "Fast hosting on global infrastructure",
      "Lead capture forms ready out of the box",
      "Reviews and testimonials section",
      "Social media integration",
    ],
  },
  {
    eyebrow: "Run",
    headline: "We handle the boring parts",
    blurb:
      "You shouldn't be patching plugins and renewing certificates. That's our job.",
    features: [
      "One-click content updates",
      "24/7 uptime monitoring",
      "Automatic security updates",
      "Real human support — text or email anytime",
      "Backups, hosting, domain — all included",
    ],
  },
  {
    eyebrow: "Trust",
    headline: "Yours, always",
    blurb:
      "Your content, your customers, your brand. Waji runs on infrastructure that doesn't lock you in.",
    features: [
      "Your content, your data — yours forever",
      "SSL secured and GDPR-friendly",
      "Built on infrastructure trusted by thousands of businesses",
      "Transparent about what we do (and don't do) with your information",
      "Easy export anytime — no lock-in",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-cimaa-bg-tan pt-28 pb-16 md:pt-32 md:pb-20">
        <Container>
          <SectionHeading
            eyebrow="Features"
            headline="Everything you need to launch, run &"
            accent="grow"
            subtitle="Every Waji site comes with the tools and care you'd expect from a high-end agency build — without the agency timeline or budget."
          />
        </Container>
      </section>

      {categories.map((cat, i) => (
        <CategoryBlock
          key={cat.eyebrow}
          category={cat}
          alternate={i % 2 === 1}
        />
      ))}

      <HomeFinalCTA
        headline="Want to see this all in"
        accent="action?"
        subheadline="Tell us about your business. We'll show you exactly how it comes together."
      />
    </main>
  );
}

function CategoryBlock({
  category,
  alternate,
}: {
  category: CategoryDef;
  alternate: boolean;
}) {
  return (
    <section
      className={cn(
        "py-16 md:py-20",
        alternate ? "bg-cimaa-bg-tan" : "bg-white"
      )}
    >
      <Container>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-cimaa-green-light text-cimaa-green text-xs font-semibold uppercase tracking-wider">
              {category.eyebrow}
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-heading font-semibold text-cimaa-text leading-[1.1] tracking-tight">
              {category.headline}
            </h2>
            <p className="mt-5 text-lg text-cimaa-text-muted leading-relaxed">
              {category.blurb}
            </p>
          </div>
          <ul className="space-y-4">
            {category.features.map((f) => (
              <li
                key={f}
                className="flex gap-3 rounded-xl bg-white border border-cimaa-border shadow-sm px-5 py-4"
              >
                <span className="shrink-0 mt-0.5 h-6 w-6 rounded-full bg-cimaa-green-light text-cimaa-green flex items-center justify-center">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className="text-cimaa-text">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
