"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CraftDeviceVisual } from "@/components/home/FeatureVisuals";

export function CraftBand() {
  return (
    <section className="relative overflow-hidden bg-cimaa-bg-dark text-white py-16 md:py-20">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at left, rgba(250,204,21,0.18), transparent 50%), radial-gradient(ellipse at bottom right, rgba(21,128,61,0.22), transparent 55%)",
        }}
      />
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-cimaa-yellow text-xs font-semibold uppercase tracking-wider">
              Built for local business
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold leading-[1.1] tracking-tight">
              Hand-crafted content that fits your business
            </h2>
            <p className="mt-5 text-lg text-white/70 leading-relaxed max-w-xl">
              Every site we build gets coded from scratch for your business, photos
              picked for your industry, and layouts shaped to how your customers
              think. Real care, every time.
            </p>
            <div className="mt-8">
              <Button href="/contact" variant="primary" size="lg" withArrow>
                Get a Quote
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true }}
          >
            <CraftDeviceVisual />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
