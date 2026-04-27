import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "white"
  | "outline-white";

type Size = "sm" | "md" | "lg";

type ButtonOwnProps = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  href?: string;
  loading?: boolean;
  withArrow?: boolean;
};

type ButtonProps = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-cimaa-yellow text-cimaa-text hover:bg-cimaa-yellow-dark shadow-sm hover:shadow",
  secondary:
    "bg-cimaa-green text-white hover:bg-emerald-800 shadow-sm hover:shadow",
  outline:
    "border border-cimaa-border text-cimaa-text hover:border-cimaa-text bg-white",
  ghost: "text-cimaa-text hover:bg-cimaa-bg-surface",
  white: "bg-white text-cimaa-text hover:bg-slate-100 shadow-sm",
  "outline-white":
    "border border-white/40 text-white hover:bg-white/10 bg-transparent",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  href,
  loading = false,
  withArrow = false,
  disabled,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        children
      )}
      {!loading && withArrow && (
        <ArrowRight
          size={size === "lg" ? 18 : 16}
          className="transition-transform group-hover:translate-x-0.5"
        />
      )}
    </>
  );

  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={cn("group", classes)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={cn("group", classes)}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
}
