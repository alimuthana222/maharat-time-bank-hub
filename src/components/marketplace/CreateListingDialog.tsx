
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const categories = [
  "برمجة وتطوير",
  "تصميم جرافيك",
  "كتابة وترجمة",
  "تسويق رقمي",
  "تدريس وتعليم",
  "استشارات",
  "أخرى"
];

const types = [
  { value: "service", label: "خدمة" },
  { value: "consultation", label: "استشارة" },
  { value: "course", label: "دورة تدريبية" },
  { value: "project", label: "مشروع" }
];

export function CreateListingDialog({ open, onOpenChange, onSuccess }: CreateListingDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "service",
    hourly_rate: "",
    delivery_time: "1",
    requirements: "",
    tags: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.hourly_rate) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      
      const { error } = await supabase
        .from("marketplace_listings")
        .insert([{
          title: formData.title,
          description: formData.description,
          category: formData.category,
          type: formData.type,
          hourly_rate: parseInt(formData.hourly_rate),
          delivery_time: parseInt(formData.delivery_time),
          requirements: formData.requirements || null,
          tags: tags.length > 0 ? tags : null,
          user_id: user.id,
          status: "active"
        }]);

      if (error) throw error;

      toast.success("تم إنشاء الخدمة بنجاح");
      setFormData({
        title: "",
        description: "",
        category: "",
        type: "service",
        hourly_rate: "",
        delivery_time: "1",
        requirements: "",
        tags: ""
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("حدث خطأ أثناء إنشاء الخدمة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة خدمة جديدة</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">عنوان الخدمة *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="اكتب عنوان جذاب للخدمة"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">التصنيف *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="type">نوع الخدمة</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="hourly_rate">السعر بالدولار/ساعة *</Label>
              <Input
                id="hourly_rate"
                type="number"
                value={formData.hourly_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                placeholder="25"
                min="1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="delivery_time">مدة التسليم (أيام)</Label>
              <Input
                id="delivery_time"
                type="number"
                value={formData.delivery_time}
                onChange={(e) => setFormData(prev => ({ ...prev, delivery_time: e.target.value }))}
                placeholder="1"
                min="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">وصف الخدمة *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="اكتب وصفاً تفصيلياً للخدمة..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="requirements">المتطلبات</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              placeholder="ما تحتاجه من العميل لتقديم الخدمة..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="tags">الكلمات المفتاحية</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="البرمجة، الويب، JavaScript (افصل بفاصلة)"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              إنشاء الخدمة
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
