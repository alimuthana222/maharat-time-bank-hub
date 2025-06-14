
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { Plus, Coins, Timer, Search } from "lucide-react";

export function CreateServiceRequestDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "service", // service or skill_exchange
    budget: "",
    deadline: ""
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("marketplace_listings")
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          type: formData.type,
          hourly_rate: parseInt(formData.budget),
          delivery_time: parseInt(formData.deadline),
          user_id: user.id,
          status: "active",
          listing_type: "request"
        });

      if (error) throw error;

      toast.success("تم إنشاء طلب الخدمة بنجاح!");
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        type: "service",
        budget: "",
        deadline: ""
      });
      
      window.location.reload();
    } catch (error) {
      console.error("Error creating service request:", error);
      toast.error("خطأ في إنشاء طلب الخدمة");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4" />
          طلب خدمة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>طلب خدمة جديدة</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الخدمة المطلوبة</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="أدخل عنوان الخدمة التي تحتاجها"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف تفصيلي للخدمة</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="اشرح بالتفصيل ما تحتاجه من الخدمة"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">التصنيف</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
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

          <div className="space-y-3">
            <Label>نوع الدفع</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="service" id="service" />
                <Label htmlFor="service" className="flex items-center gap-2 cursor-pointer">
                  <Coins className="h-4 w-4 text-green-600" />
                  دفع بالدينار العراقي
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="skill_exchange" id="skill_exchange" />
                <Label htmlFor="skill_exchange" className="flex items-center gap-2 cursor-pointer">
                  <Timer className="h-4 w-4 text-blue-600" />
                  دفع بساعات بنك الوقت
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">
              {formData.type === "service" ? "الميزانية المتاحة (د.ع)" : "الساعات المتاحة للدفع"}
            </Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              placeholder={formData.type === "service" ? "مثال: 50000" : "مثال: 5"}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">المطلوب إنجازه خلال (أيام)</Label>
            <Input
              id="deadline"
              type="number"
              value={formData.deadline}
              onChange={(e) => handleInputChange("deadline", e.target.value)}
              placeholder="مثال: 7"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "جاري الإنشاء..." : "نشر طلب الخدمة"}
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
