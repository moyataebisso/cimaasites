"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
  viewport: { once: true },
};

export default function ContactPage() {
  return (
    <main className="pt-24">
      <section className="py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div {...fadeUp}>
              <Badge variant="blue">Get Started</Badge>
              <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-slate-900">
                Let&apos;s build your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  website
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                Fill out the form and we&apos;ll get back to you within 24
                hours. Most sites are live within 3-5 business days.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Email us</p>
                    <a
                      href="mailto:arsitechgroup@gmail.com"
                      className="text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      arsitechgroup@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Location</p>
                    <p className="text-slate-600">United States</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Response time</p>
                    <p className="text-slate-600">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true }}
            >
              <form
                className="space-y-6"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="Your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Which plan are you interested in?
                  </label>
                  <select className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white">
                    <option>Basic — $599 setup + $299/mo</option>
                    <option>Pro — $599 setup + $399/mo</option>
                    <option>Developer — $49.99 one-time</option>
                    <option>Not sure yet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tell us about your business
                  </label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                    placeholder="What does your business do? What do you need from your website?"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Send Message
                </Button>

                <p className="text-center text-xs text-slate-500">
                  No credit card required. We&apos;ll get back to you within 24 hours.
                </p>
              </form>
            </motion.div>
          </div>
        </Container>
      </section>
    </main>
  );
}
