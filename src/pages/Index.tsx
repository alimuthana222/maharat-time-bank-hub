
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { SkillCategories } from "@/components/home/SkillCategories";
import { TimeBankPreview } from "@/components/home/TimeBankPreview";
import { MarketplacePreview } from "@/components/home/MarketplacePreview";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <SkillCategories />
        <MarketplacePreview />
        <TimeBankPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
