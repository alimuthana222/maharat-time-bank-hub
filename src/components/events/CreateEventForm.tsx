
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { CalendarIcon, MapPin, Users, DollarSign, Tag, X } from "lucide-react";

const categories = [
  { value: "tech", label: "تقنية" },
  { value: "education", label: "تعليمية" },
  { value: "workshop", label: "ورشة عمل" },
  { value: "networking", label: "شبكات مهنية" },
  { value: "career", label: "تطوير مهني" },
  { value: "cultural", label: "ثقافية" },
  { value: "volunteer", label: "تطوعية" }
];

const iraqCities = [
  "بغداد", "البصرة", "الموصل", "أربيل", "النجف", "كربلاء", 
  "السليمانية", "الأنبار", "ديالى", "كركوك", "بابل", "واسط", 
  "صلاح الدين", "المثنى", "القادسية", "ذي قار", "ميسان", "دهوك"
];

interface CreateEventFormProps {
  onEventCreated?: () => void;
  onCancel?: () => void;
}

export function CreateEventForm({ onEventCreated, onCancel }: CreateEventFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    start_date: "",
    end_date: "",
    location: "",
    max_attendees: "",
    price: "",
    is_online: false,
    image_url: ""
  });
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!formData.title || !formData.description || !formData.category || 
        !formData.start_date || !formData.end_date) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      toast.error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
      return;
    }

    if (new Date(formData.start_date) <= new Date()) {
      toast.error("تاريخ البداية يجب أن يكون في المستقبل");
      return;
    }

    setLoading(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        content: formData.content || null,
        category: formData.category,
        start_date: formData.start_date,
        end_date: formData.end_date,
        location: formData.is_online ? "عبر الإنترنت" : formData.location,
        organizer_id: user.id,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        price: formData.price ? parseFloat(formData.price) : 0,
        is_online: formData.is_online,
        image_url: formData.image_url || null,
        tags: tags.length > 0 ? tags : null,
        status: "upcoming"
      };

      const { error } = await supabase
        .from("events")
        .insert([eventData]);

      if (error) throw error;

      toast.success("تم إنشاء الفعالية بنجاح!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        content: "",
        category: "",
        start_date: "",
        end_date: "",
        location: "",
        max_attendees: "",
        price: "",
        is_online: false,
        image_url: ""
      });
      setTags([]);
      
      if (onEventCreated) {
        onEventCreated();
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("حدث خطأ أثناء إنشاء الفعالية");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Set minimum date to tomorrow
  const minDate = formatDateTimeLocal(new Date(Date.now() + 24 * 60 * 60 * 1000));

  return (
    <Card>
      <CardHeader>
        <CardTitle>إنشاء فعالية جديدة</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الفعالية *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="مثال: ورشة عمل في تطوير الويب"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">الفئة *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الفعالية *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="وصف موجز للفعالية..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">تفاصيل إضافية</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="تفاصيل مفصلة حول الفعالية، البرنامج، المتطلبات..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">تاريخ ووقت البداية *</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => handleInputChange("start_date", e.target.value)}
                min={minDate}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">تاريخ ووقت النهاية *</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
                min={formData.start_date || minDate}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="is_online"
              checked={formData.is_online}
              onCheckedChange={(checked) => handleInputChange("is_online", checked)}
            />
            <Label htmlFor="is_online">فعالية عبر الإنترنت</Label>
          </div>

          {!formData.is_online && (
            <div className="space-y-2">
              <Label htmlFor="location">الموقع *</Label>
              <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent>
                  {iraqCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_attendees">الحد الأقصى للمشاركين</Label>
              <Input
                id="max_attendees"
                type="number"
                value={formData.max_attendees}
                onChange={(e) => handleInputChange("max_attendees", e.target.value)}
                placeholder="مثال: 50"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">الرسوم (دينار عراقي)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0 للفعاليات المجانية"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">رابط صورة الفعالية</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange("image_url", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>الكلمات المفتاحية</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="أضف كلمة مفتاحية"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "جاري الإنشاء..." : "إنشاء الفعالية"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                إلغاء
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
