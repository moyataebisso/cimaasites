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
        <div className="mt-16 text-center px-4 mb-8">
          <p className="text-2xl sm:text-3xl font-black tracking-[0.2em] uppercase text-violet-500 mb-2 text-center">
            Trusted by businesses across our community
          </p>
          <h3 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
            Minnesota-started.{" "}
            <span style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Global reach.
            </span>
          </h3>
          <p className="text-slate-500 text-base mt-2 max-w-sm mx-auto">
            Born in Minneapolis. Built for communities everywhere.
          </p>
          <div className="h-1.5 w-32 mx-auto mt-6 rounded-full bg-gradient-to-r from-violet-600 via-blue-500 to-violet-600" />
        </div>
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
