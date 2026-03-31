"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const features = [
  {
    emoji: "\u{1F680}",
    title: "Fast & Reliable",
    description: "Your site loads in under 1 second, worldwide.",
  },
  {
    emoji: "\u{1F4CA}",
    title: "We Watch It 24/7",
    description: "Get alerted the moment anything goes wrong.",
  },
  {
    emoji: "\u{1F3A8}",
    title: "50 Professional Themes",
    description: "Pick your look. Switch anytime.",
  },
  {
    emoji: "\u{1F527}",
    title: "Everything Built In",
    description: "Booking, store, blog, reviews \u2014 one click to turn on.",
  },
  {
    emoji: "\u{1F4AC}",
    title: "Real Human Support",
    description: "Text or email us directly. No bots, no tickets.",
  },
  {
    emoji: "\u{1F512}",
    title: "Secure by Default",
    description: "Enterprise-level security, handled for you.",
  },
  {
    emoji: "\u{1F4C8}",
    title: "Built-In SEO",
    description: "Show up on Google. We handle the technical setup.",
  },
  {
    emoji: "\u{1F9D1}\u200D\u{1F4BB}",
    title: "Developer Option",
    description: "Want the code? Take it for $49.99 one-time.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-slate-50">
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Everything included at $19/mo
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            No extras. No surprises.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: i * 0.05,
              }}
              viewport={{ once: true }}
            >
              <span className="text-2xl">{feature.emoji}</span>
              <h4 className="font-semibold text-slate-900 mt-2">
                {feature.title}
              </h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
