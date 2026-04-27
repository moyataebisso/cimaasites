"use client";

import {
  Globe,
  Map,
  BarChart3,
  Users,
  TrendingUp,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Stylized layout-picker mockup. Six small framed cards inside a larger
 * panel hint at the layouts customers choose from on /contact, without
 * loading real screenshots into the homepage.
 */
export function LayoutPickerVisual() {
  const tiles = [
    { label: "Restaurant", color: "bg-amber-100", accent: "bg-amber-400" },
    { label: "Salon", color: "bg-rose-100", accent: "bg-rose-400" },
    { label: "Fleet", color: "bg-slate-100", accent: "bg-slate-500" },
    { label: "Healthcare", color: "bg-emerald-100", accent: "bg-emerald-400" },
    { label: "Community", color: "bg-violet-100", accent: "bg-violet-400" },
    { label: "Home Pros", color: "bg-lime-100", accent: "bg-lime-500" },
  ];

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-xl shadow-amber-900/10 p-5 sm:p-7">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-cimaa-text-subtle">
          Pick your layout
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className={cn(
              "rounded-lg p-3 ring-1 ring-black/5",
              tile.color
            )}
          >
            <div className={cn("h-10 rounded mb-2", tile.accent)} />
            <div className="h-1.5 w-3/4 rounded bg-white/70 mb-1" />
            <div className="h-1.5 w-1/2 rounded bg-white/70 mb-2" />
            <p className="text-[10px] font-semibold text-cimaa-text">
              {tile.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-cimaa-border pt-4">
        <span className="text-xs text-cimaa-text-muted">
          We tailor it to your business
        </span>
        <span className="text-xs font-semibold text-cimaa-green">
          Live in 5–10 min
        </span>
      </div>
    </div>
  );
}

/** Stylized Google search/Maps result row. */
export function SearchResultVisual() {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-xl shadow-amber-900/10 p-5 sm:p-7">
      <div className="flex items-center gap-3 pb-4 border-b border-cimaa-border">
        <Globe size={18} className="text-cimaa-text-subtle" />
        <div className="flex-1 h-9 rounded-full bg-cimaa-bg-surface px-4 flex items-center text-sm text-cimaa-text-muted">
          best dental clinic near me
        </div>
      </div>

      <ul className="mt-5 space-y-4">
        {[1, 2, 3].map((i) => (
          <li
            key={i}
            className={cn(
              "rounded-lg p-3 transition-colors",
              i === 1 && "bg-cimaa-bg-warm ring-1 ring-amber-200"
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold",
                  i === 1
                    ? "bg-cimaa-yellow text-cimaa-text"
                    : "bg-slate-100 text-cimaa-text-muted"
                )}
              >
                {i === 1 ? <Star size={14} fill="currentColor" /> : i}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    i === 1 ? "text-cimaa-green" : "text-cimaa-text"
                  )}
                >
                  {i === 1
                    ? "Your Local Dental Co — open now"
                    : "Other Dental Practice"}
                </p>
                <p className="text-xs text-cimaa-text-muted mt-0.5">
                  {i === 1
                    ? "4.9 ★ (218) · 1.2 mi · Now booking"
                    : "4.4 ★ · 3.8 mi"}
                </p>
                {i === 1 && (
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-cimaa-green font-semibold">
                    <Map size={12} />
                    SEO-optimized · Reviews integrated
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Stylized analytics dashboard. */
export function AnalyticsVisual() {
  const bars = [50, 65, 45, 80, 70, 90, 75];
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-xl shadow-amber-900/10 p-5 sm:p-7">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cimaa-text-subtle">
            This week
          </p>
          <p className="text-2xl font-bold text-cimaa-text mt-0.5">
            +28%{" "}
            <span className="text-sm font-semibold text-cimaa-green">
              <TrendingUp size={14} className="inline" /> visits
            </span>
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-cimaa-green-light text-cimaa-green text-xs font-semibold">
          Live
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2 h-32 items-end">
        {bars.map((h, i) => (
          <div
            key={i}
            className={cn(
              "rounded-t-md",
              i === bars.length - 1
                ? "bg-cimaa-yellow"
                : "bg-cimaa-green/80"
            )}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat icon={<Users size={14} />} label="Visitors" value="1.2k" />
        <Stat icon={<BarChart3 size={14} />} label="Leads" value="34" />
        <Stat icon={<Star size={14} />} label="Reviews" value="4.9" />
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-cimaa-bg-surface p-3">
      <div className="flex items-center gap-1 text-cimaa-text-muted text-[11px] uppercase tracking-wider font-semibold">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-lg font-bold text-cimaa-text">{value}</p>
    </div>
  );
}

/** Device mockup for the dark "Built for local business" band. */
export function CraftDeviceVisual() {
  return (
    <div className="relative">
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-2">
        <div className="rounded-xl bg-white overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-cimaa-border bg-cimaa-bg-surface">
            <span className="h-2 w-2 rounded-full bg-rose-300" />
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            <span className="ml-3 text-xs text-cimaa-text-subtle">
              your-business.cimaasites.ai
            </span>
          </div>
          <div className="p-6 sm:p-8">
            <div className="h-2 w-24 rounded-full bg-cimaa-green-light mb-4" />
            <div className="h-6 w-3/4 rounded bg-cimaa-text mb-2" />
            <div className="h-6 w-1/2 rounded bg-cimaa-yellow mb-5" />
            <div className="space-y-1.5 mb-6">
              <div className="h-2 w-full rounded bg-slate-100" />
              <div className="h-2 w-5/6 rounded bg-slate-100" />
              <div className="h-2 w-2/3 rounded bg-slate-100" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-32 rounded-lg bg-cimaa-yellow" />
              <div className="h-9 w-28 rounded-lg border border-cimaa-border" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-2 bg-cimaa-yellow text-cimaa-text rounded-full px-3 py-1.5 text-xs font-bold shadow-lg">
        <Star size={12} fill="currentColor" />
        Hand-crafted
      </div>
    </div>
  );
}
