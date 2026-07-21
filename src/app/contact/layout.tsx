import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started — Wajii Websites | Free Consultation",
  description:
    "Tell us about your business and we will build your custom website in 7 days. Fill out the form to get started.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
