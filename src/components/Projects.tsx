"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

type Project = {
  name: string;
  url: string | null;
  description: string;
  category: string;
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
    logo: `${SUPABASE_LOGOS}/saveyours-logo.png`,
  },
  {
    name: "CareConnect Live",
    category: "Healthcare",
    description: "Healthcare Platform",
    url: "https://careconnectlive.org",
    logo: `${SUPABASE_LOGOS}/careconnect-logo.png`,
  },
  {
    name: "Oromo Platform",
    category: "Community",
    description: "Community Platform",
    url: "https://oromo-platform.vercel.app",
    logo: `${SUPABASE_LOGOS}/odda-logo.png`,
  },
  {
    name: "Entrusted Home Healthcare",
    category: "Healthcare",
    description: "Healthcare Agency Website",
    url: "https://entrustedhomehealthcare.org",
    logo: `${SUPABASE_LOGOS}/entrusted-logo.png`,
  },
  {
    name: "Rift Valley Transportation",
    category: "Transportation",
    description: "Transportation Company",
    url: "https://rvtusinc.com",
    logo: `${SUPABASE_LOGOS}/riftvalley-logo.png`,
  },
  {
    name: "Indsve",
    category: "Fashion \u00B7 Clothing",
    description: "Minneapolis Clothing Brand",
    url: "https://indsve.com",
    logo: `${SUPABASE_LOGOS}/indsve-logo.png`,
  },
  {
    name: "portal.saveyours.net",
    category: "SaaS \u00B7 Coming Soon",
    description: "B2B Compliance Portal",
    url: null,
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer bg-slate-800 border border-slate-700 hover:border-violet-500 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20${i === projects.length - 1 ? " lg:col-span-3" : ""}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              {/* Logo area */}
              <div className={`flex items-center justify-center h-36 px-8 bg-gradient-to-br from-slate-800 to-slate-900${i === projects.length - 1 ? " lg:h-28" : ""}`}>
                {project.logo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.logo}
                      alt={project.name + " logo"}
                      className="max-h-16 max-w-[180px] w-auto object-contain filter brightness-100 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
                        }
                      }}
                    />
                    <div className="hidden items-center justify-center w-full h-full">
                      <span className="text-2xl font-black text-white opacity-40">
                        {project.name.charAt(0)}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-4xl">&#128284;</span>
                )}
              </div>

              {/* Text content */}
              <div className={`p-5 border-t border-slate-700${i === projects.length - 1 ? " lg:text-center" : ""}`}>
                <span className="text-xs font-black tracking-widest uppercase text-violet-400">
                  {project.category}
                </span>
                <h3 className="text-white font-bold text-lg mt-1 leading-tight">
                  {project.name}
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  {project.description}
                </p>
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 text-sm font-medium mt-3 inline-block hover:text-violet-300 transition-colors"
                  >
                    Visit site &rarr;
                  </a>
                ) : (
                  <span className="text-slate-500 text-sm mt-3 inline-block">
                    Coming soon
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
