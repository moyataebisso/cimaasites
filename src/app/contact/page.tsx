"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LayoutPicker } from "@/components/LayoutPicker";
import type { LayoutId } from "@/lib/layouts";

const PLAN_LABELS: Record<"basic" | "pro" | "developer", string> = {
  basic: "Starter — solo owners and family-run shops",
  pro: "Growth — multi-location and growing teams",
  developer: "Custom — anyone with specific needs",
};

type PlanKey = keyof typeof PLAN_LABELS;
type Status = "idle" | "submitting" | "success" | "error";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
  viewport: { once: true },
};

export default function ContactPage() {
  return (
    <Suspense fallback={<main className="bg-cimaa-bg-tan min-h-screen pt-24" />}>
      <ContactPageInner />
    </Suspense>
  );
}

function ContactPageInner() {
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [plan, setPlan] = useState<PlanKey>("basic");
  const [message, setMessage] = useState("");
  const [selectedLayout, setSelectedLayout] = useState<LayoutId>("fleet");
  const [layoutNotes, setLayoutNotes] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const p = searchParams.get("plan");
    if (p === "basic" || p === "pro" || p === "developer") {
      setPlan(p);
    }
  }, [searchParams]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setBusinessName("");
    setPlan("basic");
    setMessage("");
    setSelectedLayout("fleet");
    setLayoutNotes("");
    setStatus("idle");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          business_name: businessName,
          plan,
          message,
          selected_layout: selectedLayout,
          layout_notes: layoutNotes,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Something went wrong");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send");
    }
  };

  const inputClass =
    "w-full rounded-xl bg-white border border-cimaa-border text-cimaa-text placeholder-cimaa-text-subtle px-4 py-3 text-sm focus:border-cimaa-green focus:ring-2 focus:ring-cimaa-green/20 outline-none transition-all";

  return (
    <main>
      <section className="bg-cimaa-bg-tan pt-28 pb-16 md:pt-32 md:pb-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
            <motion.div {...fadeUp}>
              <span className="inline-block px-3 py-1 rounded-full bg-cimaa-green-light text-cimaa-green text-xs font-semibold uppercase tracking-wider">
                Get Started
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-cimaa-text">
                Let&apos;s build your{" "}
                <span className="text-cimaa-green">website</span>
              </h1>
              <p className="mt-6 text-lg text-cimaa-text-muted leading-relaxed">
                Fill out the form and we&apos;ll get back to you within 24
                hours. Most sites are live within 3–5 business days.
              </p>

              <div className="mt-10 space-y-5">
                <ContactRow
                  icon={<Mail size={18} />}
                  label="Email us"
                  value={
                    <a
                      href="mailto:arsitechgroup@gmail.com"
                      className="text-cimaa-text-muted hover:text-cimaa-green transition-colors"
                    >
                      arsitechgroup@gmail.com
                    </a>
                  }
                />
                <ContactRow
                  icon={<MapPin size={18} />}
                  label="Location"
                  value={<span className="text-cimaa-text-muted">United States</span>}
                />
                <ContactRow
                  icon={<Clock size={18} />}
                  label="Response time"
                  value={<span className="text-cimaa-text-muted">Within 24 hours</span>}
                />
              </div>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-cimaa-border bg-white p-7 sm:p-8 shadow-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true }}
            >
              {status === "success" ? (
                <div className="flex flex-col items-center text-center py-8">
                  <span className="h-14 w-14 rounded-full bg-cimaa-green-light text-cimaa-green flex items-center justify-center">
                    <CheckCircle2 size={32} strokeWidth={2.5} />
                  </span>
                  <h2 className="mt-6 text-2xl font-bold text-cimaa-text">
                    Message received!
                  </h2>
                  <p className="mt-3 text-cimaa-text-muted">
                    We&apos;ll get back to you within 24 hours at {email}.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-8"
                    size="lg"
                    onClick={resetForm}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-cimaa-text mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cimaa-text mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cimaa-text mb-2">
                      Business name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className={inputClass}
                      placeholder="Your business name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cimaa-text mb-2">
                      Which plan are you interested in?
                    </label>
                    <select
                      value={plan}
                      onChange={(e) => setPlan(e.target.value as PlanKey)}
                      className={inputClass}
                    >
                      <option value="basic">{PLAN_LABELS.basic}</option>
                      <option value="pro">{PLAN_LABELS.pro}</option>
                      <option value="developer">{PLAN_LABELS.developer}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cimaa-text mb-2">
                      Tell us about your business
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`${inputClass} resize-none`}
                      placeholder="What does your business do? What do you need from your website?"
                    />
                  </div>

                  <div className="pt-2 border-t border-cimaa-border">
                    <h3 className="text-base font-semibold text-cimaa-text mt-4">
                      Pick a starting layout (optional)
                    </h3>
                    <p className="mt-1 text-sm text-cimaa-text-muted">
                      We&apos;ll use this as a starting point. You can change
                      it anytime — and we may suggest a different fit based on
                      your business.
                    </p>

                    <div className="mt-5">
                      <LayoutPicker
                        value={selectedLayout}
                        onChange={setSelectedLayout}
                      />
                    </div>

                    <div className="mt-5">
                      <label className="block text-sm font-medium text-cimaa-text mb-2">
                        Anything specific you&apos;d like to see? (optional)
                      </label>
                      <textarea
                        rows={3}
                        value={layoutNotes}
                        onChange={(e) => setLayoutNotes(e.target.value)}
                        maxLength={1000}
                        className={`${inputClass} resize-none`}
                        placeholder="e.g., warm earthy colors, more photos than text, prefer no menu section..."
                      />
                    </div>
                  </div>

                  {status === "error" && errorMessage && (
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    size="lg"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? "Sending..." : "Send Message"}
                  </Button>

                  <p className="text-center text-xs text-cimaa-text-subtle">
                    No credit card required. We&apos;ll get back to you within
                    24 hours.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cimaa-green-light text-cimaa-green">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-cimaa-text">{label}</p>
        {value}
      </div>
    </div>
  );
}
