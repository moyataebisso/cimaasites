import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HomeFinalCTA } from "@/components/home/HomeFinalCTA";
import { LAYOUTS } from "@/lib/layouts";

export const metadata: Metadata = {
  title: "Our Work — Wajii Websites | Client Portfolio",
  description:
    "See the restaurants, home care agencies, and small businesses we have built websites for in Minneapolis and Minnesota.",
};

interface ProjectCard {
  name: string;
  industry: string;
  location: string;
  description: string;
  url?: string;
  tags: string[];
  status: "live" | "demo";
  accent: string;
}

const projects: ProjectCard[] = [
  {
    name: "El Roi Health Services",
    industry: "Home Care Agency",
    location: "Minneapolis, MN",
    url: "https://elroihealthservices.com",
    description:
      "Full 7-page site with JSON-LD structured data, Google Business Profile, Google Search Console, SEO-optimized copy, referrals page, jobs page, and contact form routing.",
    tags: ["Healthcare", "Home Care", "SEO"],
    status: "live",
    accent: "from-emerald-100 to-cimaa-bg-tan",
  },
  {
    name: "Entrusted Care Residence",
    industry: "Assisted Living",
    location: "Saint Paul, MN",
    url: "https://entrustedhomehealthcare.org",
    description:
      "Full website rebuild from GoDaddy to custom Next.js platform. Mission/Values/Philosophy structure, OurHomes gallery, Referrals page, Resources page, newsletter subscribe, maroon/cream palette.",
    tags: ["Healthcare", "Assisted Living"],
    status: "live",
    accent: "from-rose-100 to-cimaa-bg-tan",
  },
  {
    name: "Adama Restaurant",
    industry: "Ethiopian Restaurant",
    location: "Columbia Heights, MN",
    description:
      "Demo site built to replace SpotHopper. Custom adamaGold theme with Playfair Display headings. Full restaurant page set: Menu, Drinks, Order, Reserve, Parties, Catering, Jobs.",
    tags: ["Restaurant", "Food & Beverage"],
    status: "demo",
    accent: "from-amber-100 to-cimaa-bg-tan",
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
            subtitle="A look at sites built and run on the Wajii Websites platform — restaurants, home care agencies, and small businesses in Minneapolis and Minnesota."
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
        className={`relative h-40 bg-gradient-to-br ${project.accent} flex items-center justify-center px-6`}
      >
        <span className="font-heading text-xl font-semibold text-cimaa-text text-center leading-tight">
          {project.name}
        </span>
        {project.status === "demo" && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 text-cimaa-text text-[10px] font-semibold uppercase tracking-wider">
            Demo
          </span>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wider text-cimaa-green">
          {project.industry}
        </span>
        <p className="mt-1 text-xs text-cimaa-text-muted">{project.location}</p>
        <p className="mt-3 text-cimaa-text-muted leading-relaxed text-sm flex-1">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-cimaa-bg-tan text-cimaa-text text-[11px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        {project.status === "live" && project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cimaa-green hover:text-emerald-800 transition-colors"
          >
            View site
            <ExternalLink size={14} />
          </a>
        ) : (
          <span className="mt-4 text-sm text-cimaa-text-subtle">
            Demo — request a walkthrough
          </span>
        )}
      </div>
    </div>
  );
}
