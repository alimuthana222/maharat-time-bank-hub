
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResponsiveContainer, ResponsiveGrid } from "@/components/ui/mobile-responsive";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  Filter,
  Plus,
  Star
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: {
    name: string;
    avatar: string;
    university: string;
  };
  attendees: number;
  maxAttendees?: number;
  price?: number;
  tags: string[];
  isRegistered: boolean;
  isFeatured: boolean;
}

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "ورشة عمل: تطوير تطبيقات الجوال باستخدام React Native",
      description: "تعلم كيفية بناء تطبيقات الجوال الحديثة باستخدام React Native من الصفر حتى النشر",
      category: "برمجة",
      date: "2024-01-25",
      time: "14:00",
      location: "قاعة المؤتمرات - جامعة الملك سعود",
      organizer: {
        name: "أحمد محمد",
        avatar: "https://i.pravatar.cc/150?u=ahmed",
        university: "جامعة الملك سعود"
      },
      attendees: 45,
      maxAttendees: 60,
      price: 0,
      tags: ["React Native", "تطوير", "مجاني"],
      isRegistered: false,
      isFeatured: true
    },
    {
      id: "2",
      title: "مسابقة التصميم الجرافيكي السنوية",
      description: "شارك في مسابقة التصميم وأظهر إبداعك. جوائز قيمة للفائزين",
      category: "تصميم",
      date: "2024-01-30",
      time: "10:00",
      location: "كلية الفنون والتصميم - جامعة الملك عبدالعزيز",
      organizer: {
        name: "سارة أحمد",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        university: "جامعة الملك عبدالعزيز"
      },
      attendees: 128,
      maxAttendees: 200,
      tags: ["تصميم", "مسابقة", "جوائز"],
      isRegistered: true,
      isFeatured: true
    },
    {
      id: "3",
      title: "جلسة نقاشية: مستقبل الذكاء الاصطناعي",
      description: "نقاش مفتوح حول تطبيقات الذكاء الاصطناعي ومستقبله في مختلف المجالات",
      category: "تقنية",
      date: "2024-02-02",
      time: "16:00",
      location: "المدرج الرئيسي - جامعة الإمام",
      organizer: {
        name: "د. محمد عبدالله",
        avatar: "https://i.pravatar.cc/150?u=mohammed",
        university: "جامعة الإمام"
      },
      attendees: 67,
      maxAttendees: 100,
      tags: ["ذكاء اصطناعي", "نقاش", "تقنية"],
      isRegistered: false,
      isFeatured: false
    },
    {
      id: "4",
      title: "كورس: أساسيات ريادة الأعمال للطلاب",
      description: "تعلم الأسس العملية لبدء مشروعك التجاري وتطوير فكرتك إلى واقع",
      category: "أعمال",
      date: "2024-02-05",
      time: "13:00",
      location: "مركز ريادة الأعمال - جامعة الملك فهد",
      organizer: {
        name: "فاطمة علي",
        avatar: "https://i.pravatar.cc/150?u=fatima",
        university: "جامعة الملك فهد"
      },
      attendees: 23,
      maxAttendees: 30,
      price: 50,
      tags: ["ريادة", "أعمال", "مدفوع"],
      isRegistered: false,
      isFeatured: false
    }
  ]);

  const categories = [
    { value: "all", label: "جميع التصنيفات" },
    { value: "برمجة", label: "برمجة" },
    { value: "تصميم", label: "تصميم" },
    { value: "تقنية", label: "تقنية" },
    { value: "أعمال", label: "أعمال" },
    { value: "علوم", label: "علوم" },
  ];

  const eventTypes = [
    { value: "all", label: "جميع الأنواع" },
    { value: "workshop", label: "ورش عمل" },
    { value: "competition", label: "مسابقات" },
    { value: "seminar", label: "ندوات" },
    { value: "course", label: "كورسات" },
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRegister = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            isRegistered: !event.isRegistered,
            attendees: event.isRegistered ? event.attendees - 1 : event.attendees + 1
          }
        : event
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "برمجة":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "تصميم":
        return "bg-orange-500/10 text-orange-600 border-orange-200";
      case "تقنية":
        return "bg-purple-500/10 text-purple-600 border-purple-200";
      case "أعمال":
        return "bg-green-500/10 text-green-600 border-green-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) > new Date());
  const myEvents = filteredEvents.filter(event => event.isRegistered);

  const EventCard = ({ event }: { event: Event }) => (
    <Card className={`relative ${event.isFeatured ? 'ring-2 ring-primary/20' : ''}`}>
      {event.isFeatured && (
        <div className="absolute top-2 left-2">
          <Badge className="bg-primary">
            <Star className="h-3 w-3 mr-1" />
            مميز
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Badge variant="outline" className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
            <h3 className="font-bold text-lg mt-2 leading-tight">{event.title}</h3>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(event.date).toLocaleDateString('ar-SA')}</span>
            <Clock className="h-4 w-4 text-muted-foreground ml-2" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{event.location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {event.attendees} مسجل
              {event.maxAttendees && ` من ${event.maxAttendees}`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
            <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{event.organizer.name}</p>
            <p className="text-xs text-muted-foreground">{event.organizer.university}</p>
          </div>
        </div>
        
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          {event.price !== undefined && (
            <span className="font-bold">
              {event.price === 0 ? "مجاني" : `${event.price} ريال`}
            </span>
          )}
          
          <Button 
            onClick={() => handleRegister(event.id)}
            variant={event.isRegistered ? "outline" : "default"}
            size="sm"
            disabled={event.maxAttendees && event.attendees >= event.maxAttendees && !event.isRegistered}
          >
            {event.isRegistered ? "إلغاء التسجيل" : "التسجيل"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <ResponsiveContainer className="pt-20 pb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">الفعاليات</h1>
              <p className="text-muted-foreground">
                اكتشف الفعاليات والورش والمسابقات في جامعتك
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إنشاء فعالية
            </Button>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid grid-cols-3 w-full md:w-auto mb-8">
              <TabsTrigger value="upcoming">القادمة ({upcomingEvents.length})</TabsTrigger>
              <TabsTrigger value="my-events">فعالياتي ({myEvents.length})</TabsTrigger>
              <TabsTrigger value="past">السابقة</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {/* Search and Filter */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="ابحث عن الفعاليات..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full md:w-48">
                        <Filter className="h-4 w-4 mr-2" />
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

                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="نوع الفعالية" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Events Grid */}
              <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }}>
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </ResponsiveGrid>

              {upcomingEvents.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    {searchQuery || selectedCategory !== "all" 
                      ? "لم يتم العثور على فعاليات مطابقة للبحث"
                      : "لا توجد فعاليات قادمة حالياً"
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-events" className="space-y-6">
              {myEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">لم تسجل في أي فعاليات بعد</p>
                </div>
              ) : (
                <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }}>
                  {myEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </ResponsiveGrid>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">الفعاليات السابقة ستظهر هنا</p>
              </div>
            </TabsContent>
          </Tabs>
        </ResponsiveContainer>
      </main>

      <Footer />
    </div>
  );
}
