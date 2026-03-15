"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const features = [
  {
    emoji: "\u{1F680}",
    title: "Edge Performance",
    description:
      "Hosted on Vercel's global edge network. Faster than 99% of small business sites.",
  },
  {
    emoji: "\u{1F5C4}\uFE0F",
    title: "You Own Your Data",
    description:
      "Your database. Your files. Your data. Not locked into our platform.",
  },
  {
    emoji: "\u{1F4CA}",
    title: "24/7 Monitoring",
    description:
      "We watch your site every 5 minutes. You get alerted before your customers do.",
  },
  {
    emoji: "\u{1F3A8}",
    title: "20+ Themes",
    description:
      "Professional themes designed for real businesses. Switch anytime.",
  },
  {
    emoji: "\u{1F527}",
    title: "All Modules Ready",
    description:
      "Booking, store, blog, reviews — all built in. Enable with one click.",
  },
  {
    emoji: "\u{1F4AC}",
    title: "Real Support",
    description:
      "Text or email us directly. Not a ticket system. Not a chatbot.",
  },
  {
    emoji: "\u{1F512}",
    title: "Security Built In",
    description:
      "Rate limiting, RLS policies, webhook verification — enterprise security.",
  },
  {
    emoji: "\u{1F9D1}\u200D\u{1F4BB}",
    title: "Developer Option",
    description:
      "Want the code? Take it. $49.99 one-time for the full source.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-slate-50">
      <Container>
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Compare us to building it yourself or using DIY platforms
          </p>
        </motion.div>

        <div className="mt-16 grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Built{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                different.
              </span>
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              Every Cimaa site runs on the same stack that powers billion-dollar
              startups: Next.js, Supabase, and Vercel. Your business gets its
              own database, its own deployment, and its own admin dashboard.
            </p>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              That means your site is faster than WordPress, more powerful than
              Wix, and you actually own your data. No lock-in. No surprises.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: i * 0.05,
                }}
                viewport={{ once: true }}
              >
                <div className="text-2xl mb-3">{feature.emoji}</div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  {feature.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
