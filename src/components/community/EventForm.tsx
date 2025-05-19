
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { TagInput } from "@/components/ui/tag-input";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Users, Tag } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Event categories
const eventCategories = [
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

interface EventFormProps {
  onEventCreated?: (event: any) => void;
}

export function EventForm({ onEventCreated }: EventFormProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date(Date.now() + 2 * 60 * 60 * 1000)); // 2 hours from now
  const [tags, setTags] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      category: "",
      maxAttendees: 30,
    },
  });
  
  const onSubmit = (data: any) => {
    if (!startDate || !endDate) {
      toast.error("يرجى تحديد تواريخ البداية والنهاية");
      return;
    }
    
    if (startDate > endDate) {
      toast.error("يجب أن يكون تاريخ البداية قبل تاريخ النهاية");
      return;
    }
    
    const newEvent = {
      ...data,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      tags,
      isOnline,
    };
    
    // In a real app, this would be an API call
    console.log("Creating event:", newEvent);
    toast.success("تم إنشاء الفعالية بنجاح!");
    
    // Reset form
    form.reset();
    setStartDate(new Date());
    setEndDate(new Date(Date.now() + 2 * 60 * 60 * 1000));
    setTags([]);
    setIsOnline(false);
    
    if (onEventCreated) {
      onEventCreated(newEvent);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          rules={{ required: "هذا الحقل مطلوب" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان الفعالية</FormLabel>
              <FormControl>
                <Input placeholder="ورشة عمل: مقدمة في تطوير تطبيقات الويب" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          rules={{ required: "هذا الحقل مطلوب" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف الفعالية</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="اكتب وصفاً تفصيلياً للفعالية..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormItem className="space-y-2">
            <FormLabel>تاريخ البداية</FormLabel>
            <div className="flex flex-col space-y-2">
              <DatePicker date={startDate} setDate={setStartDate} />
              {startDate && (
                <Input 
                  type="time"
                  value={format(startDate, 'HH:mm')}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDate = new Date(startDate);
                    newDate.setHours(parseInt(hours));
                    newDate.setMinutes(parseInt(minutes));
                    setStartDate(newDate);
                  }}
                />
              )}
            </div>
          </FormItem>
          
          <FormItem className="space-y-2">
            <FormLabel>تاريخ النهاية</FormLabel>
            <div className="flex flex-col space-y-2">
              <DatePicker date={endDate} setDate={setEndDate} />
              {endDate && (
                <Input 
                  type="time"
                  value={format(endDate, 'HH:mm')}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDate = new Date(endDate);
                    newDate.setHours(parseInt(hours));
                    newDate.setMinutes(parseInt(minutes));
                    setEndDate(newDate);
                  }}
                />
              )}
            </div>
          </FormItem>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            rules={{ required: "هذا الحقل مطلوب" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>التصنيف</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر تصنيف" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eventCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxAttendees"
            rules={{ required: "هذا الحقل مطلوب" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>الحد الأقصى للحضور</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormItem className="space-y-2">
          <FormLabel>الوسوم</FormLabel>
          <TagInput value={tags} onChange={setTags} placeholder="أضف وسوم" />
          <FormDescription>
            اضغط على Enter لإضافة وسم
          </FormDescription>
        </FormItem>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            rules={{ required: "هذا الحقل مطلوب" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>المكان</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={isOnline ? "رابط Zoom أو Microsoft Teams" : "مكان الفعالية"} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormItem className="flex items-center space-x-4 space-x-reverse">
            <FormControl>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch 
                  checked={isOnline} 
                  onCheckedChange={setIsOnline} 
                  id="online-mode" 
                />
                <FormLabel htmlFor="online-mode" className="mr-2">
                  أونلاين
                </FormLabel>
              </div>
            </FormControl>
            <FormDescription>
              حدد إذا كانت الفعالية ستقام عبر الإنترنت
            </FormDescription>
          </FormItem>
        </div>
        
        <div className="flex justify-end space-x-2 space-x-reverse">
          <Button type="submit">إنشاء الفعالية</Button>
        </div>
      </form>
    </Form>
  );
}
