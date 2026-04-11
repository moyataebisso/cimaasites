"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Basic",
    tagline: "Everything you need to get online",
    setupPrice: "$599",
    setupSubtext: "one-time setup \u00B7 includes your first month",
    monthlyPrice: "then $299/mo",
    promo: "\uD83C\uDF89 First 3 months $249/mo \u00B7 then $299",
    badge: "Starter",
    badgeVariant: "blue" as const,
    features: [
      "Professional website (5 pages)",
      "Contact form + lead capture",
      "Admin dashboard",
      "20+ themes (switch anytime)",
      "24/7 uptime monitoring",
      "Direct email/text support",
      "SSL + custom domain",
      "Mobile optimized",
      "Setup in 3-5 days",
    ],
    cta: "Get Started \u2014 $599",
    ctaHref: "/contact",
    style: "border-blue-200 bg-white",
    ctaVariant: "primary" as const,
  },
  {
    name: "Pro",
    tagline: "The full toolkit for growing businesses",
    setupPrice: "$599",
    setupSubtext: "one-time setup \u00B7 includes your first month",
    monthlyPrice: "then $399/mo",
    promo: "\uD83C\uDF89 First 3 months $299/mo \u00B7 then $399",
    badge: "Most Popular",
    badgeVariant: "violet" as const,
    featured: true,
    features: [
      "Everything in Basic, plus:",
      "Appointment booking system",
      "Online store (sell products)",
      "Blog + content management",
      "Email marketing + newsletters",
      "Customer reviews system",
      "Event management + tickets",
      "Photo gallery",
      "FAQ page builder",
    ],
    cta: "Get Started \u2014 $599",
    ctaHref: "/contact",
    style:
      "bg-gradient-to-br from-blue-600 to-violet-600 border-transparent text-white",
    ctaVariant: "white" as const,
  },
  {
    name: "Developer",
    tagline: "Full source code, your infrastructure",
    setupPrice: "$49.99",
    setupSubtext: "one-time \u00B7 no monthly fee",
    monthlyPrice: null,
    promo: null,
    badge: "For Developers",
    badgeVariant: "gold" as const,
    features: [
      "Full Next.js source code",
      "Connect your own Supabase",
      "Deploy to your own Vercel",
      "All 20 themes included",
      "All modules included",
      "No monthly fees ever",
      "1 setup call with our team",
      "Perfect for agencies + devs",
    ],
    cta: "Get the Code",
    ctaHref: "/contact",
    style: "bg-slate-900 border-transparent text-white",
    ctaVariant: "outline-white" as const,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            No hidden fees. No renewal price hikes. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={cn(
                "relative rounded-2xl border p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl",
                plan.style,
                plan.featured && "md:-mt-4 md:mb-[-16px] md:py-10 shadow-xl"
              )}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Badge
                variant={plan.badgeVariant}
                className={cn(
                  plan.featured && "bg-white/20 text-white border-white/30",
                  plan.name === "Developer" &&
                    "bg-amber-500/20 text-amber-300 border-amber-500/30"
                )}
              >
                {plan.badge}
              </Badge>

              <div className="mt-4">
                <h3
                  className={cn(
                    "text-xl font-bold",
                    plan.featured || plan.name === "Developer"
                      ? "text-white"
                      : "text-slate-900"
                  )}
                >
                  {plan.name}
                </h3>
                <p
                  className={cn(
                    "text-sm mt-1",
                    plan.featured || plan.name === "Developer"
                      ? "text-white/70"
                      : "text-slate-500"
                  )}
                >
                  {plan.tagline}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span
                    className={cn(
                      "text-4xl font-bold",
                      plan.featured || plan.name === "Developer"
                        ? "text-white"
                        : "text-slate-900"
                    )}
                  >
                    {plan.setupPrice}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs mt-1",
                    plan.featured || plan.name === "Developer"
                      ? "text-white/60"
                      : "text-slate-500"
                  )}
                >
                  {plan.setupSubtext}
                </p>
                {plan.monthlyPrice && (
                  <p
                    className={cn(
                      "text-sm font-semibold mt-2",
                      plan.featured ? "text-white/90" : "text-slate-700"
                    )}
                  >
                    {plan.monthlyPrice}
                  </p>
                )}
                {plan.promo && (
                  <p
                    className={cn(
                      "text-xs mt-2 px-2 py-1 rounded-full inline-block",
                      plan.featured
                        ? "bg-white/15 text-white/90"
                        : "bg-violet-100 text-violet-700"
                    )}
                  >
                    {plan.promo}
                  </p>
                )}
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      size={18}
                      className={cn(
                        "mt-0.5 flex-shrink-0",
                        plan.featured || plan.name === "Developer"
                          ? "text-white/80"
                          : "text-blue-600"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        plan.featured || plan.name === "Developer"
                          ? "text-white/90"
                          : "text-slate-600"
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  href={plan.ctaHref}
                  variant={plan.ctaVariant}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center space-y-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-slate-500">
            Setup covers your first month. No contracts. Cancel anytime.
          </p>
          <p className="text-sm text-slate-500">
            Local agencies charge $5,000&ndash;$25,000 just to build. We build it, host it, monitor it, and manage it &mdash; $599 to start.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
