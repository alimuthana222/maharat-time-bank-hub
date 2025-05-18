
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ListingCard } from "@/components/marketplace/ListingCard";

export function MarketplacePreview() {
  // Featured marketplace listings
  const featuredListings = [
    {
      id: "1",
      title: "مساعدة في مشروع برمجي",
      type: "need" as const,
      category: "برمجة",
      description: "أحتاج مساعدة في تطوير تطبيق موبايل باستخدام React Native لمشروع التخرج.",
      hourlyRate: 3,
      postedBy: {
        name: "أحمد محمد",
        university: "جامعة الملك سعود",
      },
    },
    {
      id: "2",
      title: "تدريس الإحصاء التطبيقي",
      type: "offer" as const,
      category: "تدريس",
      description: "أقدم دروس في الإحصاء التطبيقي وتحليل البيانات باستخدام R وSPSS للطلاب في التخصصات العلمية.",
      hourlyRate: 2,
      postedBy: {
        name: "خالد العمري",
        university: "جامعة الملك فهد",
      },
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">أحدث طلبات وعروض السوق</h2>
          <Button variant="outline" asChild>
            <Link to="/marketplace">زيارة السوق</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
