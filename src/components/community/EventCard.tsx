
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Users, CalendarPlus, Share2, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

interface EventProps {
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

export function EventCard({ event }: { event: EventProps }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const { user } = useAuth();

  const formattedDate = event.date ? format(new Date(event.date), "EEEE d MMMM yyyy", { locale: ar }) : "";
  
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleAttend = () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول للانضمام إلى الفعالية");
      return;
    }

    if (isAttending) {
      toast.info("تم إلغاء تسجيلك في هذه الفعالية");
    } else {
      toast.success("تم تسجيلك في الفعالية بنجاح");
    }
    setIsAttending(!isAttending);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `الفعالية: ${event.title} | المكان: ${event.location} | التاريخ: ${formattedDate}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(`${event.title} - ${formattedDate} - ${event.location}`)
        .then(() => toast.success("تم نسخ تفاصيل الفعالية إلى الحافظة"))
        .catch(() => toast.error("حدث خطأ أثناء نسخ التفاصيل"));
    }
  };

  const handleRemind = () => {
    toast.success("سيتم تذكيرك قبل موعد الفعالية");
  };

  const getEventTypeInArabic = (type: string) => {
    const types: Record<string, string> = {
      academic: "أكاديمية",
      cultural: "ثقافية",
      social: "اجتماعية",
      professional: "مهنية",
      entertainment: "ترفيهية",
      sports: "رياضية",
      volunteer: "تطوعية",
      other: "أخرى"
    };
    return types[type] || type;
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <Badge>{getEventTypeInArabic(event.type)}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>من {formatTime(event.startTime)} إلى {formatTime(event.endTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {event.attendees.length} مشارك
                {event.maxAttendees && ` (الحد الأقصى: ${event.maxAttendees})`}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => setShowDetails(true)}>
            عرض التفاصيل
          </Button>
          <Button 
            variant={isAttending ? "destructive" : "default"} 
            size="sm"
            onClick={handleAttend}
          >
            {isAttending ? "إلغاء المشاركة" : "المشاركة"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">{event.title}</DialogTitle>
            <DialogDescription>
              <Badge className="mb-4">{getEventTypeInArabic(event.type)}</Badge>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>من {formatTime(event.startTime)} إلى {formatTime(event.endTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {event.attendees.length} مشارك
                  {event.maxAttendees && ` (الحد الأقصى: ${event.maxAttendees})`}
                </span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">وصف الفعالية</h4>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">منظم الفعالية</h4>
              <p>{event.organizer.name}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button 
                variant={isAttending ? "destructive" : "default"} 
                onClick={handleAttend}
                className="flex-1"
              >
                <CalendarPlus className="mr-2 h-4 w-4" />
                {isAttending ? "إلغاء المشاركة" : "المشاركة"}
              </Button>
              <Button variant="outline" onClick={handleShare} className="flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                مشاركة
              </Button>
              <Button variant="outline" onClick={handleRemind} className="flex-1">
                <Bell className="mr-2 h-4 w-4" />
                تذكير
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
