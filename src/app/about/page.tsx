import { CommunitySection } from "@/components/CommunitySection";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <CommunitySection />
      </main>
      <Footer />
    </>
  );
}
