"use client";

import { motion } from "framer-motion";
import { MessageSquare, Code2, Rocket } from "lucide-react";
import { Container } from "@/components/ui/Container";

const steps = [
  {
    icon: MessageSquare,
    title: "Tell us about your business",
    description: "Fill out a quick form about your business. Takes 10 minutes.",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=80",
  },
  {
    icon: Code2,
    title: "We build your site",
    description:
      "Our team builds your professional site in 3-5 days. You approve before it goes live.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80",
  },
  {
    icon: Rocket,
    title: "Go live + we handle the rest",
    description:
      "Your site launches. We monitor it 24/7 and handle any issues so you never have to.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
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
          <h2>
            <span className="block text-sm font-semibold tracking-widest text-violet-500 uppercase mb-3">
              Simple process
            </span>
            <span className="block text-5xl sm:text-6xl font-black text-slate-900">
              Up and running{" "}
            </span>
            <span
              className="block text-5xl sm:text-6xl font-black italic"
              style={{
                fontFamily: 'Georgia, serif',
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              in 3 steps.
            </span>
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
              <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-xl mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.image}
                  alt={step.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-violet-600/70 flex items-center justify-center">
                  <step.icon size={28} className="text-white" />
                </div>
              </div>
              <div className="text-xs font-black tracking-widest uppercase text-violet-500 mb-2">
                Step {i + 1}
              </div>
              <h3
                className="text-2xl font-black text-slate-900 mb-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
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
