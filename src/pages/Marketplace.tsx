
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ShoppingBag,
  Plus,
  Search,
  SlidersHorizontal,
  Check,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ListingCardProps } from "@/components/marketplace/ListingCard";

// Sample marketplace listings
const dummyListings: ListingCardProps[] = [
  {
    id: "1",
    title: "تصميم شعارات للمشاريع الطلابية",
    type: "offer",
    category: "تصميم",
    description: "أقدم خدمات تصميم الشعارات والهويات البصرية للمشاريع الطلابية بأسعار مناسبة. خبرة 3 سنوات في تصميم الشعارات وتصميم الهويات البصرية واستخدام برامج Adobe Suite.",
    hourlyRate: 2,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      name: "سارة عبدالله",
      university: "جامعة الأميرة نورة",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
    },
    tags: ["تصميم شعارات", "هوية بصرية", "تصميم جرافيك", "Photoshop", "Illustrator"],
  },
  {
    id: "2",
    title: "تدريس مادة الرياضيات للمرحلة الجامعية",
    type: "offer",
    category: "تدريس",
    description: "أقدم دروس خصوصية في مادة الرياضيات للمرحلة الجامعية، متخصص في مواد التفاضل والتكامل والمعادلات التفاضلية والجبر الخطي. خبرة 4 سنوات في التدريس.",
    hourlyRate: 3,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      name: "أحمد محمد",
      university: "جامعة الملك سعود",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    tags: ["رياضيات", "تفاضل وتكامل", "معادلات تفاضلية", "جبر خطي"],
  },
  {
    id: "3",
    title: "مطلوب مساعدة في مشروع برمجة",
    type: "need",
    category: "برمجة",
    description: "أحتاج مساعدة في مشروع تخرج يستخدم تقنيات React و Node.js. المشروع عبارة عن منصة إلكترونية لتبادل الكتب بين الطلاب. أحتاج مساعدة في تطوير واجهة المستخدم والربط مع قاعدة البيانات.",
    hourlyRate: 3,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      name: "خالد العمري",
      university: "جامعة الملك فهد",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
    tags: ["React", "Node.js", "تطوير ويب", "مشروع تخرج"],
  },
  {
    id: "4",
    title: "ترجمة نصوص أكاديمية من الإنجليزية للعربية",
    type: "offer",
    category: "ترجمة",
    description: "أقدم خدمات ترجمة النصوص الأكاديمية والعلمية من اللغة الإنجليزية إلى العربية. خبرة 5 سنوات في الترجمة الأكاديمية وحاصل على شهادة في الترجمة.",
    hourlyRate: 2.5,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      name: "محمد العلي",
      university: "جامعة الملك سعود",
      avatarUrl: "https://i.pravatar.cc/150?img=14",
    },
    tags: ["ترجمة", "إنجليزي", "عربي", "نصوص أكاديمية"],
  },
  {
    id: "5",
    title: "مطلوب تصوير فوتوغرافي لفعالية طلابية",
    type: "need",
    category: "تصوير",
    description: "نبحث عن مصور فوتوغرافي لتغطية فعالية طلابية تقام في الجامعة. مدة الفعالية 3 ساعات، ونحتاج صور احترافية للفعالية والمشاركين.",
    hourlyRate: 4,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      name: "ليلى أحمد",
      university: "جامعة الأميرة نورة",
      avatarUrl: "https://i.pravatar.cc/150?img=9",
    },
    tags: ["تصوير", "فعالية طلابية", "تصوير احترافي"],
  },
  {
    id: "6",
    title: "كتابة وتدقيق أبحاث علمية",
    type: "offer",
    category: "كتابة",
    description: "أقدم خدمات كتابة وتدقيق الأبحاث العلمية والأوراق الأكاديمية. خبرة 4 سنوات في الكتابة الأكاديمية وحاصل على درجة الماجستير.",
    hourlyRate: 3.5,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      name: "فاطمة الزهراء",
      university: "جامعة الملك عبد العزيز",
      avatarUrl: "https://i.pravatar.cc/150?img=20",
    },
    tags: ["كتابة أكاديمية", "تدقيق لغوي", "أبحاث علمية"],
  },
  {
    id: "7",
    title: "تصميم وتطوير موقع إلكتروني",
    type: "offer",
    category: "برمجة",
    description: "أقدم خدمات تصميم وتطوير المواقع الإلكترونية باستخدام أحدث التقنيات. خبرة 5 سنوات في تطوير الويب واستخدام تقنيات React وNext.js وTailwind CSS.",
    hourlyRate: 4,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      name: "عمر الفارس",
      university: "جامعة الملك فهد",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
    },
    tags: ["تطوير ويب", "React", "Next.js", "Tailwind CSS", "تصميم مواقع"],
  },
  {
    id: "8",
    title: "مطلوب مساعدة في تحرير فيديو",
    type: "need",
    category: "تصميم",
    description: "أبحث عن شخص لديه خبرة في تحرير الفيديو لمساعدتي في مشروع فيديو تعليمي. المطلوب تحرير الفيديو وإضافة مؤثرات بصرية وصوتية.",
    hourlyRate: 3,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    postedBy: {
      name: "نوف السالم",
      university: "جامعة الأميرة نورة",
      avatarUrl: "https://i.pravatar.cc/150?img=25",
    },
    tags: ["تحرير فيديو", "مونتاج", "فيديو تعليمي", "After Effects", "Premiere Pro"],
  },
];

const categories = [
  "الكل",
  "برمجة",
  "تصميم",
  "ترجمة",
  "تدريس",
  "كتابة",
  "تصوير",
  "صوتيات",
  "تسويق",
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [minHourlyRate, setMinHourlyRate] = useState(0);
  const [maxHourlyRate, setMaxHourlyRate] = useState(5);
  const [filteredListings, setFilteredListings] = useState<ListingCardProps[]>(dummyListings);
  const [visibleFilters, setVisibleFilters] = useState(false);
  
  // Apply filters when any filter criteria changes
  useEffect(() => {
    let result = [...dummyListings];
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(listing => 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by category
    if (selectedCategory !== "الكل") {
      result = result.filter(listing => listing.category === selectedCategory);
    }
    
    // Filter by type
    if (selectedType !== "all") {
      result = result.filter(listing => listing.type === selectedType);
    }
    
    // Filter by hourly rate
    result = result.filter(
      listing => listing.hourlyRate >= minHourlyRate && listing.hourlyRate <= maxHourlyRate
    );
    
    // Sort results
    if (sortBy === "latest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "hourly-rate-asc") {
      result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (sortBy === "hourly-rate-desc") {
      result.sort((a, b) => b.hourlyRate - a.hourlyRate);
    }
    
    setFilteredListings(result);
  }, [searchQuery, selectedCategory, selectedType, minHourlyRate, maxHourlyRate, sortBy]);
  
  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("الكل");
    setSelectedType("all");
    setSortBy("latest");
    setMinHourlyRate(0);
    setMaxHourlyRate(5);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-10 mt-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">سوق المهارات</h1>
            </div>
            <p className="text-muted-foreground">
              استعرض عروض وطلبات المهارات المتاحة وتواصل مع الطلاب
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/marketplace/create" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                إنشاء إعلان جديد
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Filters and search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ابحث عن مهارات، خدمات..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">الأحدث أولاً</SelectItem>
                  <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                  <SelectItem value="hourly-rate-asc">السعر: من الأقل للأعلى</SelectItem>
                  <SelectItem value="hourly-rate-desc">السعر: من الأعلى للأقل</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setVisibleFilters(!visibleFilters)}
                className={visibleFilters ? "bg-muted" : ""}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {visibleFilters && (
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">التصنيف</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">نوع الإعلان</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="نوع الإعلان" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="offer">عرض خدمة</SelectItem>
                      <SelectItem value="need">طلب خدمة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">معدل الساعة</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="من"
                      min={0}
                      max={5}
                      value={minHourlyRate}
                      onChange={(e) => setMinHourlyRate(Number(e.target.value))}
                      className="w-full"
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      placeholder="إلى"
                      min={0}
                      max={5}
                      value={maxHourlyRate}
                      onChange={(e) => setMaxHourlyRate(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="ghost" onClick={handleResetFilters}>
                  <X className="mr-2 h-4 w-4" />
                  إعادة ضبط
                </Button>
              </div>
            </div>
          )}
          
          {/* Active filters */}
          {(selectedCategory !== "الكل" || selectedType !== "all" || minHourlyRate > 0 || maxHourlyRate < 5) && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">الفلاتر النشطة:</span>
              
              {selectedCategory !== "الكل" && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("الكل")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {selectedType !== "all" && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {selectedType === "offer" ? "عرض خدمة" : "طلب خدمة"}
                  <button onClick={() => setSelectedType("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {(minHourlyRate > 0 || maxHourlyRate < 5) && (
                <Badge variant="outline" className="flex items-center gap-1">
                  السعر: {minHourlyRate} - {maxHourlyRate} ساعة
                  <button onClick={() => { setMinHourlyRate(0); setMaxHourlyRate(5); }}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {/* Content */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="offers">العروض</TabsTrigger>
            <TabsTrigger value="needs">الطلبات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">لا توجد نتائج</h3>
                  <p className="text-muted-foreground mb-6">
                    لا توجد إعلانات تطابق معايير البحث. جرب تعديل الفلاتر أو البحث بكلمات مختلفة.
                  </p>
                  <Button onClick={handleResetFilters}>إعادة ضبط الفلاتر</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="offers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.filter(listing => listing.type === "offer").length > 0 ? (
                filteredListings
                  .filter(listing => listing.type === "offer")
                  .map((listing) => (
                    <ListingCard key={listing.id} {...listing} />
                  ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">لا توجد عروض</h3>
                  <p className="text-muted-foreground mb-6">
                    لا توجد عروض تطابق معايير البحث. جرب تعديل الفلاتر أو البحث بكلمات مختلفة.
                  </p>
                  <Button onClick={handleResetFilters}>إعادة ضبط الفلاتر</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="needs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.filter(listing => listing.type === "need").length > 0 ? (
                filteredListings
                  .filter(listing => listing.type === "need")
                  .map((listing) => (
                    <ListingCard key={listing.id} {...listing} />
                  ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">لا توجد طلبات</h3>
                  <p className="text-muted-foreground mb-6">
                    لا توجد طلبات تطابق معايير البحث. جرب تعديل الفلاتر أو البحث بكلمات مختلفة.
                  </p>
                  <Button onClick={handleResetFilters}>إعادة ضبط الفلاتر</Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
