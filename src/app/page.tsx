import { Hero } from "@/components/Hero";
import { LogoBar } from "@/components/LogoBar";
import { HowItWorks } from "@/components/HowItWorks";
import { CommunitySection } from "@/components/CommunitySection";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CommunityPromise } from "@/components/CommunityPromise";
import { FinalCTA } from "@/components/FinalCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <LogoBar />
      <HowItWorks />
      <CommunitySection />
      <FeaturesGrid />
      <ComparisonTable />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CommunityPromise />
      <FinalCTA />
    </main>
  );
}
