
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Code2, 
  Paintbrush, 
  PenTool, 
  BookOpen, 
  Calculator, 
  Globe, 
  Camera, 
  Music,
  Laptop,
  Target,
  Lightbulb,
  Heart
} from "lucide-react";

const categories = [
  {
    id: "programming",
    title: "البرمجة والتطوير",
    description: "تطوير المواقع، التطبيقات، وعلوم الحاسوب",
    icon: Code2,
    color: "bg-blue-500",
    skills: ["React", "Python", "Java", "JavaScript", "Mobile Apps"]
  },
  {
    id: "design",
    title: "التصميم والإبداع",
    description: "التصميم الجرافيكي، UI/UX، والفنون الرقمية",
    icon: Paintbrush,
    color: "bg-purple-500",
    skills: ["Photoshop", "Figma", "Illustrator", "Branding", "3D Design"]
  },
  {
    id: "writing",
    title: "الكتابة والمحتوى",
    description: "كتابة المحتوى، الترجمة، والتحرير",
    icon: PenTool,
    color: "bg-green-500",
    skills: ["Content Writing", "Copywriting", "Translation", "Editing", "SEO"]
  },
  {
    id: "academic",
    title: "المواد الأكاديمية",
    description: "الرياضيات، العلوم، والمواد الدراسية",
    icon: BookOpen,
    color: "bg-indigo-500",
    skills: ["Mathematics", "Physics", "Chemistry", "Biology", "Engineering"]
  },
  {
    id: "business",
    title: "الأعمال والإدارة",
    description: "ريادة الأعمال، التسويق، والإدارة",
    icon: Target,
    color: "bg-orange-500",
    skills: ["Marketing", "Management", "Finance", "Strategy", "Leadership"]
  },
  {
    id: "languages",
    title: "اللغات",
    description: "تعلم وتدريس اللغات المختلفة",
    icon: Globe,
    color: "bg-cyan-500",
    skills: ["English", "Arabic", "French", "German", "Spanish"]
  },
  {
    id: "media",
    title: "الإعلام والإنتاج",
    description: "التصوير، المونتاج، والإنتاج الرقمي",
    icon: Camera,
    color: "bg-pink-500",
    skills: ["Photography", "Video Editing", "Audio Production", "Animation"]
  },
  {
    id: "music",
    title: "الموسيقى والفنون",
    description: "العزف، التلحين، والفنون الأدائية",
    icon: Music,
    color: "bg-red-500",
    skills: ["Guitar", "Piano", "Singing", "Music Production", "Performance"]
  }
];

export function SkillCategories() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            فئات المهارات المتاحة
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعة واسعة من المهارات التي يمكنك تعلمها أو تدريسها في مجتمعنا
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {category.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-xs">
                      +{category.skills.length - 3}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            لم تجد المهارة التي تبحث عنها؟
          </p>
          <Badge variant="outline" className="px-4 py-2">
            <Lightbulb className="h-4 w-4 mr-2" />
            يمكنك إضافة مهارات جديدة إلى المنصة
          </Badge>
        </div>
      </div>
    </section>
  );
}
