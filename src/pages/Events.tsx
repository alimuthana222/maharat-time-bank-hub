
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { EventForm } from "@/components/community/EventForm";
import { EventCard } from "@/components/community/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Filter, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays, addWeeks } from "date-fns";

interface EventData {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  maxAttendees: number | null;
  attendees: Array<{ id: string; name: string }>;
  organizer: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// Generate mock events
const generateMockEvents = () => {
  const today = new Date();
  const mockEvents: EventData[] = [
    {
      id: "event-1",
      title: "ملتقى الخريجين السنوي",
      description: "فرصة للتواصل مع خريجي الجامعة وبناء شبكة علاقات مهنية. سيتضمن الملتقى عدة متحدثين من مختلف المجالات لمشاركة تجاربهم المهنية بعد التخرج.",
      location: "قاعة المؤتمرات الرئيسية",
      type: "professional",
      date: addDays(today, 5).toISOString(),
      startTime: "14:00",
      endTime: "18:00",
      maxAttendees: 200,
      attendees: Array(45).fill(0).map((_, i) => ({ id: `user-${i}`, name: `مشارك ${i + 1}` })),
      organizer: {
        id: "org-1",
        name: "نادي الخريجين",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "event-2",
      title: "ورشة عمل تطوير تطبيقات الويب",
      description: "ورشة عمل عملية لتعلم أساسيات تطوير تطبيقات الويب باستخدام React وNode.js. مناسبة للمبتدئين والطلاب المهتمين بمجال تطوير الويب.",
      location: "معمل الحاسب - مبنى كلية الحاسب",
      type: "academic",
      date: addDays(today, 3).toISOString(),
      startTime: "10:00",
      endTime: "15:00",
      maxAttendees: 30,
      attendees: Array(22).fill(0).map((_, i) => ({ id: `user-${i}`, name: `مشارك ${i + 1}` })),
      organizer: {
        id: "org-2",
        name: "نادي البرمجة",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "event-3",
      title: "بطولة كرة القدم بين الكليات",
      description: "بطولة رياضية سنوية بين فرق كليات الجامعة. تهدف البطولة لتعزيز روح المنافسة الرياضية وتقوية الروابط بين طلاب الكليات المختلفة.",
      location: "ملعب الجامعة الرئيسي",
      type: "sports",
      date: addWeeks(today, 1).toISOString(),
      startTime: "16:00",
      endTime: "19:00",
      maxAttendees: null,
      attendees: Array(72).fill(0).map((_, i) => ({ id: `user-${i}`, name: `مشارك ${i + 1}` })),
      organizer: {
        id: "org-3",
        name: "النادي الرياضي",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "event-4",
      title: "أمسية شعرية وموسيقية",
      description: "أمسية ثقافية تتضمن قراءات شعرية وفقرات موسيقية لطلاب الجامعة الموهوبين. فرصة للاستمتاع بالفنون وتبادل المواهب الأدبية والموسيقية.",
      location: "مسرح كلية الآداب",
      type: "cultural",
      date: addDays(today, 7).toISOString(),
      startTime: "19:00",
      endTime: "21:30",
      maxAttendees: 150,
      attendees: Array(68).fill(0).map((_, i) => ({ id: `user-${i}`, name: `مشارك ${i + 1}` })),
      organizer: {
        id: "org-4",
        name: "النادي الثقافي",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "event-5",
      title: "يوم التوظيف السنوي",
      description: "فرصة للقاء ممثلي الشركات والتعرف على فرص التوظيف والتدريب المتاحة. سيشارك في الفعالية أكثر من 20 شركة من مختلف القطاعات.",
      location: "بهو الجامعة الرئيسي",
      type: "professional",
      date: addDays(today, 14).toISOString(),
      startTime: "09:00",
      endTime: "16:00",
      maxAttendees: null,
      attendees: Array(125).fill(0).map((_, i) => ({ id: `user-${i}`, name: `مشارك ${i + 1}` })),
      organizer: {
        id: "org-5",
        name: "مركز التطوير المهني",
      },
      createdAt: new Date().toISOString(),
    },
  ];

  return mockEvents;
};

export default function Events() {
  const [events, setEvents] = useState<EventData[]>(generateMockEvents());
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    document.title = "الفعاليات | مهارات";
  }, []);

  const handleEventCreated = (newEvent: EventData) => {
    setEvents([newEvent, ...events]);
  };

  // Filter events based on search query and filters
  const filteredEvents = events.filter(event => {
    // Search filter
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    
    // Date filter
    const eventDate = new Date(event.date);
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const nextWeek = addDays(today, 7);
    
    let matchesDate = true;
    
    if (dateFilter === "today") {
      matchesDate = format(eventDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    } else if (dateFilter === "tomorrow") {
      matchesDate = format(eventDate, "yyyy-MM-dd") === format(tomorrow, "yyyy-MM-dd");
    } else if (dateFilter === "week") {
      matchesDate = eventDate >= today && eventDate <= nextWeek;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">الفعاليات</h1>
            </div>
            
            <EventForm onEventCreated={handleEventCreated} />
          </div>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="ابحث عن فعالية..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="نوع الفعالية" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="academic">أكاديمية</SelectItem>
                  <SelectItem value="cultural">ثقافية</SelectItem>
                  <SelectItem value="social">اجتماعية</SelectItem>
                  <SelectItem value="professional">مهنية</SelectItem>
                  <SelectItem value="entertainment">ترفيهية</SelectItem>
                  <SelectItem value="sports">رياضية</SelectItem>
                  <SelectItem value="volunteer">تطوعية</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <SelectValue placeholder="وقت الفعالية" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأوقات</SelectItem>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="tomorrow">غداً</SelectItem>
                  <SelectItem value="week">خلال أسبوع</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">لا توجد فعاليات مطابقة</h3>
              <p className="text-muted-foreground mt-2">جرب تعديل معايير البحث أو إنشاء فعالية جديدة</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
