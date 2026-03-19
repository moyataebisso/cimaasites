"use client";

import { motion } from "framer-motion";
import { Rocket, Shield, Activity, Bell, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

const stats = [
  { number: "3-5", label: "Days to go live", icon: Rocket },
  { number: "$19", label: "Forever. No price hikes.", icon: Shield },
  { number: "24/7", label: "Uptime monitoring", icon: Activity },
  { number: "5min", label: "Alert response time", icon: Bell },
];

export function CommunitySection() {
  return (
    <section className="py-24" style={{ backgroundColor: "#FAFAF8" }}>
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            viewport={{ once: true }}
          >
            <Badge variant="blue">&#127758; Our Story</Badge>

            <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Built by a team that understands your community
            </h2>

            <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
              <p>
                Cimaa Sites was born from the community. We watched local
                businesses and community entrepreneurs struggle to get online —
                either paying thousands to agencies, or getting lost trying to
                figure out Wix or Squarespace alone.
              </p>
              <p>
                So we built something better. Professional websites, done for
                you, at a price any business can actually afford. $19/mo — and
                that price never goes up. That&apos;s our community promise.
              </p>
              <p>
                We serve local businesses across the country — from small towns
                to big cities, wherever community entrepreneurs need a
                professional online presence.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap mt-6">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                &#127482;&#127480; English
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                &#127466;&#127481; Afaan Oromoo
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                &#127480;&#127476; Somali
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                &#127466;&#127481; Amharic
              </span>
            </div>

            <blockquote className="mt-6 pl-4 border-l-4 border-blue-500 italic text-gray-600">
              &ldquo;We will never raise your price. $19 today is $19 in 5
              years. That&apos;s our community promise.&rdquo;
              <cite className="block mt-2 text-sm font-medium not-italic text-gray-900">
                — The Cimaa Sites Team
              </cite>
            </blockquote>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 transition-all duration-200 hover:shadow-md"
                >
                  <stat.icon className="h-6 w-6 text-blue-600 mb-3" />
                  <div className="text-3xl font-bold text-blue-600">
                    {stat.number}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-6 text-sm text-gray-500">
              <MapPin size={14} className="text-blue-500" />
              Proudly serving local businesses and communities
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
