
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { CreatePost } from "@/components/community/CreatePost";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, ResponsiveGrid } from "@/components/ui/mobile-responsive";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, Users, Award } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "جميع التصنيفات" },
    { value: "برمجة", label: "برمجة" },
    { value: "تصميم", label: "تصميم" },
    { value: "كتابة", label: "كتابة" },
    { value: "تدريس", label: "تدريس" },
    { value: "تعاون", label: "تعاون" },
  ];

  const trendingTopics = [
    { topic: "تطوير التطبيقات", posts: 45 },
    { topic: "التصميم الجرافيكي", posts: 32 },
    { topic: "الذكاء الاصطناعي", posts: 28 },
    { topic: "التسويق الرقمي", posts: 24 },
    { topic: "ريادة الأعمال", posts: 19 }
  ];

  const topContributors = [
    { name: "أحمد محمد", points: 1250, avatar: "https://i.pravatar.cc/150?u=ahmed" },
    { name: "سارة أحمد", points: 980, avatar: "https://i.pravatar.cc/150?u=sarah" },
    { name: "محمد عبدالله", points: 875, avatar: "https://i.pravatar.cc/150?u=mohammed" },
    { name: "فاطمة علي", points: 720, avatar: "https://i.pravatar.cc/150?u=fatima" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <ResponsiveContainer className="pt-20 pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">المجتمع</h1>
            <p className="text-muted-foreground">
              تواصل مع زملائك الطلاب وشارك معارفك وخبراتك
            </p>
          </div>

          <ResponsiveGrid cols={{ default: 1, lg: 4 }} className="gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <Tabs defaultValue="feed" className="w-full">
                <TabsList className="grid grid-cols-3 w-full md:w-auto">
                  <TabsTrigger value="feed">التغذية</TabsTrigger>
                  <TabsTrigger value="trending">الشائع</TabsTrigger>
                  <TabsTrigger value="following">المتابَعون</TabsTrigger>
                </TabsList>

                <TabsContent value="feed" className="space-y-6">
                  {/* Search and Filter */}
                  <Card>
                    <CardContent className="p-4">
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
                            <SelectValue placeholder="التصنيف" />
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
                    </CardContent>
                  </Card>

                  {/* Create Post */}
                  <CreatePost />
                  
                  {/* Community Feed */}
                  <CommunityFeed />
                </TabsContent>

                <TabsContent value="trending" className="space-y-6">
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">المنشورات الشائعة ستظهر هنا قريباً</p>
                  </div>
                </TabsContent>

                <TabsContent value="following" className="space-y-6">
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">منشورات الأشخاص الذين تتابعهم ستظهر هنا</p>
                  </div>
                </TabsContent>
              </Tabs>
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
                <CardContent className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">#{topic.topic}</span>
                      <span className="text-xs text-muted-foreground">{topic.posts} منشور</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top Contributors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    أكثر المساهمين
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topContributors.map((contributor, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold">
                        {index + 1}
                      </div>
                      <img 
                        src={contributor.avatar} 
                        alt={contributor.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{contributor.name}</p>
                        <p className="text-xs text-muted-foreground">{contributor.points} نقطة</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    إنشاء مجموعة دراسة
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    البحث عن شريك مشروع
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    طرح سؤال
                  </Button>
                </CardContent>
              </Card>
            </div>
          </ResponsiveGrid>
        </ResponsiveContainer>
      </main>

      <Footer />
    </div>
  );
}
