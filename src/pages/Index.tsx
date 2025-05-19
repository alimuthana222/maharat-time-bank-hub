
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { TimeBankPreview } from "@/components/home/TimeBankPreview";
import { SkillCategories } from "@/components/home/SkillCategories";
import { FeaturedSkills } from "@/components/home/FeaturedSkills";
import { MarketplacePreview } from "@/components/home/MarketplacePreview";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <Hero />
        
        {/* Time Bank Preview */}
        <TimeBankPreview />
        
        {/* Skill Categories */}
        <SkillCategories />
        
        {/* Featured Skills */}
        <FeaturedSkills />
        
        {/* Marketplace Preview */}
        <MarketplacePreview />
        
        {/* CTA Section */}
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
