"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export interface FeatureBullet {
  label: string;
  detail?: string;
}

interface FeatureBlockProps {
  eyebrow: string;
  headline: string;
  bullets: FeatureBullet[];
  visual: React.ReactNode;
  imageSide?: "left" | "right";
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
  /**
   * 'card' — render content in a white card with border + shadow (good on tan).
   * 'plain' — flow content directly on the section bg (good on white).
   */
  frame?: "card" | "plain";
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
  viewport: { once: true, amount: 0.3 },
};

export function FeatureBlock({
  eyebrow,
  headline,
  bullets,
  visual,
  imageSide = "right",
  ctaLabel = "Learn more",
  ctaHref = "/contact",
  className,
  frame = "card",
}: FeatureBlockProps) {
  return (
    <section className={cn("py-16 md:py-20 bg-cimaa-bg-tan", className)}>
      <Container>
        <div
          className={cn(
            "max-w-6xl mx-auto",
            frame === "card" &&
              "bg-white rounded-2xl border border-cimaa-border shadow-sm p-8 md:p-12 lg:p-16",
            frame === "plain" && "px-0",
            "grid lg:grid-cols-2 gap-12 lg:gap-20 items-center",
            imageSide === "left" && "lg:[&>*:first-child]:order-2"
          )}
        >
          <motion.div {...fadeUp}>
            <span className="inline-block px-3 py-1 rounded-full bg-cimaa-green-light text-cimaa-green text-xs font-semibold uppercase tracking-wider">
              {eyebrow}
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-cimaa-text">
              {headline}
            </h2>

            <ul className="mt-8 space-y-5">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 mt-1 h-6 w-6 rounded-full bg-cimaa-green-light text-cimaa-green flex items-center justify-center">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="text-base">
                    <strong className="font-semibold text-cimaa-text">
                      {b.label}
                    </strong>
                    {b.detail && (
                      <span className="text-cimaa-text-muted">
                        {" — "}
                        {b.detail}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-cimaa-green hover:text-emerald-800 transition-colors"
              >
                {ctaLabel}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            {visual}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
