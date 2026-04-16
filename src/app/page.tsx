import { Hero } from "@/components/Hero";
import { LogoBar } from "@/components/LogoBar";
import { HowItWorks } from "@/components/HowItWorks";
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
      <LogoBar />
      <HowItWorks />
      <FeaturesGrid />
      <ComparisonTable />
      <ClientsGet />
      <Pricing />
      <Testimonials />
      <Projects />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
