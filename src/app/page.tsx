import { Hero } from "@/components/Hero";
import { EnterpriseTechStack } from "@/components/EnterpriseTechStack";
import { LogoBar } from "@/components/LogoBar";
import { HowItWorks } from "@/components/HowItWorks";
import { CommunitySection } from "@/components/CommunitySection";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { ClientsGet } from "@/components/ClientsGet";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { Projects } from "@/components/Projects";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <EnterpriseTechStack />
      <LogoBar />
      <HowItWorks />
      <CommunitySection />
      <FeaturesGrid />
      <ClientsGet />
      <ComparisonTable />
      <Pricing />
      <Testimonials />
      <Projects />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
