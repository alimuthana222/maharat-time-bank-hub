
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Clock,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// مخطط التحقق من صحة النموذج
const formSchema = z.object({
  title: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل").max(100, "العنوان طويل جداً"),
  description: z.string().min(20, "الوصف يجب أن يكون 20 حرفاً على الأقل").max(500, "الوصف طويل جداً"),
  category: z.string().min(1, "يجب اختيار فئة"),
  subcategory: z.string().min(1, "يجب اختيار فئة فرعية"),
  college: z.string().min(1, "يجب اختيار الكلية المستهدفة"),
  price: z.string().refine((val) => !isNaN(Number(val)), "يجب إدخال رقم صحيح"),
  adType: z.string().min(1, "يجب اختيار نوع الإعلان"),
  duration: z.string().min(1, "يجب اختيار مدة الإعلان"),
});

// بيانات الفئات الفرعية لكل فئة رئيسية
const subcategories: Record<string, string[]> = {
  "الخدمات الطلابية": ["خدمات تقنية", "دروس خصوصية", "خدمات كتابة وتحرير", "استشارات أكاديمية", "أخرى"],
  "السكن والمواصلات": ["سكن طلابي", "شقق للإيجار", "مواصلات", "مشاركة سكن", "أخرى"],
  "التوظيف والتدريب": ["تدريب", "وظيفة جزئية", "وظيفة كاملة", "فرص تطوعية", "أخرى"],
  "الفعاليات والأنشطة": ["ملتقى", "ندوة", "ورشة عمل", "مؤتمر", "نشاط طلابي", "أخرى"],
};

// جدول أسعار أنواع الإعلانات
const adTypePricing = {
  "عادي": 50,
  "مميز": 100,
  "مميز+": 200,
  "موجه": 150,
  "فوري": 250,
};

// وصف أنواع الإعلانات
const adTypeDescriptions = {
  "عادي": "يظهر في القسم العام حسب ترتيب النشر",
  "مميز": "يظهر في أعلى القائمة لفترة محددة",
  "مميز+": "يظهر في الصفحة الرئيسية وفي أعلى القائمة",
  "موجه": "يظهر للفئات المستهدفة فقط (حسب الكلية/التخصص)",
  "فوري": "إشعارات للمستخدمين المهتمين مع ظهور مميز",
};

export default function CreateAd() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // إعداد النموذج
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      college: "",
      price: "0",
      adType: "عادي",
      duration: "7",
    },
  });

  // تحديث الأقسام الفرعية عند تغيير القسم الرئيسي
  const onCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setValue("subcategory", "");
  };

  // تحديث السعر الإجمالي عند تغيير نوع الإعلان أو المدة
  const updateTotalPrice = () => {
    const adType = form.getValues("adType");
    const duration = parseInt(form.getValues("duration") || "7");
    const basePrice = adTypePricing[adType as keyof typeof adTypePricing] || 50;
    
    // حساب السعر حسب المدة
    let durationMultiplier = 1;
    if (duration === 14) {
      durationMultiplier = 1.75; // خصم 25٪ للأسبوعين
    } else if (duration === 30) {
      durationMultiplier = 3; // خصم 50٪ للشهر
    }
    
    setTotalPrice(basePrice * durationMultiplier);
  };

  // محاكاة رفع صورة
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // إرسال النموذج
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("قيم النموذج:", values);
    console.log("السعر الإجمالي:", totalPrice);
    
    // محاكاة إرسال البيانات
    toast.success("تم إنشاء إعلانك بنجاح! سيتم مراجعته ونشره قريباً");
    navigate("/ads");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">إنشاء إعلان جديد</h1>
          <p className="text-muted-foreground mb-8">
            أضف إعلانك للوصول إلى مجتمع الطلاب والجامعات
          </p>
          
          <Tabs defaultValue="ad" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="ad" disabled={currentStep !== 1}>معلومات الإعلان</TabsTrigger>
              <TabsTrigger value="details" disabled={currentStep !== 2}>تفاصيل النشر</TabsTrigger>
              <TabsTrigger value="preview" disabled={currentStep !== 3}>المراجعة والدفع</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* الخطوة 1: معلومات الإعلان */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الإعلان</CardTitle>
                    <CardDescription>
                      أدخل المعلومات الأساسية للإعلان
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عنوان الإعلان</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="أدخل عنوان واضح ومختصر لإعلانك"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>وصف الإعلان</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="اكتب وصفاً تفصيلياً لإعلانك"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الفئة الرئيسية</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                onCategoryChange(value);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر الفئة الرئيسية" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.keys(subcategories).map((category) => (
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
                        name="subcategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الفئة الفرعية</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!selectedCategory}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر الفئة الفرعية" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedCategory &&
                                  subcategories[selectedCategory]?.map((subcategory) => (
                                    <SelectItem key={subcategory} value={subcategory}>
                                      {subcategory}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="college"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الكلية المستهدفة</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر الكلية المستهدفة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="all-colleges">جميع الكليات</SelectItem>
                                <SelectItem value="computer-science">كلية الحاسب</SelectItem>
                                <SelectItem value="engineering">كلية الهندسة</SelectItem>
                                <SelectItem value="medicine">كلية الطب</SelectItem>
                                <SelectItem value="science">كلية العلوم</SelectItem>
                                <SelectItem value="business">كلية الإدارة</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>السعر (ريال)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="1" {...field} />
                          </FormControl>
                          <FormDescription>
                            أدخل 0 إذا كان الإعلان مجانياً
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel>صورة الإعلان (اختياري)</FormLabel>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {uploadedImage ? (
                        <div className="relative">
                          <img
                            src={uploadedImage}
                            alt="صورة الإعلان"
                            className="mx-auto max-h-48 object-contain"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-0 right-0 mt-2 mr-2"
                            onClick={() => setUploadedImage(null)}
                          >
                            حذف
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            اسحب الصورة هنا أو انقر للاختيار
                          </div>
                          <Button type="button" variant="outline" size="sm" className="mt-2">
                            اختر صورة
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => navigate("/ads")}>
                    إلغاء
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      const step1Fields = ["title", "description", "category", "subcategory", "college", "price"];
                      const isValid = step1Fields.every(field => {
                        const result = form.trigger(field as any);
                        return result;
                      });
                      
                      if (isValid) {
                        setCurrentStep(2);
                      }
                    }}
                  >
                    التالي
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* الخطوة 2: تفاصيل النشر */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل النشر</CardTitle>
                  <CardDescription>
                    اختر كيفية نشر إعلانك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <FormField
                    control={form.control}
                    name="adType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع الإعلان</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              updateTotalPrice();
                            }}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            {Object.keys(adTypePricing).map((type) => (
                              <div key={type} className="relative">
                                <RadioGroupItem
                                  value={type}
                                  id={`ad-type-${type}`}
                                  className="sr-only"
                                />
                                <Label
                                  htmlFor={`ad-type-${type}`}
                                  className={`flex flex-col space-y-2 rounded-md border-2 p-4 hover:bg-muted ${
                                    field.value === type ? "border-primary bg-primary/5" : "border-muted"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold">{type}</span>
                                    <span className="font-semibold text-primary">
                                      {adTypePricing[type as keyof typeof adTypePricing]} ريال
                                    </span>
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {adTypeDescriptions[type as keyof typeof adTypeDescriptions]}
                                  </span>
                                  {field.value === type && (
                                    <Check className="absolute top-4 right-4 h-4 w-4 text-primary" />
                                  )}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مدة الإعلان</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              updateTotalPrice();
                            }}
                            defaultValue={field.value}
                            className="flex space-x-4 space-y-0 rtl:space-x-reverse"
                          >
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <RadioGroupItem value="7" id="duration-7" />
                              <Label htmlFor="duration-7">7 أيام</Label>
                            </div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <RadioGroupItem value="14" id="duration-14" />
                              <Label htmlFor="duration-14">14 يوم (خصم 25%)</Label>
                            </div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <RadioGroupItem value="30" id="duration-30" />
                              <Label htmlFor="duration-30">30 يوم (خصم 50%)</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between font-semibold">
                      <span>الإجمالي:</span>
                      <span className="text-lg text-primary">
                        {totalPrice} ريال
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setCurrentStep(1)}
                  >
                    السابق
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      const step2Fields = ["adType", "duration"];
                      const isValid = step2Fields.every(field => {
                        const result = form.trigger(field as any);
                        return result;
                      });
                      
                      if (isValid) {
                        updateTotalPrice();
                        setCurrentStep(3);
                      }
                    }}
                  >
                    التالي
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* الخطوة 3: المراجعة والدفع */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>مراجعة ودفع</CardTitle>
                  <CardDescription>
                    راجع تفاصيل إعلانك قبل النشر
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold">معلومات الإعلان:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">العنوان:</div>
                        <div className="text-sm font-medium">{form.getValues("title")}</div>
                        
                        <div className="text-sm text-muted-foreground">الفئة:</div>
                        <div className="text-sm font-medium">
                          {form.getValues("category")} - {form.getValues("subcategory")}
                        </div>
                        
                        <div className="text-sm text-muted-foreground">الكلية المستهدفة:</div>
                        <div className="text-sm font-medium">{form.getValues("college")}</div>
                        
                        <div className="text-sm text-muted-foreground">السعر:</div>
                        <div className="text-sm font-medium">
                          {parseInt(form.getValues("price")) > 0
                            ? `${form.getValues("price")} ريال`
                            : "مجاناً"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold">تفاصيل النشر:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">نوع الإعلان:</div>
                        <div className="text-sm font-medium">{form.getValues("adType")}</div>
                        
                        <div className="text-sm text-muted-foreground">المدة:</div>
                        <div className="text-sm font-medium">{form.getValues("duration")} يوم</div>
                        
                        <div className="text-sm text-muted-foreground">تاريخ النشر:</div>
                        <div className="text-sm font-medium">
                          {new Date().toLocaleDateString("ar-SA")}
                        </div>
                        
                        <div className="text-sm text-muted-foreground">إجمالي الرسوم:</div>
                        <div className="text-sm font-medium text-primary">
                          {totalPrice} ريال
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">الوصف:</h3>
                    <p className="text-sm text-muted-foreground">
                      {form.getValues("description")}
                    </p>
                  </div>
                  
                  {uploadedImage && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">الصورة:</h3>
                      <img
                        src={uploadedImage}
                        alt="صورة الإعلان"
                        className="max-h-48 object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="border p-4 rounded-lg bg-muted/50 flex items-center space-x-4 rtl:space-x-reverse">
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                    <div className="flex-1 text-sm">
                      سيتم مراجعة إعلانك من قبل إدارة المنصة قبل نشره. قد يستغرق ذلك حتى 24 ساعة.
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg space-y-4">
                    <div className="flex items-center justify-between font-semibold">
                      <span>الإجمالي:</span>
                      <span className="text-lg text-primary">
                        {totalPrice} ريال
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">طرق الدفع:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Button variant="outline" className="h-12">
                          مدى
                        </Button>
                        <Button variant="outline" className="h-12">
                          فيزا / ماستركارد
                        </Button>
                        <Button variant="outline" className="h-12">
                          آبل باي
                        </Button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" className="h-12" disabled>
                                رصيد المنصة
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>رصيدك الحالي: 0 ريال</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setCurrentStep(2)}
                  >
                    السابق
                  </Button>
                  <Button type="submit">
                    إنشاء ودفع
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
