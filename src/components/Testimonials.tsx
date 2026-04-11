"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";

const testimonials = [
  {
    quote:
      "Cimaa Sites got our healthcare agency online in under a week. The admin dashboard is so easy \u2014 even our staff can update it. Best investment we've made.",
    name: "Fatima A.",
    business: "Entrusted Home Healthcare",
  },
  {
    quote:
      "I was paying thousands for a basic agency site. Cimaa built mine for $599, and now I pay $299/mo and they handle everything. My site loads faster too.",
    name: "Ahmed M.",
    business: "Rift Valley Transportation",
  },
  {
    quote:
      "They understood exactly what we needed \u2014 a professional site that serves our community. Setup was painless and support has been amazing.",
    name: "Hana T.",
    business: "CareConnect Live",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-slate-900">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            What our clients say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="rounded-2xl bg-slate-800 border border-slate-700 p-8 transition-all duration-200 hover:shadow-md hover:-translate-y-1"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-white font-bold">{t.name}</p>
                <p className="text-sm text-violet-400">{t.business}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
