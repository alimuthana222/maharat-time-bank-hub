
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { PostForm } from "@/components/community/PostForm";
import { PostsList } from "@/components/community/PostsList";
import { ResponsiveContainer } from "@/components/ui/mobile-responsive";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const categories = [
    { value: "all", label: "جميع التصنيفات" },
    { value: "general", label: "عام" },
    { value: "study", label: "دراسة" },
    { value: "career", label: "مهني" },
    { value: "technology", label: "تقنية" },
    { value: "help", label: "مساعدة" },
  ];

  const trendingTopics = [
    { tag: "البرمجة", count: 45 },
    { tag: "التصميم", count: 32 },
    { tag: "العمل_الحر", count: 28 },
    { tag: "الدراسة", count: 51 },
    { tag: "التقنية", count: 39 },
  ];

  const handlePostCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <ResponsiveContainer className="pt-20 pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">المجتمع</h1>
            <p className="text-muted-foreground">
              شارك أفكارك واطرح أسئلتك وتفاعل مع المجتمع
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Post Creation Form */}
              <PostForm onPostCreated={handlePostCreated} />

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث في المنشورات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="فلترة حسب التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Posts List */}
              <PostsList 
                category={selectedCategory !== "all" ? selectedCategory : undefined}
                searchQuery={searchQuery}
                refreshTrigger={refreshTrigger}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    المواضيع الشائعة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">#{topic.tag}</span>
                        <Badge variant="secondary" className="text-xs">
                          {topic.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Community Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle>إرشادات المجتمع</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• كن محترماً في تعاملك مع الآخرين</li>
                    <li>• شارك محتوى مفيد وبناء</li>
                    <li>• تجنب النشر المتكرر أو الإزعاج</li>
                    <li>• احترم خصوصية الآخرين</li>
                    <li>• أبلغ عن أي محتوى مخالف</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </ResponsiveContainer>
      </main>

      <Footer />
    </div>
  );
}
