
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code, PenTool, Languages, GraduationCap } from "lucide-react";

export function SkillCategories() {
  // Skill categories
  const skillCategories = [
    {
      icon: <Code className="h-10 w-10 text-maharat-blue" />,
      name: "برمجة",
      description: "تطوير الواجهات، تطبيقات الموبايل، قواعد البيانات، وتطوير المواقع",
    },
    {
      icon: <PenTool className="h-10 w-10 text-maharat-orange" />,
      name: "تصميم",
      description: "تصميم الشعارات، الهويات البصرية، الإعلانات، والمواقع الإلكترونية",
    },
    {
      icon: <Languages className="h-10 w-10 text-maharat-purple" />,
      name: "ترجمة",
      description: "ترجمة النصوص، الأبحاث العلمية، المقالات، والمحتوى التسويقي",
    },
    {
      icon: <GraduationCap className="h-10 w-10 text-maharat-teal" />,
      name: "تدريس",
      description: "دروس خصوصية في مختلف المواد الدراسية والتخصصات الجامعية",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">استكشف فئات المهارات</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            تصفح مجموعة متنوعة من المهارات التي يقدمها زملاؤك الطلاب في مختلف المجالات
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="mb-2">{category.icon}</div>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground">
                  {category.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full">
                  <Link to={`/skills`} className="flex justify-center">
                    تصفح المهارات
                    <ArrowRight className="mr-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
