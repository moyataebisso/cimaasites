"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";

const projects = [
  {
    name: "SaveYours",
    url: "https://saveyours.net",
    type: "CPR Training Platform",
    tag: "Healthcare",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "CareConnect Live",
    url: "https://careconnectlive.org",
    type: "Healthcare Platform",
    tag: "Healthcare",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Oromo Platform",
    url: "https://oromo-platform.vercel.app",
    type: "Community Platform",
    tag: "Community",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Entrusted Home Healthcare",
    url: null,
    type: "Healthcare Agency Website",
    tag: "Healthcare",
    color: "from-sky-500 to-blue-500",
  },
  {
    name: "Arsi Tech Group",
    url: "https://arsitechgroup.com",
    type: "Tech Company Website",
    tag: "Technology",
    color: "from-slate-600 to-slate-800",
  },
  {
    name: "portal.saveyours.net",
    url: null,
    type: "B2B Compliance Portal",
    tag: "SaaS \u00B7 Coming Soon",
    color: "from-amber-500 to-orange-500",
  },
];

export function Projects() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Built by Arsi Technology Group
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Every platform we&apos;ve built runs on the same stack powering
            Cimaa Sites.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              className="group rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <div
                className={`h-32 bg-gradient-to-br ${project.color} flex items-center justify-center`}
              >
                <span className="text-lg font-bold text-white/90">
                  {project.name}
                </span>
              </div>
              <div className="p-5">
                <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                  {project.tag}
                </span>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{project.type}</p>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Visit site
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
