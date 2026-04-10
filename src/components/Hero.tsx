"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
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
        width: 'min(280px, 20vw)',
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
        <div className="relative flex items-center justify-center pt-20 px-48">

          {/* Left mockup */}
          <MockupCard side="left" />

          {/* Center content */}
          <motion.div
            className="relative z-10 text-center max-w-3xl mx-auto px-4"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className="flex justify-center">
              <Badge variant="blue">
                &#10022; Now with 50 themes + built-in SEO tools
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]"
            >
              Powerful websites for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                powerful businesses
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed"
            >
              We build, monitor, and manage your website for $19/mo. Built
              by our community, for our community. No contracts. No DIY. Just
              results.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-sm text-gray-500 flex flex-wrap items-center justify-center gap-2"
            >
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                50 themes
              </span>
              <span className="text-gray-300">&middot;</span>
              <span>6 products</span>
              <span className="text-gray-300">&middot;</span>
              <span>24/7 monitoring</span>
              <span className="text-gray-300">&middot;</span>
              <span>Built-in Google SEO tools</span>
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-6 flex flex-wrap gap-4 justify-center"
            >
              <Button href="/contact" size="lg">
                Get Started &mdash; $19/mo
              </Button>
              <Button href="/portfolio" variant="outline" size="lg">
                See Our Work
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 justify-center"
            >
              <span>&#128274; Setup in 3-5 days</span>
              <span>&#128202; 24/7 monitoring</span>
              <span>&#128172; Direct support</span>
              <span>&#127758; English · Afaan Oromoo · Somali · Amharic</span>
            </motion.div>
          </motion.div>

          {/* Right mockup */}
          <MockupCard side="right" />

        </div>
      </Container>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-slate-400" />
      </div>
    </section>
  );
}
