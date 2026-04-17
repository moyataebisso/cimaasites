"use client";

const SUPABASE_LOGOS =
  "https://abhpzepanwhuswhiuutu.supabase.co/storage/v1/object/public/logos";

const projects = [
  {
    name: "CareConnect Live",
    category: "Healthcare",
    description:
      "Professional healthcare platform connecting caregivers with families. Appointment booking, service listings, and secure messaging.",
    url: "https://careconnectlive.org",
    logo: `${SUPABASE_LOGOS}/careconnect-logo.png`,
  },
  {
    name: "SaveYours",
    category: "Healthcare",
    description:
      "CPR and first aid training platform. Class registration, Stripe payments, and automated emails.",
    url: "https://saveyours.net",
    logo: `${SUPABASE_LOGOS}/saveyours-logo.png`,
  },
  {
    name: "Oromo Platform",
    category: "Community",
    description:
      "Oromo community hub — Academy, Businesses, Careers, News, Events, and ODDA all in one platform.",
    url: "https://oromo-platform.vercel.app",
    logo: `${SUPABASE_LOGOS}/odda-logo.png`,
  },
  {
    name: "Entrusted Home Healthcare",
    category: "Healthcare",
    description:
      "Home healthcare agency website with HIPAA compliance pages and service listings.",
    url: "https://entrustedhomehealthcare.org",
    logo: `${SUPABASE_LOGOS}/entrusted-logo.png`,
  },
  {
    name: "Rift Valley Transportation",
    category: "Transportation",
    description:
      "Transportation company website serving the Twin Cities metro area.",
    url: "https://rvtusinc.com",
    logo: `${SUPABASE_LOGOS}/riftvalley-logo.png`,
  },
  {
    name: "Indsve",
    category: "Fashion \u00B7 Clothing",
    description:
      "Minneapolis clothing brand with a modern Shopify-powered storefront.",
    url: "https://indsve.com",
    logo: `${SUPABASE_LOGOS}/indsve-logo.png`,
  },
  {
    name: "portal.saveyours.net",
    category: "SaaS \u00B7 Coming Soon",
    description:
      "B2B compliance portal for childcare facility directors to manage staff certifications.",
    url: null,
    logo: null,
  },
];

export default function PortfolioPage() {
  return (
    <main className="bg-slate-900 min-h-screen">
      {/* Page header */}
      <div className="text-center pt-32 pb-16 px-6">
        <span className="text-xs font-black tracking-[0.3em] uppercase text-violet-400 mb-4 block">
          Portfolio
        </span>
        <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-4">
          Real sites for{" "}
          <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            real businesses
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Every site we build runs on the same enterprise stack. Here are some of
          the businesses we have helped get online.
        </p>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 pb-24">
        {projects.map((project, i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden group cursor-pointer bg-slate-800 border border-slate-700 hover:border-violet-500 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20"
          >
            {/* Logo area */}
            <div className="flex items-center justify-center h-40 px-8 bg-gradient-to-br from-slate-800 to-slate-900">
              {project.logo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={project.logo}
                  alt={project.name}
                  className="max-h-16 max-w-[180px] w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-4xl">&#128284;</span>
              )}
            </div>

            {/* Text */}
            <div className="p-6 border-t border-slate-700">
              <span className="text-xs font-black tracking-widest uppercase text-violet-400">
                {project.category}
              </span>
              <h3 className="text-white font-bold text-xl mt-1">
                {project.name}
              </h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                {project.description}
              </p>
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-violet-400 text-sm font-medium mt-4 hover:text-violet-300 transition-colors"
                >
                  Visit site &rarr;
                </a>
              ) : (
                <span className="inline-block text-slate-500 text-sm mt-4">
                  Coming soon
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
