
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, MapPin, Clock, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function EventForm({ onEventCreated }: { onEventCreated?: (event: any) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !location || !eventType || !date || !startTime || !endTime) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsLoading(true);

    try {
      // Create event object
      const newEvent = {
        id: `event-${Date.now()}`,
        title,
        description,
        location,
        type: eventType,
        date: date?.toISOString(),
        startTime,
        endTime,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        attendees: [],
        organizer: {
          id: "current-user",
          name: "أنت",
        },
        createdAt: new Date().toISOString(),
      };

      // Simulate API call delay
      setTimeout(() => {
        if (onEventCreated) {
          onEventCreated(newEvent);
        }
        
        toast.success("تم إنشاء الفعالية بنجاح");
        setOpen(false);
        
        // Reset form
        setTitle("");
        setDescription("");
        setLocation("");
        setEventType("");
        setDate(undefined);
        setStartTime("");
        setEndTime("");
        setMaxAttendees("");
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("حدث خطأ أثناء إنشاء الفعالية");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>إنشاء فعالية جديدة</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>إنشاء فعالية جديدة</DialogTitle>
            <DialogDescription>
              أنشئ فعالية جديدة لمشاركتها مع مجتمع الطلاب
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">عنوان الفعالية</Label>
              <Input
                id="title"
                placeholder="أدخل عنوان الفعالية"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">وصف الفعالية</Label>
              <Textarea
                id="description"
                placeholder="اكتب وصفاً مفصلاً للفعالية"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="event-type">نوع الفعالية</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="اختر نوع الفعالية" />
                </SelectTrigger>
                <SelectContent>
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
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">موقع الفعالية</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  className="pl-10"
                  placeholder="أدخل موقع الفعالية"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">تاريخ الفعالية</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ar }) : "اختر تاريخ الفعالية"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="maxAttendees">الحد الأقصى للحضور</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="maxAttendees"
                    className="pl-10"
                    type="number"
                    min="1"
                    placeholder="اتركه فارغاً إذا لم يكن هناك حد"
                    value={maxAttendees}
                    onChange={(e) => setMaxAttendees(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">وقت البدء</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    className="pl-10"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="endTime">وقت الانتهاء</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    className="pl-10"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري الإنشاء..." : "إنشاء الفعالية"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
