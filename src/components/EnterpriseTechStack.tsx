"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const techStack = ["Next.js", "Supabase", "Vercel", "Stripe", "Resend"];

const companies = [
  {
    name: "Vercel",
    description: "Frontend cloud platform",
    stat: "$3.25 Billion valuation",
    connection: "Powers our hosting infrastructure",
  },
  {
    name: "Linear",
    description: "Project management for software teams",
    stat: "$400M+ valuation",
    connection: "Built on Next.js — same as your site",
  },
  {
    name: "Notion",
    description: "All-in-one workspace",
    stat: "10M+ users worldwide",
    connection: "Uses the same React/Next.js foundation",
  },
  {
    name: "Cal.com",
    description: "Scheduling infrastructure",
    stat: "Millions of bookings processed",
    connection: "Built entirely on Next.js + PostgreSQL",
  },
  {
    name: "GitHub",
    description: "World's largest code platform",
    stat: "$7.5 Billion acquisition",
    connection: "Uses the same Postgres database layer",
  },
  {
    name: "Twitch",
    description: "Live streaming platform",
    stat: "35M+ daily visitors",
    connection: "Enterprise-grade infrastructure",
  },
  {
    name: "Stripe",
    description: "Global payments infrastructure",
    stat: "$65 Billion valuation",
    connection: "Powers our payment processing",
  },
  {
    name: "Supabase",
    description: "Open source Firebase alternative",
    stat: "$200M+ raised, 1M+ developers",
    connection: "Powers your database and storage",
  },
  {
    name: "OpenAI",
    description: "World's leading AI company",
    stat: "$157 Billion valuation",
    connection: "Built on the same cloud infrastructure",
  },
];

const trustItems = [
  "No engineering team needed",
  "No DevOps required",
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
          <Badge variant="blue">&#9889; Enterprise-grade technology</Badge>
        </motion.div>

        <motion.h2
          className="mt-6 text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const, delay: 0.1 }}
          viewport={{ once: true }}
        >
          The same tech stack powering{" "}
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            billion-dollar companies
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

        {/* Tech logos row */}
        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {techStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white border border-slate-700"
            >
              <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs font-bold">
                {tech[0]}
              </span>
              {tech}
            </span>
          ))}
        </motion.div>

        {/* Companies heading */}
        <motion.p
          className="mt-16 text-center text-sm font-medium text-slate-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Companies built on the same technology:
        </motion.p>

        {/* Company cards grid */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company, i) => (
            <motion.div
              key={company.name}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut" as const,
                delay: i * 0.08,
              }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold text-slate-900">
                {company.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {company.description}
              </p>
              <p className="mt-3 text-sm font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {company.stat}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {company.connection}
              </p>
            </motion.div>
          ))}
        </div>

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
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
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
