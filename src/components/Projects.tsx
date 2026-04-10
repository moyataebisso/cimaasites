"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const projects = [
  {
    name: "SaveYours",
    url: "https://saveyours.net",
    description: "CPR Training Platform",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
  },
  {
    name: "CareConnect Live",
    url: "https://careconnectlive.org",
    description: "Healthcare Platform",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
  },
  {
    name: "Oromo Platform",
    url: "https://oromo-platform.vercel.app",
    description: "Community Platform",
    category: "Community",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
  },
  {
    name: "Entrusted Home Healthcare",
    url: null,
    description: "Healthcare Agency Website",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1576765608622-067973a79f53?w=600&q=80",
  },
  {
    name: "Arsi Tech Group",
    url: "https://arsitechgroup.com",
    description: "Tech Company Website",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
  },
  {
    name: "portal.saveyours.net",
    url: null,
    description: "B2B Compliance Portal",
    category: "SaaS \u00B7 Coming Soon",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
];

export function Projects() {
  return (
    <section className="py-24 bg-slate-900">
      <Container>
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Built by Arsi Technology Group
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Every platform we&apos;ve built runs on the same stack powering
            Cimaa Sites.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              className="relative rounded-2xl overflow-hidden h-64 group cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
                  {project.category}
                </span>
                <h3 className="text-white font-bold text-xl mt-1">
                  {project.name}
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  {project.description}
                </p>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 text-sm font-medium mt-2 inline-block hover:text-violet-300"
                  >
                    Visit site &rarr;
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
