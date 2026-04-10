"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const features = [
  {
    icon: "\u{1F680}",
    title: "Fast & Reliable",
    description: "Your site loads in under 1 second, worldwide.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  },
  {
    icon: "\u{1F4CA}",
    title: "We Watch It 24/7",
    description: "Get alerted the moment anything goes wrong.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
  {
    icon: "\u{1F3A8}",
    title: "50 Professional Themes",
    description: "Pick your look. Switch anytime.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
  },
  {
    icon: "\u{1F527}",
    title: "Everything Built In",
    description: "Booking, store, blog, reviews \u2014 one click to turn on.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80",
  },
  {
    icon: "\u{1F4AC}",
    title: "Real Human Support",
    description: "Text or email us directly. No bots, no tickets.",
    image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=600&q=80",
  },
  {
    icon: "\u{1F512}",
    title: "Secure by Default",
    description: "Enterprise-level security, handled for you.",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&q=80",
  },
  {
    icon: "\u{1F4C8}",
    title: "Built-In SEO",
    description: "Show up on Google. We handle the technical setup.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f5f989?w=600&q=80",
  },
  {
    icon: "\u{1F9D1}\u200D\u{1F4BB}",
    title: "Developer Option",
    description: "Want the code? Take it for $49.99 one-time.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-slate-50">
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl sm:text-6xl font-black text-center bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Everything included at $19/mo
          </h2>
          <p className="text-2xl font-bold text-center text-violet-500 mb-16">
            No extras. No surprises.
          </p>
        </motion.div>

        <div className="relative overflow-hidden w-full">
          <div className="flex gap-6 animate-scroll-gallery hover:[animation-play-state:paused]">
            {[...features, ...features].map((f, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 w-80 h-56 rounded-2xl overflow-hidden group cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.image}
                  alt={f.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {f.title}
                  </h3>
                  <p className="text-white/80 text-sm mt-1">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
