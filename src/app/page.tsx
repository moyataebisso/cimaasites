import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureBlock } from "@/components/ui/FeatureBlock";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeLogoBar } from "@/components/home/HomeLogoBar";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";
import { HomeFinalCTA } from "@/components/home/HomeFinalCTA";
import { CraftBand } from "@/components/home/CraftBand";
import {
  LayoutPickerVisual,
  SearchResultVisual,
  AnalyticsVisual,
} from "@/components/home/FeatureVisuals";

export default function Home() {
  return (
    <main>
      <HomeHero />
      <HomeLogoBar />

      <section id="how-it-works" className="pt-12 md:pt-16 bg-cimaa-bg-tan">
        <Container>
          <SectionHeading
            eyebrow="One platform"
            headline="One platform to launch, run, and"
            accent="grow your website."
            subtitle="From the first quote to the first thousand visitors — Cimaa Sites covers the parts most owners would rather not deal with."
          />
        </Container>
      </section>

      <FeatureBlock
        eyebrow="Effortless launch"
        headline="Launch a website without lifting a finger"
        bullets={[
          {
            label: "Layouts built for your industry",
            detail:
              "restaurant, salon, fleet, healthcare, community, home services.",
          },
          {
            label: "Polished site live in 5–10 minutes",
            detail: "with hand-crafted content that fits your business.",
          },
          {
            label: "We handle hosting, security, and updates",
            detail: "so you don't have to think about any of it.",
          },
        ]}
        visual={<LayoutPickerVisual />}
        imageSide="right"
        ctaLabel="See how it works"
        ctaHref="/pricing"
      />

      <FeatureBlock
        eyebrow="Effortless growth"
        headline="Get found by more local customers"
        bullets={[
          {
            label: "Rank higher on Google",
            detail: "with built-in SEO baked into every layout.",
          },
          {
            label: "Earn more 5-star reviews",
            detail:
              "and surface them on your homepage where new customers see them first.",
          },
          {
            label: "Look as polished as the big chains",
            detail: "without the agency budget.",
          },
        ]}
        visual={<SearchResultVisual />}
        imageSide="left"
        className="bg-white"
        frame="plain"
        ctaLabel="See the difference"
      />

      <FeatureBlock
        eyebrow="Always remembered"
        headline="Stay top-of-mind with smart tools"
        bullets={[
          {
            label: "Track visits, leads, and bookings",
            detail: "in a single dashboard you actually understand.",
          },
          {
            label: "See what's working",
            detail: "and adjust without guessing or hiring an analyst.",
          },
          {
            label: "Built-in tools to keep customers coming back",
            detail: "from review prompts to email follow-ups.",
          },
        ]}
        visual={<AnalyticsVisual />}
        imageSide="right"
        ctaLabel="Talk to us"
      />

      <CraftBand />

      <HomeTestimonials />

      <HomeFinalCTA />
    </main>
  );
}
