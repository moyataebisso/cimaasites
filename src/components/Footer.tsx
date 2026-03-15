import Link from "next/link";
import { Container } from "@/components/ui/Container";

const productLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Developer Plan" },
  { href: "/contact", label: "Contact" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "https://arsitechgroup.com", label: "Arsi Technology Group" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Cimaa Sites
            </span>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Powerful websites for powerful communities.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Built in Minneapolis, MN &#127775;
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="mailto:arsitechgroup@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  arsitechgroup@gmail.com
                </a>
              </li>
              <li>Minneapolis, MN</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-4">
            Serving the Oromo, Somali, Ethiopian, and East African communities
            of Minneapolis — and all local businesses who deserve a professional
            online presence.
          </p>
          <p className="text-sm text-slate-500">
            &copy; 2026 Cimaa Sites by Arsi Technology Group
          </p>
        </div>
      </Container>
    </footer>
  );
}
