"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface HomeFinalCTAProps {
  /** First half of the headline before the yellow accent. */
  headline?: string;
  /** Yellow-accented tail of the headline. Pass empty string to hide. */
  accent?: string;
  subheadline?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function HomeFinalCTA({
  headline = "Ready to take your business",
  accent = "to the next level?",
  subheadline = "Tell us about your business. We'll send a quote within 24 hours and have your site live the same week.",
  buttonText = "Get a Quote",
  buttonHref = "/contact",
}: HomeFinalCTAProps = {}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(11,18,32,0.9) 30%, rgba(11,18,32,0.7) 100%)",
          }}
        />
      </div>

      <Container>
        <motion.div
          className="py-24 md:py-32 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
            {headline}
            {accent && (
              <>
                {" "}
                <span className="text-cimaa-yellow">{accent}</span>
              </>
            )}
          </h2>
          {subheadline && (
            <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto">
              {subheadline}
            </p>
          )}
          <div className="mt-9">
            <Button href={buttonHref} variant="primary" size="lg" withArrow>
              {buttonText}
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
