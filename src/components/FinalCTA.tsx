"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-violet-600">
      <Container>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to get your business online?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            Join Minneapolis businesses already powered by Cimaa Sites.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="white" size="lg">
              Get Started Today
            </Button>
            <Button href="/contact" variant="outline-white" size="lg">
              Talk to us first
            </Button>
          </div>

          <p className="mt-6 text-sm text-white/60">
            Setup takes 10 minutes. Site live in 3-5 days.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
