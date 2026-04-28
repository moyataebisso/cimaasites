import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HomeFinalCTA } from "@/components/home/HomeFinalCTA";

export const metadata: Metadata = {
  title: "About — Waji Professional Websites",
  description:
    "Waji Professional Websites is part of Arsi Technology Group, a Minneapolis-based studio building tools that help local businesses look great online without the headache.",
};

const values = [
  {
    title: "Built for owners, not developers",
    body: "Every word, every layout, every feature is designed for someone running a business — not configuring software.",
  },
  {
    title: "Real care, every site",
    body: "No template farms. Every Waji site is set up by people who pay attention to your industry, your customers, and your voice.",
  },
  {
    title: "Yours forever, always",
    body: "Your content, your data, your brand. If you ever leave us, you take everything with you.",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-cimaa-bg-tan pt-28 pb-16 md:pt-32 md:pb-20">
        <Container>
          <SectionHeading
            eyebrow="About Waji Professional Websites"
            headline="Built by people who get"
            accent="small business"
            subtitle="Waji Professional Websites is part of Arsi Technology Group, a Minneapolis-based studio building tools that help local businesses look great online without the headache."
          />
        </Container>
      </section>

      {/* Story */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-cimaa-green-light text-cimaa-green text-xs font-semibold uppercase tracking-wider">
                Our story
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl font-heading font-semibold text-cimaa-text leading-[1.1] tracking-tight">
                Built because small business deserved better.
              </h2>
            </div>
            <div className="space-y-5 text-lg text-cimaa-text-muted leading-relaxed">
              <p>
                Most website platforms are built for developers. Waji is
                built for the salon owner, the restaurant manager, the
                trucking company that needs a website but doesn&apos;t have
                time to figure out hosting, plugins, and SEO.
              </p>
              <p>
                We built Waji because we kept watching small businesses pay
                agencies thousands for sites they couldn&apos;t update, on
                platforms they didn&apos;t understand. There had to be a
                better way.
              </p>
              <p>
                So we built one. Pick a layout that fits your business. We
                handle the rest. Your site goes live in minutes — hosted,
                secured, and monitored 24/7. When something needs to change,
                you tell us, and we change it.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-cimaa-bg-tan py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="What we believe"
            headline="Three things we hold"
            accent="non-negotiable."
          />
          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl bg-white border border-cimaa-border shadow-sm p-7"
              >
                <h3 className="font-heading text-xl font-semibold text-cimaa-text">{v.title}</h3>
                <p className="mt-3 text-cimaa-text-muted leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-cimaa-green-light text-cimaa-green text-xs font-semibold uppercase tracking-wider">
              The team behind it
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-heading font-semibold text-cimaa-text leading-[1.1] tracking-tight">
              Built by Arsi Technology Group
            </h2>
            <p className="mt-6 text-lg text-cimaa-text-muted leading-relaxed">
              Arsi Technology Group LLC is a Minneapolis-based studio that
              builds software for businesses, communities, and the people who
              run them.
            </p>
            <p className="mt-4 text-lg text-cimaa-text-muted leading-relaxed">
              Beyond Waji, Arsi Technology Group builds platforms for
              healthcare, transportation, community organizations, and
              education — all on the same trusted infrastructure.
            </p>
            <div className="mt-8">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-cimaa-green hover:text-emerald-800 transition-colors"
              >
                See our work
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <HomeFinalCTA
        headline="Ready to talk about"
        accent="your business?"
        subheadline="Tell us a few sentences about what you do. We'll send a quote within 24 hours."
      />
    </main>
  );
}
