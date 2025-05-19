
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { ArrowRight, ShoppingBag } from "lucide-react";

export function MarketplacePreview() {
  // Enhanced marketplace listings with more details
  const featuredListings = [
    {
      id: "1",
      title: "مساعدة في مشروع برمجي",
      type: "need" as const,
      category: "برمجة",
      description: "أحتاج مساعدة في تطوير تطبيق موبايل باستخدام React Native لمشروع التخرج. المشروع عبارة عن تطبيق لإدارة مهام الطلاب وتنظيم الجدول الدراسي.",
      hourlyRate: 3,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      postedBy: {
        name: "أحمد محمد",
        university: "جامعة الملك سعود",
        avatarUrl: "https://i.pravatar.cc/150?img=7",
      },
      tags: ["React Native", "JavaScript", "تطبيق موبايل", "مشروع تخرج"],
    },
    {
      id: "2",
      title: "تدريس الإحصاء التطبيقي",
      type: "offer" as const,
      category: "تدريس",
      description: "أقدم دروس في الإحصاء التطبيقي وتحليل البيانات باستخدام R وSPSS للطلاب في التخصصات العلمية. حاصل على درجة الماجستير في الإحصاء.",
      hourlyRate: 2,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      postedBy: {
        name: "خالد العمري",
        university: "جامعة الملك فهد",
        avatarUrl: "https://i.pravatar.cc/150?img=11",
      },
      tags: ["إحصاء", "SPSS", "R", "تحليل بيانات"],
    },
    {
      id: "3",
      title: "مصمم جرافيك لمشروع تسويقي",
      type: "need" as const,
      category: "تصميم",
      description: "أبحث عن مصمم جرافيك لتصميم بوسترات وإعلانات لمشروع تسويقي في كلية إدارة الأعمال. المشروع يشمل 5 تصاميم مختلفة.",
      hourlyRate: 2.5,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      postedBy: {
        name: "ليلى أحمد",
        university: "جامعة الأميرة نورة",
        avatarUrl: "https://i.pravatar.cc/150?img=9",
      },
      tags: ["تصميم جرافيك", "بوستر", "إعلان", "فوتوشوب"],
    },
    {
      id: "4",
      title: "ترجمة نصوص طبية",
      type: "offer" as const,
      category: "ترجمة",
      description: "أقدم خدمة ترجمة النصوص الطبية من الإنجليزية إلى العربية. خبرة 3 سنوات في ترجمة الأبحاث والمقالات الطبية.",
      hourlyRate: 3,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      postedBy: {
        name: "محمد العلي",
        university: "جامعة الملك سعود",
        avatarUrl: "https://i.pravatar.cc/150?img=14",
      },
      tags: ["ترجمة", "طب", "إنجليزي", "عربي"],
    }
  ];

  // Limit to 4 listings on small screens, show all on large
  const displayedListings = window.innerWidth < 1024 ? featuredListings.slice(0, 2) : featuredListings;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <ShoppingBag className="h-5 w-5" />
              <span className="font-semibold">سوق المهارات</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold">أحدث طلبات وعروض السوق</h2>
          </div>
          <Button variant="outline" asChild className="hidden md:flex">
            <Link to="/marketplace" className="flex items-center gap-2">
              زيارة السوق
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <Link to="/marketplace" className="flex items-center gap-2">
              استكشف السوق
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
