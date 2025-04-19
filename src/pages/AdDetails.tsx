
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Flag,
  Heart,
  MessageSquare,
  Share2,
  Star,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// بيانات تجريبية للإعلان
const adsData = {
  "1": {
    id: "1",
    title: "خدمات برمجة وتصميم مواقع إلكترونية",
    description: `تصميم وتطوير مواقع احترافية للطلاب والمشاريع الصغيرة بأسعار مناسبة.
    
    الخدمات المقدمة:
    - تصميم وتطوير مواقع ويب متجاوبة مع جميع الأجهزة
    - تطوير متاجر إلكترونية
    - تصميم واجهات المستخدم
    - تحسين أداء المواقع وتجربة المستخدم
    - تحسين محركات البحث SEO
    
    لدي خبرة أكثر من 3 سنوات في مجال البرمجة وتصميم المواقع، وقد نفذت أكثر من 30 مشروع لعملاء مختلفين. أستخدم أحدث التقنيات والأدوات في التطوير مع التركيز على جودة الكود والأداء.
    
    الأسعار تناسب ميزانيات الطلاب وتبدأ من 350 ريال للموقع البسيط.
    
    للاستفسار والتواصل يرجى التواصل مباشرة عبر المنصة.`,
    category: "الخدمات الطلابية",
    subcategory: "خدمات تقنية",
    college: "كلية الحاسب",
    date: "2025-04-10",
    price: 350,
    adType: "مميز+",
    duration: "30",
    views: 120,
    featured: true,
    author: {
      name: "أحمد محمد",
      university: "جامعة الملك سعود",
      rating: 4.8,
      reviews: 15,
      joined: "2024-01-05",
    },
    images: ["/placeholder.svg"],
  },
  "2": {
    id: "2",
    title: "سكن طلابي مؤثث بالكامل قريب من الجامعة",
    description: `شقة مؤثثة بالكامل، مكيفة، خدمات انترنت وماء وكهرباء مشمولة في السعر.
    
    مميزات السكن:
    - غرفة نوم واسعة مع سرير مريح
    - صالة مؤثثة بالكامل
    - مطبخ مجهز بكافة الأدوات الأساسية
    - حمام نظيف ومرتب
    - انترنت فايبر سريع
    - تكييف مركزي
    - موقع مثالي على بعد 5 دقائق مشياً من الجامعة
    - مواقف سيارات مجانية
    - أمن على مدار الساعة
    
    السعر الشهري 1200 ريال شامل جميع الخدمات (كهرباء، ماء، انترنت).
    
    متاح للإيجار بداية من الفصل الدراسي القادم.`,
    category: "السكن والمواصلات",
    subcategory: "سكن طلابي",
    college: "جميع الكليات",
    date: "2025-04-15",
    price: 1200,
    adType: "مميز",
    duration: "14",
    views: 86,
    featured: true,
    author: {
      name: "خالد العتيبي",
      university: "جامعة الملك فهد",
      rating: 4.5,
      reviews: 8,
      joined: "2023-12-10",
    },
    images: ["/placeholder.svg"],
  },
};

export default function AdDetails() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [contactMessage, setContactMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  
  // التحقق من وجود بيانات الإعلان
  if (!id || !adsData[id as keyof typeof adsData]) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">هذا الإعلان غير موجود</h1>
          <p className="text-muted-foreground mb-8">
            قد يكون الإعلان قد تم حذفه أو أن الرابط غير صحيح
          </p>
          <Link to="/ads">
            <Button>الرجوع لسوق الإعلانات</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const ad = adsData[id as keyof typeof adsData];
  
  const handleContactSeller = () => {
    if (!contactMessage.trim()) {
      toast.error("الرجاء كتابة رسالة للمعلن");
      return;
    }
    
    toast.success("تم إرسال رسالتك بنجاح، سيتواصل معك المعلن قريباً");
    setContactMessage("");
  };
  
  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول لإضافة الإعلان للمفضلة");
      return;
    }
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "تم إزالة الإعلان من المفضلة" : "تم إضافة الإعلان للمفضلة");
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: ad.description.slice(0, 100) + "...",
        url: window.location.href,
      })
      .catch((error) => console.log("Error sharing", error));
    } else {
      // نسخ الرابط إلى الحافظة
      navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ رابط الإعلان");
    }
  };
  
  const handleReport = () => {
    if (!reportReason.trim()) {
      toast.error("الرجاء كتابة سبب البلاغ");
      return;
    }
    
    toast.success("تم استلام بلاغك وسيتم مراجعته من قبل إدارة المنصة");
    setReportReason("");
    setIsReporting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* العمود الرئيسي - تفاصيل الإعلان */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Link to="/ads" className="text-primary text-sm">
                  العودة لسوق الإعلانات
                </Link>
                <h1 className="text-3xl font-bold mt-1">{ad.title}</h1>
              </div>
              <Badge
                variant={ad.adType === "مميز+" ? "default" : "outline"}
                className={ad.adType === "مميز+" ? "bg-primary" : ""}
              >
                {ad.adType}
              </Badge>
            </div>
            
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={ad.images[0]}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-1">
                    <Badge variant="outline">{ad.category}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline">{ad.subcategory}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span className="text-sm text-muted-foreground">{ad.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} />
                    <span className="text-sm text-muted-foreground">{ad.views} مشاهدة</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">الوصف</h2>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {ad.description}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">التفاصيل</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">الفئة:</span>
                      <span className="font-medium">{ad.category}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">الفئة الفرعية:</span>
                      <span className="font-medium">{ad.subcategory}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">السعر:</span>
                      <span className="font-medium">
                        {ad.price > 0 ? `${ad.price} ريال` : 'مجاناً'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">الكلية المستهدفة:</span>
                      <span className="font-medium">{ad.college}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={isFavorite ? "default" : "outline"}
                    size="sm"
                    onClick={handleToggleFavorite}
                  >
                    <Heart
                      className={`ml-1 h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                    />
                    {isFavorite ? "تمت الإضافة للمفضلة" : "أضف للمفضلة"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="ml-1 h-4 w-4" />
                    مشاركة
                  </Button>
                  <Dialog open={isReporting} onOpenChange={setIsReporting}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Flag className="ml-1 h-4 w-4" />
                        الإبلاغ
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>الإبلاغ عن إعلان غير مناسب</DialogTitle>
                        <DialogDescription>
                          يرجى توضيح سبب البلاغ ليتم مراجعته من قبل إدارة المنصة
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Textarea
                          placeholder="اكتب سبب البلاغ هنا..."
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReporting(false)}>إلغاء</Button>
                        <Button onClick={handleReport}>إرسال البلاغ</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
          
          {/* العمود الجانبي - معلومات المعلن والتواصل */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات المعلن</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{ad.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{ad.author.name}</div>
                    <div className="text-sm text-muted-foreground">{ad.author.university}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{ad.author.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({ad.author.reviews} تقييم)
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    عضو منذ {new Date(ad.author.joined).toLocaleDateString("ar-SA")}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>تواصل مع المعلن</CardTitle>
                <CardDescription>
                  أرسل رسالة مباشرة للمعلن للاستفسار أو الحجز
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="اكتب رسالتك هنا..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
                <Button
                  className="w-full"
                  onClick={handleContactSeller}
                  disabled={!user}
                >
                  <MessageSquare className="ml-2 h-4 w-4" />
                  إرسال رسالة
                </Button>
                {!user && (
                  <div className="text-sm text-center text-muted-foreground">
                    يجب{" "}
                    <Link to="/login" className="text-primary">
                      تسجيل الدخول
                    </Link>{" "}
                    للتواصل مع المعلن
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>معلومات إضافية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">رقم الإعلان:</span>
                    <span className="font-medium">{ad.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">تاريخ النشر:</span>
                    <span className="font-medium">{ad.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المشاهدات:</span>
                    <span className="font-medium">{ad.views}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                يرجى التواصل من خلال المنصة فقط لضمان حقوقك
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
