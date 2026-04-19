"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const PLAN_LABELS: Record<"basic" | "pro" | "developer", string> = {
  basic: "Basic — $599 setup + $299/mo",
  pro: "Pro — $599 setup + $399/mo",
  developer: "Developer — $49.99 one-time",
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
    <Suspense fallback={<main className="bg-slate-900 min-h-screen pt-24" />}>
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

  return (
    <main className="bg-slate-900 min-h-screen pt-24">
      <section className="py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div {...fadeUp}>
              <Badge variant="blue">Get Started</Badge>
              <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-white">
                Let&apos;s build your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  website
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-400 leading-relaxed">
                Fill out the form and we&apos;ll get back to you within 24
                hours. Most sites are live within 3-5 business days.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-violet-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Email us</p>
                    <a
                      href="mailto:arsitechgroup@gmail.com"
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      arsitechgroup@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-violet-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Location</p>
                    <p className="text-slate-400">United States</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-violet-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Response time</p>
                    <p className="text-slate-400">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true }}
            >
              {status === "success" ? (
                <div className="flex flex-col items-center text-center py-8">
                  <CheckCircle2 size={56} className="text-green-400" />
                  <h2 className="mt-6 text-2xl font-bold text-white">
                    Message received!
                  </h2>
                  <p className="mt-3 text-slate-400">
                    We&apos;ll get back to you within 24 hours at {email}.
                  </p>
                  <Button
                    type="button"
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
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Business name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                      placeholder="Your business name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Which plan are you interested in?
                    </label>
                    <select
                      value={plan}
                      onChange={(e) => setPlan(e.target.value as PlanKey)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    >
                      <option value="basic">{PLAN_LABELS.basic}</option>
                      <option value="pro">{PLAN_LABELS.pro}</option>
                      <option value="developer">{PLAN_LABELS.developer}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tell us about your business
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
                      placeholder="What does your business do? What do you need from your website?"
                    />
                  </div>

                  {status === "error" && errorMessage && (
                    <p className="text-sm text-red-400">{errorMessage}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? "Sending..." : "Send Message"}
                  </Button>

                  <p className="text-center text-xs text-slate-500">
                    No credit card required. We&apos;ll get back to you within 24 hours.
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
