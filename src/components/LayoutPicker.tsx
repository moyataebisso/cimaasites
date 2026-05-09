"use client";

import { Check, ExternalLink } from "lucide-react";
import { LAYOUTS, type LayoutId } from "@/lib/layouts";
import { cn } from "@/lib/utils";

interface LayoutPickerProps {
  value: LayoutId;
  onChange: (id: LayoutId) => void;
}

export function LayoutPicker({ value, onChange }: LayoutPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Starting layout"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {LAYOUTS.map((layout) => {
        const selected = value === layout.id;
        return (
          <button
            key={layout.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(layout.id)}
            className={cn(
              "group relative flex flex-col text-left rounded-xl bg-slate-800 p-6 min-h-[180px] transition-all duration-200 cursor-pointer",
              "hover:-translate-y-0.5 hover:shadow-xl",
              selected
                ? "ring-2 ring-violet-500 bg-slate-800/90 shadow-lg shadow-violet-500/10"
                : "ring-1 ring-slate-700 hover:ring-slate-500"
            )}
          >
            {selected && (
              <span
                aria-hidden
                className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white"
              >
                <Check size={14} strokeWidth={3} />
              </span>
            )}

            <div className="flex-1">
              <h3 className="font-heading font-semibold text-white text-2xl leading-snug tracking-tight pr-8">
                {layout.name}
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                {layout.industry}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-3">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-medium">
                {layout.tagline}
              </span>
              <a
                href={layout.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors shrink-0"
              >
                See it live
                <ExternalLink size={12} />
              </a>
            </div>
          </button>
        );
      })}
    </div>
  );
}
