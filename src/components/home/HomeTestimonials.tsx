"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Testimonial {
  quote: string;
  name: string;
  business: string;
  initials: string;
  accent: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Waji got our healthcare agency online in under a week. The admin dashboard is so easy — even our staff can update it. Best investment we've made.",
    name: "Fatima A.",
    business: "Entrusted Home Healthcare",
    initials: "FA",
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    quote:
      "I was paying thousands for a basic agency site. Waji rebuilt mine and now they handle everything. My site loads faster too.",
    name: "Ahmed M.",
    business: "Rift Valley Transportation",
    initials: "AM",
    accent: "bg-amber-100 text-amber-700",
  },
  {
    quote:
      "They understood exactly what we needed — a professional site that serves our community. Setup was painless and support has been amazing.",
    name: "Hana T.",
    business: "CareConnect Live",
    initials: "HT",
    accent: "bg-violet-100 text-violet-700",
  },
];

export function HomeTestimonials() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <Container>
        <SectionHeading
          eyebrow="Real customers"
          headline="Trusted by businesses"
          accent="that mean it."
          subtitle="A few words from local owners who let us run their site so they don't have to."
        />

        <div className="mt-14 grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-7 flex flex-col"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex gap-1 mb-4 text-cimaa-yellow">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={16} fill="currentColor" />
                ))}
              </div>
              <blockquote className="text-cimaa-text leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-cimaa-border flex items-center gap-3">
                <span
                  className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${t.accent}`}
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-cimaa-text">
                    {t.name}
                  </p>
                  <p className="text-xs text-cimaa-text-muted">{t.business}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
