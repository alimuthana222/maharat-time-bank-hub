
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpDown,
  Clock,
  Filter,
  Plus,
  School,
  Search,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

// بيانات تجريبية للإعلانات
const ADS_DATA = [
  {
    id: "1",
    title: "خدمات برمجة وتصميم مواقع إلكترونية",
    description: "تصميم وتطوير مواقع احترافية للطلاب والمشاريع الصغيرة بأسعار مناسبة",
    category: "الخدمات الطلابية",
    subcategory: "خدمات تقنية",
    college: "كلية الحاسب",
    date: "2025-04-10",
    price: 350,
    featured: true,
    author: "أحمد محمد",
    image: "/placeholder.svg",
  },
  {
    id: "2",
    title: "سكن طلابي مؤثث بالكامل قريب من الجامعة",
    description: "شقة مؤثثة بالكامل، مكيفة، خدمات انترنت وماء وكهرباء مشمولة في السعر",
    category: "السكن والمواصلات",
    subcategory: "سكن طلابي",
    college: "جميع الكليات",
    date: "2025-04-15",
    price: 1200,
    featured: true,
    author: "خالد العتيبي",
    image: "/placeholder.svg",
  },
  {
    id: "3",
    title: "تدريب صيفي لطلاب الهندسة",
    description: "فرصة تدريب صيفي مدفوعة لطلاب الهندسة للعمل في مشاريع حقيقية",
    category: "التوظيف والتدريب",
    subcategory: "تدريب",
    college: "كلية الهندسة",
    date: "2025-04-12",
    price: 0,
    featured: false,
    author: "شركة الإنشاءات الحديثة",
    image: "/placeholder.svg",
  },
  {
    id: "4",
    title: "ملتقى الخريجين السنوي",
    description: "ملتقى لربط الطلاب الخريجين بفرص العمل وبناء شبكة علاقات مهنية",
    category: "الفعاليات والأنشطة",
    subcategory: "ملتقى",
    college: "جميع الكليات",
    date: "2025-04-18",
    price: 50,
    featured: true,
    author: "نادي الخريجين",
    image: "/placeholder.svg",
  },
  {
    id: "5",
    title: "دروس خصوصية في الرياضيات",
    description: "مدرس خبرة 5 سنوات يقدم دروس في الرياضيات المتقدمة والإحصاء",
    category: "الخدمات الطلابية",
    subcategory: "دروس خصوصية",
    college: "كلية العلوم",
    date: "2025-04-11",
    price: 150,
    featured: false,
    author: "ماجد السالم",
    image: "/placeholder.svg",
  },
  {
    id: "6",
    title: "خدمة توصيل من وإلى الجامعة",
    description: "توصيل منتظم من الأحياء القريبة إلى الجامعة بأسعار مناسبة",
    category: "السكن والمواصلات",
    subcategory: "مواصلات",
    college: "جميع الكليات",
    date: "2025-04-14",
    price: 200,
    featured: false,
    author: "سعد الحربي",
    image: "/placeholder.svg",
  },
  {
    id: "7",
    title: "يوم المهنة الطبية",
    description: "فعالية تجمع الطلاب في التخصصات الطبية مع المستشفيات والعيادات",
    category: "الفعاليات والأنشطة",
    subcategory: "ندوة",
    college: "كلية الطب",
    date: "2025-04-20",
    price: 0,
    featured: true,
    author: "النادي الطبي",
    image: "/placeholder.svg",
  },
  {
    id: "8",
    title: "وظيفة جزئية - مساعد إداري",
    description: "مطلوب مساعد إداري للعمل في مكتب الكلية بدوام جزئي مرن",
    category: "التوظيف والتدريب",
    subcategory: "وظيفة جزئية",
    college: "كلية الإدارة",
    date: "2025-04-13",
    price: 1500,
    featured: false,
    author: "إدارة كلية الإدارة",
    image: "/placeholder.svg",
  },
];

const AdCard = ({ ad }: { ad: typeof ADS_DATA[0] }) => {
  return (
    <Card className={`overflow-hidden ${ad.featured ? 'border-primary' : ''}`}>
      <div className="aspect-video relative overflow-hidden">
        <img
          src={ad.image}
          alt={ad.title}
          className="object-cover w-full h-full"
        />
        {ad.featured && (
          <Badge className="absolute top-2 right-2 bg-primary">
            مميز
          </Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{ad.title}</CardTitle>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Badge variant="outline">{ad.category}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{ad.date}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="line-clamp-2 text-sm text-muted-foreground">{ad.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="font-bold">
          {ad.price > 0 ? `${ad.price} ريال` : 'مجاناً'}
        </div>
        <Link to={`/ads/${ad.id}`}>
          <Button size="sm">عرض التفاصيل</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default function AdvertisementMarket() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [sortOption, setSortOption] = useState("");

  // تصفية الإعلانات حسب المعايير المختارة
  const filteredAds = ADS_DATA.filter((ad) => {
    // تصفية حسب التبويب النشط
    if (activeTab !== "all" && ad.category !== activeTab) {
      return false;
    }
    
    // تصفية حسب البحث
    if (searchTerm && !ad.title.includes(searchTerm) && !ad.description.includes(searchTerm)) {
      return false;
    }
    
    // تصفية حسب الفئة الفرعية
    if (selectedCategory && ad.subcategory !== selectedCategory) {
      return false;
    }
    
    // تصفية حسب الكلية
    if (selectedCollege && ad.college !== selectedCollege) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // ترتيب الإعلانات
    if (sortOption === "price_asc") {
      return a.price - b.price;
    } else if (sortOption === "price_desc") {
      return b.price - a.price;
    } else if (sortOption === "date_desc") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOption === "date_asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    
    // افتراضياً، عرض الإعلانات المميزة أولاً
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    return 0;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">سوق الإعلانات</h1>
            <p className="text-muted-foreground">تصفح أحدث الإعلانات المتاحة في المنصة</p>
          </div>
          
          <Link to="/ads/create">
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة إعلان جديد
            </Button>
          </Link>
        </div>
        
        {/* أقسام التصنيف الرئيسية */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="mb-6 overflow-auto w-full justify-start">
            <TabsTrigger value="all">جميع الإعلانات</TabsTrigger>
            <TabsTrigger value="الخدمات الطلابية">الخدمات الطلابية</TabsTrigger>
            <TabsTrigger value="السكن والمواصلات">السكن والمواصلات</TabsTrigger>
            <TabsTrigger value="التوظيف والتدريب">التوظيف والتدريب</TabsTrigger>
            <TabsTrigger value="الفعاليات والأنشطة">الفعاليات والأنشطة</TabsTrigger>
          </TabsList>
          
          {/* أدوات البحث والتصفية */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن إعلان..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="التصنيف الفرعي" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصنيفات</SelectItem>
                  <SelectItem value="خدمات تقنية">خدمات تقنية</SelectItem>
                  <SelectItem value="دروس خصوصية">دروس خصوصية</SelectItem>
                  <SelectItem value="سكن طلابي">سكن طلابي</SelectItem>
                  <SelectItem value="مواصلات">مواصلات</SelectItem>
                  <SelectItem value="تدريب">تدريب</SelectItem>
                  <SelectItem value="وظيفة جزئية">وظيفة جزئية</SelectItem>
                  <SelectItem value="ملتقى">ملتقى</SelectItem>
                  <SelectItem value="ندوة">ندوة</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4" />
                    <SelectValue placeholder="الكلية" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الكليات</SelectItem>
                  <SelectItem value="كلية الحاسب">كلية الحاسب</SelectItem>
                  <SelectItem value="كلية الهندسة">كلية الهندسة</SelectItem>
                  <SelectItem value="كلية الطب">كلية الطب</SelectItem>
                  <SelectItem value="كلية العلوم">كلية العلوم</SelectItem>
                  <SelectItem value="كلية الإدارة">كلية الإدارة</SelectItem>
                  <SelectItem value="جميع الكليات">جميع الكليات</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="الترتيب" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">الأبرز</SelectItem>
                  <SelectItem value="price_asc">السعر: الأقل أولاً</SelectItem>
                  <SelectItem value="price_desc">السعر: الأعلى أولاً</SelectItem>
                  <SelectItem value="date_desc">التاريخ: الأحدث أولاً</SelectItem>
                  <SelectItem value="date_asc">التاريخ: الأقدم أولاً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* عرض الإعلانات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAds.length > 0 ? (
              filteredAds.map((ad) => <AdCard key={ad.id} ad={ad} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">لا توجد إعلانات متطابقة مع معايير البحث</p>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
