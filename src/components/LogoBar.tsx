"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const clients = [
  { name: "CareConnect Live", type: "Healthcare" },
  { name: "SaveYours", type: "Training & Education" },
  { name: "Entrusted Home Healthcare", type: "Healthcare" },
  { name: "Rift Valley Transportation", type: "Transportation" },
  { name: "Your business", type: "Coming soon \u2192" },
];

export function LogoBar() {
  return (
    <section className="py-16 border-y border-slate-100 bg-slate-50/50">
      <Container>
        <motion.p
          className="text-center text-sm font-medium text-slate-500 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Trusted by businesses across our community
        </motion.p>
      </Container>
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...clients, ...clients].map((client, i) => (
            <div
              key={i}
              className="mx-4 flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-medium text-sm text-slate-700">
                {client.name}
              </span>
              <span className="text-slate-400 text-xs">· {client.type}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
