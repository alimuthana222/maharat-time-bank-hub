
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { CreateListingForm } from "@/components/marketplace/CreateListingForm";
import { OrderManagement } from "@/components/marketplace/OrderManagement";
import { ResponsiveContainer, ResponsiveGrid } from "@/components/ui/mobile-responsive";
import { PageLoading } from "@/components/common/LoadingStates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [listings, setListings] = useState([
    {
      id: "1",
      title: "تدريس الرياضيات",
      description: "دروس خصوصية في الرياضيات لجميع المراحل الدراسية مع شرح مفصل وحل التمارين",
      category: "تدريس",
      type: "offer" as const,
      hourlyRate: 2,
      postedBy: {
        name: "أحمد محمد",
        university: "جامعة الملك سعود",
        avatarUrl: "https://i.pravatar.cc/150?u=ahmed"
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      tags: ["رياضيات", "تدريس", "مراجعة"],
    },
    {
      id: "2", 
      title: "تصميم مواقع ويب",
      description: "تصميم وتطوير مواقع ويب احترافية باستخدام أحدث التقنيات والأدوات",
      category: "برمجة",
      type: "offer" as const,
      hourlyRate: 3,
      postedBy: {
        name: "سارة أحمد",
        university: "جامعة الملك عبدالعزيز",
        avatarUrl: "https://i.pravatar.cc/150?u=sarah"
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      tags: ["ويب", "تصميم", "برمجة"],
    },
    {
      id: "3",
      title: "مساعدة في البحث العلمي",
      description: "أبحث عن مساعدة في كتابة وتنسيق البحث العلمي وجمع المراجع",
      category: "كتابة",
      type: "need" as const,
      hourlyRate: 1,
      postedBy: {
        name: "محمد عبدالله",
        university: "جامعة الإمام",
        avatarUrl: "https://i.pravatar.cc/150?u=mohammed"
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      tags: ["بحث", "كتابة", "أكاديمي"],
    }
  ]);

  const categories = [
    { value: "all", label: "جميع التصنيفات" },
    { value: "تدريس", label: "تدريس" },
    { value: "برمجة", label: "برمجة" },
    { value: "تصميم", label: "تصميم" },
    { value: "ترجمة", label: "ترجمة" },
    { value: "كتابة", label: "كتابة" },
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateListing = (newListing: any) => {
    setListings(prev => [newListing, ...prev]);
    setShowCreateForm(false);
  };

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <ResponsiveContainer className="pt-20 pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">السوق</h1>
            <p className="text-muted-foreground">
              اكتشف واحجز الخدمات من الطلاب المحترفين
            </p>
          </div>

          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid grid-cols-3 w-full md:w-auto mb-8">
              <TabsTrigger value="browse">تصفح الخدمات</TabsTrigger>
              <TabsTrigger value="orders">طلباتي</TabsTrigger>
              <TabsTrigger value="create">إنشاء خدمة</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث عن الخدمات..."
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

              {/* Listings Grid */}
              <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }}>
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))}
              </ResponsiveGrid>

              {filteredListings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery || selectedCategory !== "all" 
                      ? "لم يتم العثور على نتائج مطابقة للبحث"
                      : "لا توجد خدمات متاحة حالياً"
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders">
              <OrderManagement />
            </TabsContent>

            <TabsContent value="create">
              <div className="max-w-2xl mx-auto">
                <CreateListingForm 
                  open={showCreateForm}
                  onOpenChange={setShowCreateForm}
                  onCreateListing={handleCreateListing}
                />
                
                {!showCreateForm && (
                  <div className="text-center py-12">
                    <Button onClick={() => setShowCreateForm(true)} size="lg">
                      <Plus className="h-4 w-4 mr-2" />
                      إنشاء خدمة جديدة
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </ResponsiveContainer>
      </main>

      <Footer />
    </div>
  );
}
