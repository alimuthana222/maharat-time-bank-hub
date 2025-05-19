
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SkillCard } from "@/components/skills/SkillCard";
import { ArrowRight, Star } from "lucide-react";

export function FeaturedSkills() {
  // Enhanced featured skills with more detailed information
  const featuredSkills = [
    {
      id: "1",
      title: "تعليم خصوصي للرياضيات",
      category: "تدريس",
      description: "مساعدة في حل المسائل الرياضية للمستوى الجامعي. متخصص في التفاضل والتكامل والمعادلات التفاضلية والجبر الخطي.",
      hourlyRate: 2,
      rating: 4.9,
      reviewCount: 28,
      provider: {
        name: "أحمد محمد",
        university: "جامعة الملك سعود",
        avatarUrl: "https://i.pravatar.cc/150?img=1",
      },
      badges: ["مميز", "شعبي"],
    },
    {
      id: "2",
      title: "تصميم شعارات وهويات بصرية",
      category: "تصميم",
      description: "خبرة 3 سنوات في تصميم الشعارات والهويات البصرية للمشاريع الطلابية والشركات الناشئة. أستخدم Adobe Illustrator و Photoshop.",
      hourlyRate: 3,
      rating: 4.7,
      reviewCount: 19,
      provider: {
        name: "سارة عبدالله",
        university: "جامعة الأميرة نورة",
        avatarUrl: "https://i.pravatar.cc/150?img=5",
      },
      badges: ["موصى به"],
    },
    {
      id: "3",
      title: "برمجة تطبيقات الويب",
      category: "برمجة",
      description: "تطوير واجهات المستخدم باستخدام React و TypeScript. مساعدة في مشاريع التخرج البرمجية وتطبيقات الويب التفاعلية.",
      hourlyRate: 3,
      rating: 4.8,
      reviewCount: 32,
      provider: {
        name: "خالد العمري",
        university: "جامعة الملك فهد",
        avatarUrl: "https://i.pravatar.cc/150?img=3",
      },
      badges: ["مميز", "خبير"],
    },
  ];

  return (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <Star className="h-5 w-5 fill-primary" />
              <span className="font-semibold">أعلى تقييماً</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold">مهارات مميزة</h2>
          </div>
          <Button variant="outline" asChild className="hidden md:flex">
            <Link to="/skills" className="flex items-center gap-2">
              عرض جميع المهارات
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSkills.map((skill) => (
            <SkillCard key={skill.id} {...skill} />
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Button asChild>
            <Link to="/skills" className="flex items-center gap-2">
              عرض جميع المهارات
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
