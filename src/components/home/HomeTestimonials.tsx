"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  location: string;
  initials: string;
  accent: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Wajii got our health services agency online in under a week. The site looks completely professional, it shows up on Google, and I can actually update it myself. Best investment for our agency.",
    name: "Furtu Anota, DNP, APRN",
    title: "Founder, El Roi Health Services LLC",
    location: "Minneapolis, MN",
    initials: "FA",
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    quote:
      "We needed a website that actually represented what we do. Wajii understood our mission from day one. The site is clean, professional, and our families can find us on Google now.",
    name: "Korme Koji",
    title: "CEO, Entrusted Care Residence",
    location: "Saint Paul, MN",
    initials: "KK",
    accent: "bg-rose-100 text-rose-700",
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

        <div className="mt-14 grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
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
              <blockquote className="text-cimaa-text leading-relaxed flex-1 italic">
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
                  <p className="text-xs text-cimaa-text-muted">{t.title}</p>
                  <p className="text-xs text-cimaa-text-subtle">{t.location}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
