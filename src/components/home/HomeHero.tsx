"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const trustItems = [
  "Secure hosting",
  "Real human support",
  "Affordable plans",
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-cimaa-bg-tan pt-20 pb-12 md:pt-24 md:pb-16">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy column */}
          <motion.div
            className="flex flex-col items-center md:items-start text-center md:text-left"
            {...fadeUp}
          >
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] tracking-tight text-cimaa-text">
              Affordable websites for local businesses.{" "}
              <span className="text-cimaa-green">
                Custom built for however you need it.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-cimaa-text-muted leading-relaxed max-w-xl">
              From restaurants to home services to nonprofits — Waji
              Professional Websites builds, launches, maintains, and protects
              your website. So you can focus on what you do best. All coded
              from scratch.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center md:justify-start w-full sm:w-auto">
              <Button href="/contact" variant="primary" size="lg" withArrow>
                Get a Quote
              </Button>
              <Button href="#how-it-works" variant="outline" size="lg">
                See How It Works
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-cimaa-text-muted">
              {trustItems.map((label) => (
                <span key={label} className="flex items-center gap-1.5">
                  <CheckCircle2
                    className="w-4 h-4 text-cimaa-green"
                    strokeWidth={2.5}
                  />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Visual column */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative aspect-[5/4] w-full rounded-2xl overflow-hidden shadow-xl shadow-amber-900/10 ring-1 ring-black/5">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
                alt="Team working together at a table"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
