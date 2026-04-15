"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type CellVal = boolean | string;

const rows: {
  feature: string;
  diy: CellVal;
  freelancer: CellVal;
  agency: CellVal;
  cimaa: CellVal;
}[] = [
  {
    feature: "Build fee / upfront cost",
    diy: "$0 (you build it)",
    freelancer: "$1,500–$5,000",
    agency: "$5,000–$25,000",
    cimaa: "$599",
  },
  {
    feature: "Monthly cost",
    diy: "$17–$39/mo",
    freelancer: "$0 (no support)",
    agency: "$500–$3,000/mo",
    cimaa: "$299–$399/mo",
  },
  {
    feature: "Year 1 total cost",
    diy: "$204–$468 + your time",
    freelancer: "$2,500–$6,000 upfront only",
    agency: "$11,000–$61,000",
    cimaa: "~$3,887–$5,387",
  },
  {
    feature: "Done for you (we build it)",
    diy: false,
    freelancer: "Build only",
    agency: true,
    cimaa: true,
  },
  {
    feature: "24/7 monitoring",
    diy: false,
    freelancer: false,
    agency: "Sometimes $$$",
    cimaa: true,
  },
  {
    feature: "Direct support (text/email)",
    diy: "Chatbots only",
    freelancer: "Sometimes",
    agency: "Ticket system",
    cimaa: "Always",
  },
  {
    feature: "You own your data",
    diy: false,
    freelancer: true,
    agency: true,
    cimaa: true,
  },
  {
    feature: "Booking + store included",
    diy: "Add-on $$$",
    freelancer: "Extra charge",
    agency: "Extra charge",
    cimaa: "Pro plan",
  },
  {
    feature: "SEO tools built in",
    diy: "Basic only",
    freelancer: "Extra charge",
    agency: "Extra $$$",
    cimaa: true,
  },
  {
    feature: "Setup time",
    diy: "Weeks of your time",
    freelancer: "4–8 weeks",
    agency: "2–6 months",
    cimaa: "3–5 days",
  },
  {
    feature: "Price hikes",
    diy: "Regular increases",
    freelancer: "Varies",
    agency: "Common",
    cimaa: "Locked forever",
  },
];

function CellValue({ value, highlight = false }: { value: CellVal; highlight?: boolean }) {
  if (value === true)
    return <span className="text-green-600 font-bold text-lg">&#10003;</span>;
  if (value === false)
    return <span className="text-slate-300 text-lg">&#10005;</span>;
  return (
    <span
      className={cn(
        "text-sm font-medium",
        highlight ? "text-blue-700 font-semibold" : "text-slate-600"
      )}
    >
      {value}
    </span>
  );
}

export function ComparisonTable() {
  return (
    <section className="bg-white">
      <div className="bg-slate-900 py-16">
        <Container>
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              The honest comparison
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Most website platforms charge you less but make you do all the
              work yourself. Local agencies charge 10x more. We sit right in
              the middle — done for you, at a price that actually makes sense.
            </p>
          </motion.div>
        </Container>
      </div>

      <Container>
        <div className="py-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Why businesses choose Cimaa
            </h3>
            <p className="mt-3 text-base text-slate-600">
              Compare what you actually get — and what you actually pay
            </p>
          </motion.div>

          <motion.div
            className="overflow-x-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <table className="w-full min-w-[880px] text-left border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="py-4 pr-4 text-sm font-medium text-slate-500 align-bottom border-b border-slate-200">
                    Feature
                  </th>
                  <th className="py-4 px-4 text-center align-bottom border-b border-slate-200">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold text-slate-700">DIY Builders</span>
                      <span className="text-xs text-slate-500">Wix · GoDaddy · Squarespace</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center align-bottom border-b border-slate-200">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold text-slate-700">Local Freelancer</span>
                      <span className="text-xs text-slate-500">MN market rate 2026</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center align-bottom border-b border-slate-200">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold text-slate-700">Local MN Agency</span>
                      <span className="text-xs text-slate-500">e.g. Perrill, HyperX Design</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center align-bottom rounded-t-xl bg-gradient-to-b from-blue-600 to-violet-600 shadow-lg">
                    <div className="flex flex-col items-center gap-2">
                      <Badge variant="gold">Best Value</Badge>
                      <span className="font-bold text-white text-base">Cimaa Sites</span>
                      <span className="text-xs text-blue-100">Done for you</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const isLast = i === rows.length - 1;
                  return (
                    <motion.tr
                      key={row.feature}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      viewport={{ once: true }}
                    >
                      <td className="py-4 pr-4 text-sm font-medium text-slate-700 border-b border-slate-100">
                        {row.feature}
                      </td>
                      <td className="py-4 px-4 text-center border-b border-slate-100">
                        <CellValue value={row.diy} />
                      </td>
                      <td className="py-4 px-4 text-center border-b border-slate-100">
                        <CellValue value={row.freelancer} />
                      </td>
                      <td className="py-4 px-4 text-center border-b border-slate-100">
                        <CellValue value={row.agency} />
                      </td>
                      <td
                        className={cn(
                          "py-4 px-4 text-center bg-blue-50 border-x-2 border-blue-500 shadow-sm",
                          isLast && "rounded-b-xl border-b-2"
                        )}
                      >
                        <CellValue value={row.cimaa} highlight />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>

          <motion.p
            className="mt-8 text-xs text-slate-500 text-center max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Local agency pricing based on Perrill (Minnetonka, MN) — $150–$250/hr,
            $5,000/mo retainer. Freelancer pricing based on MN market rates 2026.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
