
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code, PenTool, Languages, GraduationCap, Camera, BookOpen, Headphones, Layout } from "lucide-react";

export function SkillCategories() {
  // Skill categories with more detail
  const skillCategories = [
    {
      icon: <Code className="h-10 w-10 text-blue-500" />,
      name: "برمجة",
      description: "تطوير الواجهات، تطبيقات الموبايل، قواعد البيانات، وتطوير المواقع",
      color: "bg-blue-500/10 border-blue-500/20",
      hoverColor: "hover:border-blue-500/40 hover:bg-blue-500/20",
      iconColor: "text-blue-500",
      count: 48,
    },
    {
      icon: <PenTool className="h-10 w-10 text-orange-500" />,
      name: "تصميم",
      description: "تصميم الشعارات، الهويات البصرية، الإعلانات، والمواقع الإلكترونية",
      color: "bg-orange-500/10 border-orange-500/20",
      hoverColor: "hover:border-orange-500/40 hover:bg-orange-500/20",
      iconColor: "text-orange-500",
      count: 35,
    },
    {
      icon: <Languages className="h-10 w-10 text-purple-500" />,
      name: "ترجمة",
      description: "ترجمة النصوص، الأبحاث العلمية، المقالات، والمحتوى التسويقي",
      color: "bg-purple-500/10 border-purple-500/20",
      hoverColor: "hover:border-purple-500/40 hover:bg-purple-500/20",
      iconColor: "text-purple-500",
      count: 27,
    },
    {
      icon: <GraduationCap className="h-10 w-10 text-teal-500" />,
      name: "تدريس",
      description: "دروس خصوصية في مختلف المواد الدراسية والتخصصات الجامعية",
      color: "bg-teal-500/10 border-teal-500/20",
      hoverColor: "hover:border-teal-500/40 hover:bg-teal-500/20",
      iconColor: "text-teal-500",
      count: 42,
    },
    {
      icon: <Camera className="h-10 w-10 text-pink-500" />,
      name: "تصوير",
      description: "تصوير المناسبات، تصوير المنتجات، تحرير الصور والفيديو",
      color: "bg-pink-500/10 border-pink-500/20",
      hoverColor: "hover:border-pink-500/40 hover:bg-pink-500/20",
      iconColor: "text-pink-500",
      count: 19,
    },
    {
      icon: <BookOpen className="h-10 w-10 text-red-500" />,
      name: "كتابة",
      description: "كتابة المحتوى، التدقيق اللغوي، الأبحاث، والمقالات العلمية",
      color: "bg-red-500/10 border-red-500/20",
      hoverColor: "hover:border-red-500/40 hover:bg-red-500/20",
      iconColor: "text-red-500",
      count: 23,
    },
    {
      icon: <Headphones className="h-10 w-10 text-green-500" />,
      name: "صوتيات",
      description: "تسجيل صوتي، تعليق صوتي، مونتاج الصوت، وإنتاج البودكاست",
      color: "bg-green-500/10 border-green-500/20",
      hoverColor: "hover:border-green-500/40 hover:bg-green-500/20",
      iconColor: "text-green-500",
      count: 15,
    },
    {
      icon: <Layout className="h-10 w-10 text-indigo-500" />,
      name: "تسويق",
      description: "إدارة وسائل التواصل، تسويق إلكتروني، وإدارة الحملات الإعلانية",
      color: "bg-indigo-500/10 border-indigo-500/20",
      hoverColor: "hover:border-indigo-500/40 hover:bg-indigo-500/20",
      iconColor: "text-indigo-500",
      count: 31,
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">استكشف فئات المهارات</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            تصفح مجموعة متنوعة من المهارات التي يقدمها زملاؤك الطلاب في مختلف المجالات
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <Card 
              key={index} 
              className={`transition-all duration-300 border ${category.color} ${category.hoverColor}`}
            >
              <CardHeader className="pb-3">
                <div className={`mb-2 p-3 rounded-full w-fit ${category.color}`}>
                  {category.icon}
                </div>
                <CardTitle className="flex justify-between items-center">
                  <span>{category.name}</span>
                  <span className="text-sm font-normal px-3 py-1 rounded-full bg-muted">
                    {category.count}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground">
                  {category.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full">
                  <Link to={`/skills?category=${category.name}`} className="flex justify-center">
                    تصفح المهارات
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link to="/skills" className="flex items-center">
              عرض جميع المهارات
              <ArrowRight className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
