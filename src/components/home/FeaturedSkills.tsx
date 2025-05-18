
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SkillCard } from "@/components/skills/SkillCard";

export function FeaturedSkills() {
  // Featured skills
  const featuredSkills = [
    {
      id: "1",
      title: "تعليم خصوصي للرياضيات",
      category: "تدريس",
      description: "مساعدة في حل المسائل الرياضية للمستوى الجامعي. متخصص في التفاضل والتكامل.",
      hourlyRate: 2,
      provider: {
        name: "أحمد محمد",
        university: "جامعة الملك سعود",
      },
    },
    {
      id: "2",
      title: "تصميم شعارات وهويات بصرية",
      category: "تصميم",
      description: "خبرة 3 سنوات في تصميم الشعارات والهويات البصرية للمشاريع الطلابية والشركات الناشئة.",
      hourlyRate: 3,
      provider: {
        name: "سارة عبدالله",
        university: "جامعة الأميرة نورة",
      },
    },
    {
      id: "3",
      title: "برمجة تطبيقات الويب",
      category: "برمجة",
      description: "تطوير واجهات المستخدم باستخدام React و TypeScript. مساعدة في مشاريع التخرج البرمجية.",
      hourlyRate: 3,
      provider: {
        name: "خالد العمري",
        university: "جامعة الملك فهد",
      },
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">مهارات مميزة</h2>
          <Button variant="outline" asChild>
            <Link to="/skills">عرض جميع المهارات</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSkills.map((skill) => (
            <SkillCard key={skill.id} {...skill} />
          ))}
        </div>
      </div>
    </section>
  );
}
