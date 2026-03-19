"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How long does setup take?",
    a: "Most sites are live within 3-5 business days after you complete the intake form.",
  },
  {
    q: "Do I need any technical skills?",
    a: "None at all. We handle everything. You just tell us about your business.",
  },
  {
    q: "What if I want to make changes to my site?",
    a: "Log into your admin dashboard anytime to update content, photos, hours, and more. For design changes, just message us.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts. Cancel anytime with 30 days notice.",
  },
  {
    q: "What is the Developer plan exactly?",
    a: "You get the complete Next.js source code that powers all our client sites. Hook it up to your own Supabase and Vercel accounts and host it yourself. Perfect for developers or agencies who want to white-label it.",
  },
  {
    q: "Is my website data safe?",
    a: "Your data lives in your own Supabase database. We never share or sell your data.",
  },
  {
    q: "Do you work with non-English speaking businesses?",
    a: "Yes — we work with businesses across the country including the Oromo, Somali, and East African communities. We speak your language.",
  },
  {
    q: "What happens if my site goes down?",
    a: "Our monitoring catches it within 5 minutes and we fix it immediately — usually before you even notice.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200">
      <button
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base font-semibold text-slate-900 pr-4">{q}</span>
        <ChevronDown
          size={20}
          className={cn(
            "flex-shrink-0 text-slate-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-48 pb-5" : "max-h-0"
        )}
      >
        <p className="text-slate-600 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <section className="py-24 bg-slate-50">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Common questions
          </h2>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {faqs.map((faq) => (
            <FAQItem key={faq.q} {...faq} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
