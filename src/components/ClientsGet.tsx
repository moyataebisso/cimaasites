"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const items = [
  {
    emoji: "\uD83D\uDD0D",
    title: "Google-Ready from Day One",
    description:
      "Automatic sitemap, meta tags, and structured data \u2014 Google can index your site immediately.",
  },
  {
    emoji: "\uD83D\uDCCD",
    title: "Google Business Profile Guide",
    description:
      "Step-by-step setup guide inside every admin panel. The #1 driver of local business search traffic.",
  },
  {
    emoji: "\uD83D\uDCCA",
    title: "SEO Health Score",
    description:
      "Real-time score showing clients exactly what to fix to rank higher on Google \u2014 no guesswork.",
  },
  {
    emoji: "\uD83D\uDCAC",
    title: "Direct Support",
    description:
      "Your clients text or email you directly. Not a chatbot. Not a ticket queue. A real person.",
  },
];

export function ClientsGet() {
  return (
    <section className="py-24 bg-slate-50">
      <Container>
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl sm:text-6xl font-black text-center bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Everything your clients need to get found online
          </h2>
          <p className="text-xl font-semibold text-center text-violet-400 mb-12">
            Every Cimaa Site comes with a full marketing toolkit &mdash; built
            in, no add-ons needed.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              className="flex gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                {item.emoji}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
