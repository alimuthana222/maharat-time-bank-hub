
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventCard } from "@/components/community/EventCard";
import { EventForm } from "@/components/community/EventForm";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Search,
  Plus,
  MapPin,
  Clock,
  Users,
  Tag,
  Filter,
} from "lucide-react";
import { formatDate } from "@/lib/date-utils";

// Sample events data
const dummyEvents = [
  {
    id: "1",
    title: "ورشة عمل: مقدمة في تطوير تطبيقات الويب",
    description: "ورشة عمل تفاعلية لتعلم أساسيات تطوير تطبيقات الويب باستخدام React وNode.js. ستتضمن الورشة تطبيقات عملية وأمثلة حية.",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    location: "قاعة المؤتمرات الرئيسية - كلية علوم الحاسب",
    organizer: {
      id: "user-1",
      name: "أحمد محمد",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      university: "جامعة الملك سعود",
    },
    attendees: 42,
    maxAttendees: 50,
    category: "تقنية",
    tags: ["برمجة", "تطوير ويب", "React", "Node.js"],
    isOnline: false,
    isAttending: false,
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29kaW5nJTIwd29ya3Nob3B8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "2",
    title: "ندوة: مستقبل الذكاء الاصطناعي",
    description: "ندوة حوارية حول مستقبل الذكاء الاصطناعي وتأثيره على سوق العمل والمجتمع. سيشارك في الندوة نخبة من الخبراء والمختصين في مجال الذكاء الاصطناعي.",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    location: "المدرج الرئيسي - كلية الهندسة",
    organizer: {
      id: "user-2",
      name: "سارة عبدالله",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      university: "جامعة الأميرة نورة",
    },
    attendees: 120,
    maxAttendees: 200,
    category: "تقنية",
    tags: ["ذكاء اصطناعي", "تقنية", "مستقبل", "سوق العمل"],
    isOnline: false,
    isAttending: true,
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "3",
    title: "ورشة تصميم الجرافيك",
    description: "ورشة عمل لتعلم أساسيات تصميم الجرافيك باستخدام Adobe Photoshop و Illustrator. ستتضمن الورشة تطبيقات عملية وأمثلة حية.",
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    location: "مختبر التصميم - كلية الفنون",
    organizer: {
      id: "user-3",
      name: "خالد العمري",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      university: "جامعة الملك فهد",
    },
    attendees: 15,
    maxAttendees: 20,
    category: "تصميم",
    tags: ["تصميم جرافيك", "Photoshop", "Illustrator", "تصميم"],
    isOnline: false,
    isAttending: false,
    imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhcGhpYyUyMGRlc2lnbiUyMGNsYXNzfGVufDB8fDB8fHww",
  },
  {
    id: "4",
    title: "حلقة نقاش: التسويق الرقمي للمشاريع الناشئة",
    description: "حلقة نقاش حول استراتيجيات التسويق الرقمي للمشاريع الناشئة وكيفية بناء هوية تجارية قوية على الإنترنت.",
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    location: "أونلاين عبر Zoom",
    organizer: {
      id: "user-4",
      name: "ليلى أحمد",
      avatarUrl: "https://i.pravatar.cc/150?img=9",
      university: "جامعة الأميرة نورة",
    },
    attendees: 85,
    maxAttendees: 100,
    category: "تسويق",
    tags: ["تسويق رقمي", "مشاريع ناشئة", "ريادة أعمال"],
    isOnline: true,
    isAttending: false,
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlnaXRhbCUyMG1hcmtldGluZ3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "5",
    title: "معسكر برمجة تطبيقات الموبايل",
    description: "معسكر تدريبي مكثف لمدة 3 أيام لتعلم تطوير تطبيقات الموبايل باستخدام React Native. سيتضمن المعسكر تطبيقات عملية ومشاريع حقيقية.",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    location: "مركز الابتكار - الحرم الجامعي",
    organizer: {
      id: "user-5",
      name: "محمد العلي",
      avatarUrl: "https://i.pravatar.cc/150?img=14",
      university: "جامعة الملك سعود",
    },
    attendees: 28,
    maxAttendees: 30,
    category: "تقنية",
    tags: ["تطوير تطبيقات", "React Native", "برمجة", "موبايل"],
    isOnline: false,
    isAttending: false,
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvZGluZyUyMGNhbXB8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "6",
    title: "مسابقة الابتكار الطلابي",
    description: "مسابقة سنوية للابتكار الطلابي تهدف إلى تشجيع الإبداع وريادة الأعمال بين الطلاب. ستتاح الفرصة للفرق المشاركة لعرض أفكارهم أمام لجنة من الخبراء.",
    startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    location: "قاعة المؤتمرات الكبرى - الجامعة",
    organizer: {
      id: "user-6",
      name: "فاطمة الزهراء",
      avatarUrl: "https://i.pravatar.cc/150?img=20",
      university: "جامعة الملك عبد العزيز",
    },
    attendees: 150,
    maxAttendees: 300,
    category: "ابتكار",
    tags: ["ابتكار", "ريادة أعمال", "مسابقة", "مشاريع طلابية"],
    isOnline: false,
    isAttending: true,
    imageUrl: "https://images.unsplash.com/photo-1558403194-611308249627?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5ub3ZhdGlvbiUyMGNvbnRlc3R8ZW58MHx8MHx8fDA%3D",
  },
];

// Event categories
const eventCategories = [
  "الكل",
  "تقنية",
  "تصميم",
  "تسويق",
  "ريادة أعمال",
  "ابتكار",
  "تعليم",
  "ترفيه",
  "اجتماعي",
  "رياضي",
];

export default function Events() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showAttendingOnly, setShowAttendingOnly] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState(dummyEvents);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Filter events
  useEffect(() => {
    let result = [...dummyEvents];
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by category
    if (selectedCategory !== "الكل") {
      result = result.filter(event => event.category === selectedCategory);
    }
    
    // Filter online events
    if (showOnlineOnly) {
      result = result.filter(event => event.isOnline);
    }
    
    // Filter attending events
    if (showAttendingOnly) {
      result = result.filter(event => event.isAttending);
    }
    
    // Sort by date
    result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    setFilteredEvents(result);
  }, [searchQuery, selectedCategory, showOnlineOnly, showAttendingOnly]);
  
  // Group events by month
  const groupEventsByMonth = () => {
    const grouped = filteredEvents.reduce((acc, event) => {
      const date = new Date(event.startDate);
      const monthYear = date.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
      
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      
      acc[monthYear].push(event);
      return acc;
    }, {});
    
    return grouped;
  };
  
  const groupedEvents = groupEventsByMonth();
  const eventMonths = Object.keys(groupedEvents);
  
  // Toggle attendance
  const toggleAttendance = (eventId) => {
    // In a real app, this would be an API call
    const updatedEvents = filteredEvents.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          isAttending: !event.isAttending,
          attendees: event.isAttending ? event.attendees - 1 : event.attendees + 1
        };
      }
      return event;
    });
    
    setFilteredEvents(updatedEvents);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-10 mt-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">الفعاليات والأنشطة</h1>
            </div>
            <p className="text-muted-foreground">
              استكشف الفعاليات والأنشطة القادمة وشارك مع مجتمع الطلاب
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  إنشاء فعالية جديدة
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>إنشاء فعالية جديدة</DialogTitle>
                  <DialogDescription>
                    أدخل تفاصيل الفعالية التي ترغب في تنظيمها
                  </DialogDescription>
                </DialogHeader>
                <EventForm onSubmit={() => setIsCreateDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Filters and search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ابحث عن فعاليات..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 rounded-md border bg-background"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {eventCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              
              <Button
                variant={showOnlineOnly ? "default" : "outline"}
                onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                className="hidden sm:flex"
              >
                أونلاين فقط
              </Button>
              
              <Button
                variant={showAttendingOnly ? "default" : "outline"}
                onClick={() => setShowAttendingOnly(!showAttendingOnly)}
                className="hidden sm:flex"
              >
                فعالياتي
              </Button>
            </div>
          </div>
          
          <div className="flex sm:hidden gap-2">
            <Button
              variant={showOnlineOnly ? "default" : "outline"}
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className="flex-1"
            >
              أونلاين فقط
            </Button>
            
            <Button
              variant={showAttendingOnly ? "default" : "outline"}
              onClick={() => setShowAttendingOnly(!showAttendingOnly)}
              className="flex-1"
            >
              فعالياتي
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-12">
          {eventMonths.length > 0 ? (
            eventMonths.map(month => (
              <div key={month} className="space-y-4">
                <h2 className="text-2xl font-bold pb-2 border-b">{month}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedEvents[month].map(event => (
                    <EventCard 
                      key={event.id}
                      event={event}
                      onAttendanceToggle={() => toggleAttendance(event.id)}
                      isLoggedIn={!!user}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">لا توجد فعاليات</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                لا توجد فعاليات تطابق معايير البحث. جرب تعديل الفلاتر أو البحث بكلمات مختلفة.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedCategory("الكل");
                setShowOnlineOnly(false);
                setShowAttendingOnly(false);
              }}>
                عرض جميع الفعاليات
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
