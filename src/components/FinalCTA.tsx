"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <Container>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Powerful websites for{" "}
              <span style={{
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                powerful communities.
              </span>
            </h2>
            <p className="text-slate-400 text-lg mt-2">
              Built for communities everywhere 🌟
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="white" size="lg">
              Get Started Today
            </Button>
            <Button href="/contact" variant="outline-white" size="lg">
              Talk to us first
            </Button>
          </div>

          <p className="text-slate-400 text-sm sm:text-base text-center mt-3 px-4">
            Setup takes 10 minutes. Site live in 3-5 days.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
