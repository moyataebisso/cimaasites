import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HomeFinalCTA } from "@/components/home/HomeFinalCTA";
import { LAYOUTS } from "@/lib/layouts";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Real businesses on the Waji Professional Websites platform and the broader Arsi Technology Group ecosystem.",
};

interface ProjectCard {
  name: string;
  industry: string;
  description: string;
  url: string | null;
  /** Tailwind utility classes for the placeholder gradient. */
  accent: string;
}

const projects: ProjectCard[] = [
  {
    name: "CareConnect Live",
    industry: "Healthcare",
    description:
      "Provider matching platform with appointment booking and secure messaging.",
    url: "https://careconnectlive.org",
    accent: "from-emerald-100 to-cimaa-bg-tan",
  },
  {
    name: "SaveYours",
    industry: "Training",
    description:
      "CPR and first aid class registration with Stripe payments and automated emails.",
    url: "https://saveyours.net",
    accent: "from-rose-100 to-cimaa-bg-tan",
  },
  {
    name: "Entrusted Home Healthcare",
    industry: "Healthcare",
    description:
      "Home healthcare agency website with HIPAA-aligned content and service listings.",
    url: "https://entrustedhomehealthcare.org",
    accent: "from-sky-100 to-cimaa-bg-tan",
  },
  {
    name: "Rift Valley Transportation",
    industry: "Logistics",
    description:
      "Transportation company website serving the Twin Cities metro area.",
    url: "https://rvtusinc.com",
    accent: "from-amber-100 to-cimaa-bg-tan",
  },
  {
    name: "Oromo Platform",
    industry: "Community",
    description:
      "Community hub — academy, businesses, careers, news, events, all in one platform.",
    url: "https://oromo-platform.vercel.app",
    accent: "from-violet-100 to-cimaa-bg-tan",
  },
  {
    name: "Arsi Technology Group",
    industry: "Studio",
    description:
      "The Minneapolis-based studio behind Waji and the rest of the platform.",
    url: "https://arsitechgroup.com",
    accent: "from-slate-100 to-cimaa-bg-tan",
  },
];

export default function PortfolioPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-cimaa-bg-tan pt-28 pb-16 md:pt-32 md:pb-20">
        <Container>
          <SectionHeading
            eyebrow="Portfolio"
            headline="Real businesses,"
            accent="real sites"
            subtitle="A look at sites built and run on the Waji Professional Websites platform — and the broader Arsi Technology Group ecosystem."
          />
        </Container>
      </section>

      {/* Projects grid */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectTile key={p.name} project={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Layouts available */}
      <section className="bg-cimaa-bg-tan py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Layouts available today"
            headline="Pick the one closest"
            accent="to your business"
            subtitle="Every layout below is production-ready. We'll start there and tailor it to your business."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {LAYOUTS.map((layout) => (
              <div
                key={layout.id}
                className="rounded-2xl bg-white border border-cimaa-border shadow-sm p-6 flex flex-col"
              >
                <h3 className="font-heading text-lg font-semibold text-cimaa-text">
                  {layout.name}
                </h3>
                <p className="mt-1 text-sm text-cimaa-text-muted">
                  {layout.industry}
                </p>
                <p className="mt-4 text-sm text-cimaa-text leading-relaxed flex-1">
                  {layout.description}
                </p>
                <a
                  href={layout.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cimaa-green hover:text-emerald-800 transition-colors"
                >
                  See preview
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <HomeFinalCTA
        headline="Ready for your business"
        accent="to be next?"
      />
    </main>
  );
}

function ProjectTile({ project }: { project: ProjectCard }) {
  return (
    <div className="rounded-2xl border border-cimaa-border bg-white shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      <div
        className={`h-40 bg-gradient-to-br ${project.accent} flex items-center justify-center px-6`}
      >
        <span className="font-heading text-xl font-semibold text-cimaa-text text-center leading-tight">
          {project.name}
        </span>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wider text-cimaa-green">
          {project.industry}
        </span>
        <p className="mt-2 text-cimaa-text-muted leading-relaxed text-sm flex-1">
          {project.description}
        </p>
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cimaa-green hover:text-emerald-800 transition-colors"
          >
            Visit site
            <ExternalLink size={14} />
          </a>
        ) : (
          <span className="mt-4 text-sm text-cimaa-text-subtle">
            Coming soon
          </span>
        )}
      </div>
    </div>
  );
}
