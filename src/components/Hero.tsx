"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function MockupCard({ side }: { side: "left" | "right" }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        transform: `translateY(-50%) ${side === 'left' ? 'rotate(-6deg)' : 'rotate(6deg)'}`,
        left: side === 'left' ? '0' : 'auto',
        right: side === 'right' ? '0' : 'auto',
        width: 'min(240px, 15vw)',
        opacity: 0.55,
        zIndex: 0,
      }}
    >
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xl shadow-blue-500/10 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 bg-slate-50">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <div className="ml-2 text-xs text-slate-400">cimaasites.ai</div>
        </div>
        <div className="relative h-48">
          <div className="absolute inset-0 animate-theme-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
            <div className="text-center">
              <div className="h-6 w-28 mx-auto rounded bg-blue-600 mb-3" />
              <div className="h-2 w-40 mx-auto rounded bg-slate-200 mb-2" />
              <div className="h-2 w-32 mx-auto rounded bg-slate-200 mb-4" />
              <div className="h-8 w-24 mx-auto rounded-full bg-blue-600" />
            </div>
          </div>
          <div className="absolute inset-0 animate-theme-2 flex items-center justify-center bg-gradient-to-br from-violet-50 to-white p-6 opacity-0">
            <div className="text-center">
              <div className="h-6 w-28 mx-auto rounded bg-violet-600 mb-3" />
              <div className="h-2 w-40 mx-auto rounded bg-slate-200 mb-2" />
              <div className="h-2 w-32 mx-auto rounded bg-slate-200 mb-4" />
              <div className="h-8 w-24 mx-auto rounded-full bg-violet-600" />
            </div>
          </div>
          <div className="absolute inset-0 animate-theme-3 flex items-center justify-center bg-gradient-to-br from-amber-50 to-white p-6 opacity-0">
            <div className="text-center">
              <div className="h-6 w-28 mx-auto rounded bg-amber-600 mb-3" />
              <div className="h-2 w-40 mx-auto rounded bg-slate-200 mb-2" />
              <div className="h-2 w-32 mx-auto rounded bg-slate-200 mb-4" />
              <div className="h-8 w-24 mx-auto rounded-full bg-amber-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl animate-blob animation-delay-4000" />
      </div>

      <Container>
        <div className="relative flex items-center justify-center pt-20 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">

          {/* Left mockup */}
          <MockupCard side="left" />

          {/* Center content */}
          <motion.div
            className="relative z-10 text-center w-full max-w-2xl mx-auto px-4"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.h1
              variants={fadeUp}
              className="mt-6 leading-[1.05]"
            >
              <span className="block text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900">
                Powerful websites for
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                powerful businesses
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed"
            >
              We build, monitor, and manage your website. $599 to start &mdash;
              includes your first month. Then $299/mo. No contracts. No DIY.
              Just results.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-6 flex flex-wrap gap-4 justify-center"
            >
              <Button href="/contact" size="lg">
                Get Started
              </Button>
              <Button href="/portfolio" variant="outline" size="lg">
                See Our Work
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 pt-8 flex flex-wrap gap-x-16 gap-y-3 justify-center"
            >
              {[
                { label: "Setup in 3-5 days", sub: "Fast launch" },
                { label: "24/7 Monitoring", sub: "Always watching" },
                { label: "Direct Support", sub: "Real humans" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-sm font-bold text-slate-800 tracking-wide">
                    {item.label}
                  </div>
                  <div className="text-xs text-violet-500 font-medium mt-0.5">
                    {item.sub}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right mockup */}
          <MockupCard side="right" />

        </div>

        {/* Purple gradient divider line */}
        <div className="h-2 w-full mt-16 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600" />

        {/* Minnesota section */}
        <div className="mt-16 text-center px-4 w-full pb-16">
          <p className="text-2xl sm:text-3xl font-black tracking-[0.2em] uppercase text-violet-500 mb-4 text-center">
            Trusted by businesses across our community
          </p>
          <h3 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
            Minnesota-started.{" "}
            <span style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Global reach.
            </span>
          </h3>
          <p className="text-slate-500 text-base mt-3 max-w-sm mx-auto">
            Born in Minneapolis. Built for communities everywhere.
          </p>

          {/* Bold underline */}
          <div className="h-1.5 w-32 mx-auto mt-6 rounded-full bg-gradient-to-r from-violet-600 via-blue-500 to-violet-600" />
        </div>
      </Container>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-slate-400" />
      </div>
    </section>
  );
}
