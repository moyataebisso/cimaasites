"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const projects = [
  {
    name: "CareConnect Live",
    category: "Healthcare",
    description:
      "Professional healthcare platform connecting caregivers with families. Features appointment booking, service listings, and secure messaging.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "SaveYours",
    category: "Community",
    description:
      "Community-focused platform helping local businesses save and grow. Includes member directory, events, and resource sharing.",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Entrusted Home Healthcare",
    category: "Healthcare",
    description:
      "Home healthcare agency website with service pages, staff profiles, referral forms, and insurance information.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Rift Valley Transportation",
    category: "Transportation",
    description:
      "Transportation company website with online booking, fleet showcase, service areas, and real-time availability.",
    color: "from-amber-500 to-orange-500",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
  viewport: { once: true },
};

export default function PortfolioPage() {
  return (
    <main className="pt-24">
      <section className="py-24">
        <Container>
          <motion.div className="text-center max-w-3xl mx-auto" {...fadeUp}>
            <Badge variant="blue">Portfolio</Badge>
            <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-slate-900">
              Real sites for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                real businesses
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Every site we build runs on the same enterprise stack. Here are
              some of the businesses we&apos;ve helped get online.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="grid sm:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={project.name}
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center`}
                >
                  <span className="text-3xl font-bold text-white/90">
                    {project.name}
                  </span>
                </div>
                <div className="p-8">
                  <Badge>{project.category}</Badge>
                  <h3 className="mt-3 text-xl font-bold text-slate-900">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600">
                    <span>View project</span>
                    <ExternalLink size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-16 text-center" {...fadeUp}>
            <p className="text-lg text-slate-600 mb-6">
              Want to see your business here?
            </p>
            <Button href="/contact" size="lg">
              Get Started Today
            </Button>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}
