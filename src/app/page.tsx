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
      <div className="h-2 w-full mt-12 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600" />
      <div className="bg-gradient-to-b from-violet-50 to-white">
        <LogoBar />
      </div>
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
