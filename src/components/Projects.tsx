"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

type Project = {
  name: string;
  url: string | null;
  description: string;
  category: string;
  image: string;
  logo: string | null;
};

const SUPABASE_LOGOS =
  "https://abhpzepanwhuswhiuutu.supabase.co/storage/v1/object/public/logos";

const projects: Project[] = [
  {
    name: "SaveYours",
    category: "Healthcare",
    description: "CPR Training Platform",
    url: "https://saveyours.net",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
    logo: `${SUPABASE_LOGOS}/saveyours-logo.png`,
  },
  {
    name: "CareConnect Live",
    category: "Healthcare",
    description: "Healthcare Platform",
    url: "https://careconnectlive.org",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
    logo: `${SUPABASE_LOGOS}/careconnect-logo.png`,
  },
  {
    name: "Oromo Platform",
    category: "Community",
    description: "Community Platform",
    url: "https://oromo-platform.vercel.app",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    logo: `${SUPABASE_LOGOS}/odda-logo.png`,
  },
  {
    name: "Entrusted Home Healthcare",
    category: "Healthcare",
    description: "Healthcare Agency Website",
    url: "https://entrustedhomehealthcare.org",
    image: "https://images.unsplash.com/photo-1576765608622-067973a79f53?w=600&q=80",
    logo: `${SUPABASE_LOGOS}/entrusted-logo.png`,
  },
  {
    name: "Rift Valley Transportation",
    category: "Transportation",
    description: "Transportation Company",
    url: "https://rvtusinc.com",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    logo: `${SUPABASE_LOGOS}/riftvalley-logo.png`,
  },
  {
    name: "portal.saveyours.net",
    category: "SaaS \u00B7 Coming Soon",
    description: "B2B Compliance Portal",
    url: null,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    logo: null,
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
              {project.logo && (
                <div className="absolute top-3 left-3 z-10 bg-white/95 rounded-lg px-2 py-1.5 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.logo}
                    alt={project.name + " logo"}
                    className="h-6 w-auto object-contain max-w-[80px]"
                    onError={(e) => {
                      e.currentTarget.parentElement?.style.setProperty('display', 'none');
                    }}
                  />
                </div>
              )}
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
