"use client";

import { Suspense, useEffect, useRef, useState } from "react";
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

type FieldKey = "name" | "email" | "businessName" | "phone";
type FieldErrors = Partial<Record<FieldKey, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digitsOnly = (s: string) => s.replace(/[^0-9]/g, "");

function validateField(field: FieldKey, value: string): string | undefined {
  const trimmed = value.trim();
  switch (field) {
    case "name":
      if (trimmed.length < 2) return "Please enter at least 2 characters";
      return undefined;
    case "email":
      if (!trimmed) return "Email is required";
      if (!EMAIL_RE.test(trimmed)) return "Enter a valid email address";
      return undefined;
    case "businessName":
      if (trimmed.length < 2) return "Business name must be at least 2 characters";
      return undefined;
    case "phone":
      if (digitsOnly(trimmed).length < 10) return "Enter at least 10 digits";
      return undefined;
  }
}

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
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState<PlanKey>("pro");
  const [message, setMessage] = useState("");
  const [selectedLayout, setSelectedLayout] = useState<LayoutId>("restaurant");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [submittedBusiness, setSubmittedBusiness] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const businessRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = searchParams.get("plan");
    if (p === "basic" || p === "pro" || p === "developer") {
      setPlan(p);
    }
  }, [searchParams]);

  const allValid =
    !validateField("name", name) &&
    !validateField("email", email) &&
    !validateField("businessName", businessName) &&
    !validateField("phone", phone);

  const handleBlur = (field: FieldKey, value: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
  };

  const updateField = (field: FieldKey, value: string) => {
    if (touched[field]) {
      setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setBusinessName("");
    setPhone("");
    setPlan("pro");
    setMessage("");
    setSelectedLayout("restaurant");
    setErrors({});
    setTouched({});
    setStatus("idle");
    setErrorMessage("");
    setSubmittedName("");
    setSubmittedBusiness("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Force-validate all fields and surface inline errors.
    const nextErrors: FieldErrors = {
      name: validateField("name", name),
      email: validateField("email", email),
      businessName: validateField("businessName", businessName),
      phone: validateField("phone", phone),
    };
    setErrors(nextErrors);
    setTouched({ name: true, email: true, businessName: true, phone: true });

    const firstInvalid = (
      ["name", "email", "businessName", "phone"] as FieldKey[]
    ).find((k) => nextErrors[k]);
    if (firstInvalid) {
      const refMap: Record<FieldKey, React.RefObject<HTMLInputElement | null>> = {
        name: nameRef,
        email: emailRef,
        businessName: businessRef,
        phone: phoneRef,
      };
      const target = refMap[firstInvalid].current;
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.focus({ preventScroll: true });
      }
      return;
    }

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
          phone,
          plan,
          message,
          selected_layout: selectedLayout,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Something went wrong");
      }
      setSubmittedName(name);
      setSubmittedBusiness(businessName);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send");
    }
  };

  const inputClass =
    "w-full rounded-xl bg-white border border-cimaa-border text-cimaa-text placeholder-cimaa-text-subtle px-4 py-3 text-sm focus:border-cimaa-green focus:ring-2 focus:ring-cimaa-green/20 outline-none transition-all";
  const inputErrorClass =
    "w-full rounded-xl bg-white border border-red-400 text-cimaa-text placeholder-cimaa-text-subtle px-4 py-3 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all";

  return (
    <main>
      <section className="bg-cimaa-bg-tan pt-28 pb-16 md:pt-32 md:pb-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
            <motion.div {...fadeUp}>
              <span className="inline-block px-3 py-1 rounded-full bg-cimaa-green-light text-cimaa-green text-xs font-semibold uppercase tracking-wider">
                Get Started
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-heading font-semibold leading-[1.05] tracking-tight text-cimaa-text">
                Let&apos;s build your{" "}
                <span className="text-cimaa-green">website</span>
              </h1>
              <p className="mt-6 text-lg text-cimaa-text-muted leading-relaxed">
                Tell us a bit about your business. Moa will review and send a
                custom proposal within 24 hours — usually faster.
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
                  <h2 className="mt-6 text-2xl font-heading font-semibold text-cimaa-text">
                    Message received!
                  </h2>
                  <p className="mt-3 text-cimaa-text-muted leading-relaxed">
                    Thanks {submittedName}! We received your inquiry about{" "}
                    <strong className="text-cimaa-text">{submittedBusiness}</strong>.
                    Moa will review and send you a custom proposal within 24
                    hours — usually faster.
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
                  <p className="mt-4 text-xs text-cimaa-text-subtle">
                    Check your inbox for a confirmation email.
                  </p>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-cimaa-text mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={nameRef}
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          updateField("name", e.target.value);
                        }}
                        onBlur={(e) => handleBlur("name", e.target.value)}
                        className={errors.name ? inputErrorClass : inputClass}
                        placeholder="Your name"
                        aria-invalid={Boolean(errors.name)}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cimaa-text mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          updateField("email", e.target.value);
                        }}
                        onBlur={(e) => handleBlur("email", e.target.value)}
                        className={errors.email ? inputErrorClass : inputClass}
                        placeholder="you@email.com"
                        aria-invalid={Boolean(errors.email)}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-cimaa-text mb-2">
                        Business name <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={businessRef}
                        type="text"
                        value={businessName}
                        onChange={(e) => {
                          setBusinessName(e.target.value);
                          updateField("businessName", e.target.value);
                        }}
                        onBlur={(e) =>
                          handleBlur("businessName", e.target.value)
                        }
                        className={
                          errors.businessName ? inputErrorClass : inputClass
                        }
                        placeholder="Your business name"
                        aria-invalid={Boolean(errors.businessName)}
                      />
                      {errors.businessName && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.businessName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cimaa-text mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={phoneRef}
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          updateField("phone", e.target.value);
                        }}
                        onBlur={(e) => handleBlur("phone", e.target.value)}
                        className={errors.phone ? inputErrorClass : inputClass}
                        placeholder="(555) 123-4567"
                        inputMode="tel"
                        aria-invalid={Boolean(errors.phone)}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cimaa-text mb-2">
                      Which plan are you interested in?{" "}
                      <span className="text-red-500">*</span>
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
                      Anything we should know?{" "}
                      <span className="text-cimaa-text-subtle">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`${inputClass} resize-none`}
                      placeholder="One sentence is fine — we'll ask for the details after we agree on a plan."
                    />
                  </div>

                  <div className="pt-2 border-t border-cimaa-border">
                    <h3 className="text-base font-semibold text-cimaa-text mt-4">
                      Pick a starting layout{" "}
                      <span className="text-red-500">*</span>
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
                  </div>

                  {status === "error" && errorMessage && (
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    size="lg"
                    disabled={status === "submitting" || !allValid}
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
