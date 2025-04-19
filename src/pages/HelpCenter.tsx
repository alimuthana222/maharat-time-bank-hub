
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, HelpCircle, Book, FileText, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

// Mock FAQ data
const FAQ_DATA = [
  {
    category: "عام",
    items: [
      {
        question: "ما هي منصة مهارات؟",
        answer: "منصة مهارات هي منصة تبادل المهارات والخدمات بين طلاب الجامعات. تتيح المنصة للطلاب تقديم خدماتهم ومهاراتهم للطلاب الآخرين والاستفادة من نظام بنك الوقت لدفع مقابل الخدمات التي يحصلون عليها."
      },
      {
        question: "كيف يمكنني التسجيل في المنصة؟",
        answer: "يمكنك التسجيل في المنصة من خلال الضغط على زر 'تسجيل' في الصفحة الرئيسية، ثم إدخال بياناتك الشخصية والأكاديمية وإنشاء حساب جديد."
      },
      {
        question: "هل المنصة متاحة لجميع الطلاب؟",
        answer: "نعم، المنصة متاحة لجميع طلاب الجامعات في المملكة العربية السعودية. نحن نسعى لتوسيع نطاق خدماتنا لتشمل جميع الجامعات في المنطقة."
      }
    ]
  },
  {
    category: "بنك الوقت",
    items: [
      {
        question: "كيف يعمل نظام بنك الوقت؟",
        answer: "نظام بنك الوقت هو نظام تبادل الخدمات على أساس الوقت. عندما تقدم خدمة لشخص آخر، تكسب ساعات يمكنك استخدامها لاحقاً للحصول على خدمات من آخرين. الساعة تعادل ساعة، بغض النظر عن نوع الخدمة."
      },
      {
        question: "كيف أحصل على ساعات في بنك الوقت؟",
        answer: "يمكنك الحصول على ساعات من خلال تقديم خدمات لطلاب آخرين. عند إكمال الخدمة وتأكيدها من المستفيد، سيتم إضافة الساعات المتفق عليها إلى رصيدك."
      },
      {
        question: "هل يمكنني تحويل الساعات إلى نقود؟",
        answer: "لا، لا يمكن تحويل ساعات بنك الوقت إلى نقود. النظام مصمم للتبادل المباشر للخدمات بين الطلاب بناءً على مبدأ 'الوقت مقابل الوقت'."
      }
    ]
  },
  {
    category: "الخدمات والمعاملات",
    items: [
      {
        question: "كيف أضيف خدمة جديدة؟",
        answer: "يمكنك إضافة خدمة جديدة من خلال لوحة التحكم الخاصة بك، ثم النقر على 'إضافة خدمة جديدة'. قم بتعبئة تفاصيل الخدمة مثل العنوان، الوصف، التصنيف، والسعر بالساعة."
      },
      {
        question: "كيف يتم التواصل مع مقدم الخدمة؟",
        answer: "عند اختيار خدمة، يمكنك التواصل مع مقدم الخدمة من خلال نظام المراسلة الداخلي في المنصة. يمكنك مناقشة التفاصيل، الأسعار، والجدول الزمني للخدمة."
      },
      {
        question: "ماذا لو لم أكن راضياً عن الخدمة المقدمة؟",
        answer: "في حال عدم الرضا عن الخدمة، يمكنك التواصل مع مقدم الخدمة أولاً لحل المشكلة. إذا لم يتم حل المشكلة، يمكنك فتح نزاع من خلال نظام حل النزاعات في المنصة، وسيقوم فريق الدعم بمراجعة الحالة."
      }
    ]
  },
  {
    category: "الأمان والخصوصية",
    items: [
      {
        question: "كيف تحمي المنصة بياناتي الشخصية؟",
        answer: "نحن نستخدم تقنيات تشفير متقدمة لحماية بياناتك الشخصية. لا نشارك معلوماتك مع أطراف ثالثة بدون موافقتك، ونلتزم بسياسة خصوصية صارمة تضمن حماية معلوماتك."
      },
      {
        question: "هل المعاملات المالية آمنة؟",
        answer: "نعم، جميع المعاملات في بنك الوقت مشفرة ومحمية. نستخدم نظاماً آمناً لتسجيل وتوثيق جميع المعاملات لضمان الشفافية والأمان."
      },
      {
        question: "كيف يتم التحقق من هويات المستخدمين؟",
        answer: "نقوم بالتحقق من هويات المستخدمين من خلال التأكد من بريدهم الإلكتروني الجامعي والتفاصيل الأكاديمية. في بعض الحالات، قد نطلب وثائق إضافية للتحقق من الهوية."
      }
    ]
  }
];

// Mock guides data
const GUIDES_DATA = [
  {
    id: "1",
    title: "دليل البداية السريعة",
    description: "خطوات بسيطة للبدء باستخدام منصة مهارات",
    icon: <Book className="h-6 w-6" />,
  },
  {
    id: "2",
    title: "دليل استخدام بنك الوقت",
    description: "كيفية إدارة رصيدك وإجراء المعاملات في بنك الوقت",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    id: "3",
    title: "دليل تقديم الخدمات",
    description: "نصائح لإنشاء وتسويق خدماتك على المنصة",
    icon: <MessageSquare className="h-6 w-6" />,
  },
  {
    id: "4",
    title: "دليل الأمان والخصوصية",
    description: "كيفية حماية حسابك ومعلوماتك الشخصية",
    icon: <HelpCircle className="h-6 w-6" />,
  },
];

// Mock policies data
const POLICIES_DATA = [
  {
    title: "شروط الاستخدام",
    content: "تحدد هذه الشروط العلاقة بينك وبين منصة مهارات عند استخدامك للخدمات المقدمة عبر الموقع...",
  },
  {
    title: "سياسة الخصوصية",
    content: "تصف سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها عند استخدام خدماتنا...",
  },
  {
    title: "حقوق الملكية الفكرية",
    content: "جميع المحتويات المنشورة على منصة مهارات تخضع لحقوق الملكية الفكرية وحقوق النشر...",
  },
  {
    title: "سياسة الإلغاء والاسترداد",
    content: "توضح هذه السياسة شروط وأحكام إلغاء الخدمات واسترداد ساعات بنك الوقت...",
  },
];

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.");
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const filteredFAQ = FAQ_DATA.map(category => ({
    ...category,
    items: category.items.filter(
      item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-primary/10 py-12">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">مركز المساعدة والدعم</h1>
            <p className="text-lg text-muted-foreground mb-6">
              نحن هنا لمساعدتك. ابحث عن إجابات لأسئلتك أو تواصل معنا مباشرة.
            </p>
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="ابحث في مركز المساعدة..." 
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto py-12">
          <Tabs defaultValue="faq">
            <TabsList className="mb-8 justify-center">
              <TabsTrigger value="faq">الأسئلة الشائعة</TabsTrigger>
              <TabsTrigger value="guides">أدلة الاستخدام</TabsTrigger>
              <TabsTrigger value="policies">السياسات والشروط</TabsTrigger>
              <TabsTrigger value="contact">اتصل بنا</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">الأسئلة الشائعة</h2>
                
                {searchTerm && filteredFAQ.length === 0 ? (
                  <div className="text-center py-8">
                    <HelpCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">لم نجد إجابات مطابقة</h3>
                    <p className="text-muted-foreground">
                      حاول البحث بكلمات مختلفة أو تواصل معنا مباشرة للحصول على المساعدة
                    </p>
                  </div>
                ) : (
                  (searchTerm ? filteredFAQ : FAQ_DATA).map((category, index) => (
                    <div key={index} className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
                      <Accordion type="single" collapsible className="w-full">
                        {category.items.map((item, itemIndex) => (
                          <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                            <AccordionTrigger className="text-right">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-right">
                              {item.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="guides">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">أدلة استخدام المنصة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {GUIDES_DATA.map(guide => (
                    <Card key={guide.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {guide.icon}
                          </div>
                          <CardTitle>{guide.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{guide.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="policies">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">السياسات وقواعد الاستخدام</h2>
                <Accordion type="single" collapsible className="w-full">
                  {POLICIES_DATA.map((policy, index) => (
                    <AccordionItem key={index} value={`policy-${index}`}>
                      <AccordionTrigger className="text-right">
                        {policy.title}
                      </AccordionTrigger>
                      <AccordionContent className="text-right">
                        {policy.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="contact">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">اتصل بنا</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">البريد الإلكتروني</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-primary">support@maharat.com</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">الهاتف</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-primary">+966 12 345 6789</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">ساعات العمل</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p>الأحد - الخميس</p>
                      <p className="text-muted-foreground">9:00 ص - 5:00 م</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>نموذج الاتصال</CardTitle>
                    <CardDescription>
                      أرسل لنا استفسارك وسنرد عليك في أقرب وقت ممكن.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            الاسم الكامل
                          </label>
                          <Input
                            id="name"
                            placeholder="أدخل اسمك الكامل"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            البريد الإلكتروني
                          </label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="أدخل بريدك الإلكتروني"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          الموضوع
                        </label>
                        <Input
                          id="subject"
                          placeholder="أدخل موضوع الرسالة"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          الرسالة
                        </label>
                        <textarea
                          id="message"
                          className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="أدخل رسالتك هنا..."
                          value={contactForm.message}
                          onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                          required
                        ></textarea>
                      </div>
                      <Button type="submit" className="w-full">
                        <Send className="ml-2 h-4 w-4" />
                        إرسال الرسالة
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
