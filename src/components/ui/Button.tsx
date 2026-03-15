import { cn } from "@/lib/utils";
import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "white" | "outline-white";
  size?: "sm" | "md" | "lg";
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  href,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
    outline:
      "border-2 border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 bg-white",
    white:
      "bg-white text-slate-900 hover:bg-slate-100 shadow-lg",
    "outline-white":
      "border-2 border-white/40 text-white hover:bg-white/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
