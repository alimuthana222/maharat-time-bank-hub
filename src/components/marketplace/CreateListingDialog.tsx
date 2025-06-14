
import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const categories = [
  "برمجة",
  "تصميم",
  "كتابة",
  "تدريس",
  "ترجمة",
  "تسويق",
  "استشارات",
  "أخرى"
];

export function CreateListingDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "service",
    hourly_rate: "",
    delivery_time: "1",
    requirements: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("marketplace_listings")
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          type: formData.type,
          hourly_rate: parseInt(formData.hourly_rate),
          delivery_time: parseInt(formData.delivery_time),
          requirements: formData.requirements
        });

      if (error) throw error;

      toast.success("تم إنشاء الخدمة بنجاح!");
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        type: "service",
        hourly_rate: "",
        delivery_time: "1",
        requirements: ""
      });
      window.location.reload(); // Refresh to show new listing
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("خطأ في إنشاء الخدمة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة خدمة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة خدمة جديدة</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">عنوان الخدمة</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="مثال: تصميم شعار احترافي"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">التصنيف</label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
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

          <div>
            <label className="block text-sm font-medium mb-2">وصف الخدمة</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="اكتب وصفاً مفصلاً عن خدمتك..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">السعر بالساعة (ألف دينار)</label>
              <Input
                type="number"
                min="1"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">مدة التسليم (أيام)</label>
              <Input
                type="number"
                min="1"
                value={formData.delivery_time}
                onChange={(e) => setFormData({...formData, delivery_time: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">متطلبات الخدمة</label>
            <Textarea
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              placeholder="ما تحتاجه من العميل لإتمام الخدمة..."
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "جاري الإنشاء..." : "إنشاء الخدمة"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
