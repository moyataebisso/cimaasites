"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const trustItems = [
  "No engineering team needed",
  "No server maintenance",
  "Just $19/mo and it's all handled for you",
];

export function EnterpriseTechStack() {
  return (
    <section className="py-24 bg-white">
      <Container className="max-w-[1100px]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Badge variant="blue">&#10022; Built for real businesses. No tech skills needed.</Badge>
        </motion.div>

        <motion.h2
          className="mt-6 text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Your business, online —{" "}
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            built and managed for you
          </span>
        </motion.h2>

        <motion.p
          className="mt-4 text-center text-lg text-slate-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Fortune 500 companies pay millions of dollars for engineers to build on
          this exact stack. You get it for $19/mo — fully built, monitored, and
          managed for you.
        </motion.p>

        {/* Trusted brands heading */}
        <motion.p
          className="mt-14 text-center text-sm font-medium text-slate-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Trusted by businesses everywhere
        </motion.p>

        {/* Brand tiles grid */}
        <motion.div
          className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            { emoji: "\uD83D\uDCB3", name: "Stripe", tagline: "Processes our payments" },
            { emoji: "\uD83D\uDC19", name: "GitHub", tagline: "Hosts our code" },
            { emoji: "\uD83D\uDD0D", name: "Google", tagline: "Found through Search" },
            { emoji: "\uD83D\uDCDD", name: "Notion", tagline: "Teams run on it" },
          ].map((brand) => (
            <div
              key={brand.name}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm"
            >
              <span className="text-lg">{brand.emoji}</span>
              <p className="text-sm font-semibold text-slate-900 mt-1">{brand.name}</p>
              <p className="text-xs text-slate-500">{brand.tagline}</p>
            </div>
          ))}
        </motion.div>

        {/* Comparison callout box */}
        <motion.div
          className="mt-16 rounded-2xl bg-gradient-to-br from-blue-950 to-violet-900 p-8 sm:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                They spent millions building it.
              </h3>
              <p className="mt-4 text-white/80 leading-relaxed">
                Netflix spent $1M+ on infrastructure.
                <br />
                Airbnb spent $2M+ on their stack.
                <br />
                Enterprise companies pay $500K/year for engineering teams to
                maintain this.
              </p>
            </div>

            <div className="text-center md:text-right">
              <span className="text-2xl line-through text-white/40">
                $500,000/year
              </span>
              <div className="text-6xl sm:text-7xl font-black text-white leading-none mt-2">
                $19
                <span className="text-2xl font-normal">/mo</span>
              </div>
              <p className="mt-3 text-white/70">
                Same stack. Built for you. Monitored 24/7. You own everything.
              </p>
              <Button
                href="/contact"
                variant="white"
                className="mt-6"
                size="lg"
              >
                Get Started for $19/mo &rarr;
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bottom trust line */}
        <motion.div
          className="mt-12 grid grid-cols-3 gap-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {trustItems.map((item) => (
            <div key={item} className="flex items-center justify-center gap-2">
              <Check size={16} className="text-green-600 flex-shrink-0" />
              <span className="text-sm text-slate-500">{item}</span>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
