"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
              "group flex flex-col text-left overflow-hidden rounded-xl bg-slate-800 transition-all cursor-pointer",
              selected
                ? "ring-2 ring-violet-500 bg-slate-800/80 shadow-lg shadow-violet-500/10"
                : "ring-1 ring-slate-700 hover:ring-slate-500 hover:shadow-lg"
            )}
          >
            <LayoutPreviewFrame
              src={layout.previewUrl}
              title={layout.name}
            />

            <div className="flex flex-col flex-1 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {layout.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {layout.industry}
                  </p>
                </div>
                <RadioIndicator selected={selected} />
              </div>

              <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-3">
                {layout.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
                  {layout.tagline}
                </span>
                <a
                  href={layout.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ pointerEvents: "auto" }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                >
                  See it live
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "shrink-0 mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors",
        selected ? "border-violet-500" : "border-slate-500"
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full transition-all",
          selected ? "bg-violet-500 scale-100" : "bg-transparent scale-0"
        )}
      />
    </span>
  );
}

function LayoutPreviewFrame({ src, title }: { src: string; title: string }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const node = wrapperRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <div
      ref={wrapperRef}
      className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-700"
      style={{ pointerEvents: "none" }}
    >
      {!inView ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-slate-700 to-slate-800">
          <span className="text-sm font-semibold text-slate-300">{title}</span>
          <span className="text-[11px] uppercase tracking-wide text-slate-500">
            Loading preview…
          </span>
        </div>
      ) : (
        <iframe
          src={src}
          title={`${title} layout preview`}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          scrolling="no"
          className="absolute top-0 left-0"
          style={{
            width: "200%",
            height: "200%",
            border: 0,
            transform: "scale(0.5)",
            transformOrigin: "top left",
          }}
        />
      )}
    </div>
  );
}
