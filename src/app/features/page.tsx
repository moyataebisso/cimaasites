"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Database,
  Activity,
  Palette,
  Settings,
  MessageCircle,
  Shield,
  Code,
  Calendar,
  ShoppingBag,
  FileText,
  Mail,
  Star,
  Image,
  HelpCircle,
  Ticket,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const coreFeatures = [
  {
    icon: Globe,
    title: "Edge Performance",
    description:
      "Your site runs on Vercel's global edge network — the same infrastructure that powers Notion, Loom, and TikTok. Pages load in under 1 second worldwide.",
  },
  {
    icon: Database,
    title: "You Own Your Data",
    description:
      "Every client gets their own Supabase database. Your customer data, leads, and content belong to you — not us. Export anytime.",
  },
  {
    icon: Activity,
    title: "24/7 Monitoring",
    description:
      "We check your site every 5 minutes. If anything goes wrong, we get alerted and fix it — usually before you even notice.",
  },
  {
    icon: Palette,
    title: "20+ Professional Themes",
    description:
      "Themes designed for real businesses — restaurants, healthcare, transportation, retail, and more. Switch themes anytime with one click.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Row-level security, rate limiting, CSRF protection, webhook verification, and SSL certificates. Your site is locked down.",
  },
  {
    icon: MessageCircle,
    title: "Real Human Support",
    description:
      "Text or email us directly. You talk to real people who know your site — not a ticket queue or AI chatbot.",
  },
];

const proFeatures = [
  { icon: Calendar, title: "Appointment Booking", description: "Customers book time slots directly on your site. Syncs with your calendar." },
  { icon: ShoppingBag, title: "Online Store", description: "Sell products with inventory management, cart, and checkout." },
  { icon: FileText, title: "Blog & Content", description: "Publish articles, news, and updates with a built-in CMS." },
  { icon: Mail, title: "Email Marketing", description: "Collect subscribers and send newsletters right from your dashboard." },
  { icon: Star, title: "Reviews System", description: "Collect and display customer reviews to build trust." },
  { icon: Ticket, title: "Events & Tickets", description: "Create events, sell tickets, and manage RSVPs." },
  { icon: Image, title: "Photo Gallery", description: "Showcase your work with beautiful, responsive galleries." },
  { icon: HelpCircle, title: "FAQ Builder", description: "Create searchable FAQ pages for your customers." },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
  viewport: { once: true },
};

export default function FeaturesPage() {
  return (
    <main className="pt-24">
      <section className="py-24">
        <Container>
          <motion.div className="text-center max-w-3xl mx-auto" {...fadeUp}>
            <Badge variant="blue">Features</Badge>
            <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-slate-900">
              Everything your business needs.{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Nothing it doesn&apos;t.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Enterprise-grade technology made simple. Every Cimaa site runs on
              Next.js, Supabase, and Vercel — the same stack powering
              billion-dollar companies.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="py-16 bg-slate-50">
        <Container>
          <motion.h2
            className="text-2xl font-bold text-slate-900 mb-12"
            {...fadeUp}
          >
            Core Features — Included in every plan
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                className="rounded-2xl bg-white border border-slate-200 p-8 transition-all hover:shadow-md hover:scale-[1.02]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <f.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <motion.div {...fadeUp}>
            <Badge variant="violet">Pro Plan</Badge>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 mb-12">
              Pro Features — $35/mo
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {proFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md hover:scale-[1.02]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <f.icon className="h-6 w-6 text-violet-600 mb-3" />
                <h3 className="font-semibold text-slate-900 mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 bg-slate-50">
        <Container>
          <motion.div className="text-center max-w-2xl mx-auto" {...fadeUp}>
            <Badge variant="gold">For Developers</Badge>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 mb-4">
              Developer Plan — $49.99 one-time
            </h2>
            <p className="text-slate-600 mb-8">
              Get the complete Next.js source code. All themes, all modules.
              Deploy to your own Supabase and Vercel. Perfect for agencies and
              developers who want full control.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Full source code",
                "All 20 themes",
                "All modules",
                "Self-hosted",
                "No monthly fees",
                "1 setup call",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-slate-900 text-white text-sm px-4 py-2"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <Button href="/contact" size="lg">
                Get the Code
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}
