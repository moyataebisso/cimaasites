import { Pricing } from "@/components/Pricing";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Cimaa Sites",
  description:
    "Simple, honest pricing. $599 setup + $299/mo. No hidden fees, no contracts, cancel anytime.",
};

export default function PricingPage() {
  return (
    <main className="pt-24">
      <Pricing />
      <ComparisonTable />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
