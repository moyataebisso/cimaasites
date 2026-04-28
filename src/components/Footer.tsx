import Link from "next/link";
import { Mail, Twitter, Instagram, Facebook } from "lucide-react";
import { Container } from "@/components/ui/Container";

const customerLinks = [
  { href: "/contact", label: "Get a Quote" },
  { href: "/admin", label: "Customer Login" },
  { href: "/portfolio", label: "Our Work" },
];

const supportLinks = [
  { href: "/contact", label: "Contact" },
  { href: "/pricing", label: "How It Works" },
  { href: "/features", label: "Features" },
];

export function Footer() {
  return (
    <footer className="bg-cimaa-bg-tan border-t-2 border-cimaa-border">
      <Container>
        <div className="py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <span className="font-heading text-lg font-semibold text-cimaa-text">
              Waji Professional Websites
            </span>
            <p className="mt-3 text-sm text-cimaa-text-muted leading-relaxed max-w-xs">
              Custom websites for local businesses.
            </p>
          </div>

          <FooterColumn title="Customers" links={customerLinks} />
          <FooterColumn title="Support" links={supportLinks} />

          <div>
            <h4 className="font-heading text-sm font-semibold text-cimaa-text mb-4">
              Stay connected
            </h4>
            <div className="flex items-center gap-3">
              <SocialIcon
                href="mailto:arsitechgroup@gmail.com"
                label="Email"
                icon={<Mail size={16} />}
              />
              <SocialIcon
                href="https://twitter.com"
                label="Twitter"
                icon={<Twitter size={16} />}
              />
              <SocialIcon
                href="https://instagram.com"
                label="Instagram"
                icon={<Instagram size={16} />}
              />
              <SocialIcon
                href="https://facebook.com"
                label="Facebook"
                icon={<Facebook size={16} />}
              />
            </div>
            <a
              href="mailto:arsitechgroup@gmail.com"
              className="mt-5 inline-block text-sm text-cimaa-text-muted hover:text-cimaa-text transition-colors"
            >
              arsitechgroup@gmail.com
            </a>
          </div>
        </div>

        <div className="py-6 border-t border-cimaa-border flex flex-col sm:flex-row gap-4 sm:items-center justify-between text-xs text-cimaa-text-muted">
          <p>&copy; 2026 Waji Professional Websites by Arsi Technology Group</p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="hover:text-cimaa-text transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-cimaa-text transition-colors"
            >
              Terms
            </Link>
            <span>Designed in Minneapolis</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="font-heading text-sm font-semibold text-cimaa-text mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-cimaa-text-muted hover:text-cimaa-text transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="h-9 w-9 rounded-full border border-cimaa-border text-cimaa-text-muted hover:text-cimaa-text hover:border-cimaa-text flex items-center justify-center transition-colors"
    >
      {icon}
    </a>
  );
}
