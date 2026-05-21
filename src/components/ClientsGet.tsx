"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const clientItems = [
  {
    title: "Google-Ready from Day One",
    description: "Automatic sitemap, meta tags, and structured data \u2014 Google can index your site immediately.",
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80",
  },
  {
    title: "Google Business Profile Guide",
    description: "Step-by-step setup guide inside every admin panel. The #1 driver of local business search traffic.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
  },
  {
    title: "SEO Health Score",
    description: "Real-time score showing clients exactly what to fix to rank higher on Google \u2014 no guesswork.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  },
  {
    title: "Direct Support",
    description: "Your clients text or email you directly. Not a chatbot. Not a ticket queue. A real person.",
    image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=600&q=80",
  },
];

export function ClientsGet() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900">
      <Container>
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl sm:text-6xl font-black text-center bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Everything your clients need to get found online
          </h2>
          <p className="text-xl font-semibold text-center text-violet-300 mb-12">
            Every Wajii Site comes with a full marketing toolkit &mdash; built
            in, no add-ons needed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {clientItems.map((item, i) => (
            <motion.div
              key={i}
              className="relative h-64 rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-bold text-lg leading-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-white/75 text-sm">
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
