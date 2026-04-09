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

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl animate-blob animation-delay-4000" />
      </div>

      <Container>
        <div className="grid lg:grid-cols-5 gap-12 items-center pt-20">
          <motion.div
            className="lg:col-span-3"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="blue">&#10022; Now with 50 themes + built-in SEO tools</Badge>
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
              className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed"
            >
              We build, monitor, and manage your website for $19/mo. Built
              by our community, for our community. No contracts. No DIY. Just
              results.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-sm text-gray-500 flex flex-wrap items-center gap-2"
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

            <motion.div variants={fadeUp} className="mt-4 flex flex-wrap gap-4">
              <Button href="/contact" size="lg">
                Get Started &mdash; $19/mo
              </Button>
              <Button href="/portfolio" variant="outline" size="lg">
                See Our Work
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500"
            >
              <span>&#128274; Setup in 3-5 days</span>
              <span>&#128202; 24/7 monitoring</span>
              <span>&#128172; Direct support</span>
              <span>&#127758; English · Afaan Oromoo · Somali · Amharic</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-2 hidden lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative -rotate-2">
              <div className="rounded-xl border border-slate-200 bg-white shadow-2xl shadow-blue-500/10 overflow-hidden">
                <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 bg-slate-50">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <div className="ml-2 text-xs text-slate-400">cimaasites.ai</div>
                </div>
                <div className="relative h-64 sm:h-80">
                  <div className="absolute inset-0 animate-theme-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-8">
                    <div className="text-center">
                      <div className="h-8 w-32 mx-auto rounded bg-blue-600 mb-4" />
                      <div className="h-3 w-48 mx-auto rounded bg-slate-200 mb-2" />
                      <div className="h-3 w-40 mx-auto rounded bg-slate-200 mb-6" />
                      <div className="h-10 w-28 mx-auto rounded-full bg-blue-600" />
                    </div>
                  </div>
                  <div className="absolute inset-0 animate-theme-2 flex items-center justify-center bg-gradient-to-br from-violet-50 to-white p-8 opacity-0">
                    <div className="text-center">
                      <div className="h-8 w-32 mx-auto rounded bg-violet-600 mb-4" />
                      <div className="h-3 w-48 mx-auto rounded bg-slate-200 mb-2" />
                      <div className="h-3 w-40 mx-auto rounded bg-slate-200 mb-6" />
                      <div className="h-10 w-28 mx-auto rounded-full bg-violet-600" />
                    </div>
                  </div>
                  <div className="absolute inset-0 animate-theme-3 flex items-center justify-center bg-gradient-to-br from-amber-50 to-white p-8 opacity-0">
                    <div className="text-center">
                      <div className="h-8 w-32 mx-auto rounded bg-amber-600 mb-4" />
                      <div className="h-3 w-48 mx-auto rounded bg-slate-200 mb-2" />
                      <div className="h-3 w-40 mx-auto rounded bg-slate-200 mb-6" />
                      <div className="h-10 w-28 mx-auto rounded-full bg-amber-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-slate-400" />
      </div>
    </section>
  );
}
