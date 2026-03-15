"use client";

import { motion } from "framer-motion";
import { MessageSquare, Code2, Rocket } from "lucide-react";
import { Container } from "@/components/ui/Container";

const steps = [
  {
    icon: MessageSquare,
    title: "Tell us about your business",
    description: "Fill out a quick form about your business. Takes 10 minutes.",
  },
  {
    icon: Code2,
    title: "We build your site",
    description:
      "Our team builds your professional site in 3-5 days. You approve before it goes live.",
  },
  {
    icon: Rocket,
    title: "Go live + we handle the rest",
    description:
      "Your site launches. We monitor it 24/7 and handle any issues so you never have to.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Up and running in 3 steps
          </h2>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-amber-200" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="relative text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: i * 0.15,
              }}
              viewport={{ once: true }}
            >
              <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25">
                <step.icon size={28} />
              </div>
              <div className="mb-2 text-sm font-semibold text-blue-600">
                Step {i + 1}
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
