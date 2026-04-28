import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  headline: string;
  /** Word(s) at the end of the headline rendered in cimaa-green */
  accent?: string;
  subtitle?: string;
  alignment?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  headline,
  accent,
  subtitle,
  alignment = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        alignment === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-block px-3 py-1 rounded-full bg-cimaa-green-light text-cimaa-green text-xs font-semibold uppercase tracking-wider">
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-heading font-semibold leading-[1.1] tracking-tight text-cimaa-text",
          "text-3xl sm:text-4xl lg:text-5xl",
          eyebrow && "mt-4"
        )}
      >
        {headline}
        {accent && (
          <>
            {" "}
            <span className="text-cimaa-green">{accent}</span>
          </>
        )}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-lg text-cimaa-text-muted leading-relaxed",
            alignment === "center" && "max-w-2xl mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
