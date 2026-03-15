"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const rows = [
  { feature: "Price", cimaa: "$19/mo", wix: "$17-29/mo", squarespace: "$16-23/mo", godaddy: "$10-20/mo" },
  { feature: "Done for you", cimaa: true, wix: false, squarespace: false, godaddy: false },
  { feature: "You own your data", cimaa: true, wix: false, squarespace: false, godaddy: false },
  { feature: "24/7 monitoring", cimaa: true, wix: false, squarespace: false, godaddy: false },
  { feature: "Direct support", cimaa: true, wix: false, squarespace: false, godaddy: false },
  { feature: "No price hikes", cimaa: true, wix: false, squarespace: false, godaddy: false },
  { feature: "Booking system", cimaa: "Pro", wix: "Add-on $", squarespace: "Add-on $", godaddy: "Add-on $" },
  { feature: "Online store", cimaa: "Pro", wix: "Add-on $", squarespace: "Add-on $", godaddy: "Add-on $" },
  { feature: "Custom code", cimaa: "Dev", wix: false, squarespace: false, godaddy: false },
];

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <span className="text-green-600 font-bold text-lg">&#10003;</span>;
  if (value === false) return <span className="text-slate-300 text-lg">&#10005;</span>;
  return <span className="text-sm font-medium text-slate-600">{value}</span>;
}

export function ComparisonTable() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Why businesses choose Cimaa
          </h2>
        </motion.div>

        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 pr-4 text-sm font-medium text-slate-500">Feature</th>
                <th className="py-4 px-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant="blue">Best Value</Badge>
                    <span className="font-bold text-blue-600">Cimaa Basic</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center text-sm font-medium text-slate-500">Wix</th>
                <th className="py-4 px-4 text-center text-sm font-medium text-slate-500">Squarespace</th>
                <th className="py-4 px-4 text-center text-sm font-medium text-slate-500">GoDaddy</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.feature}
                  className="border-b border-slate-100"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  viewport={{ once: true }}
                >
                  <td className="py-4 pr-4 text-sm font-medium text-slate-700">{row.feature}</td>
                  <td className={cn("py-4 px-4 text-center bg-blue-50/50")}>
                    <CellValue value={row.cimaa} />
                  </td>
                  <td className="py-4 px-4 text-center"><CellValue value={row.wix} /></td>
                  <td className="py-4 px-4 text-center"><CellValue value={row.squarespace} /></td>
                  <td className="py-4 px-4 text-center"><CellValue value={row.godaddy} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </Container>
    </section>
  );
}
