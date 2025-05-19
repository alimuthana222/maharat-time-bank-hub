
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Search,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Clock,
  Users,
  ShoppingBag,
  User,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

// FAQ categories and items
const faqCategories = [
  {
    id: "general",
    name: "أسئلة عامة",
    icon: <HelpCircle className="h-5 w-5" />,
    questions: [
      {
        question: "ما هي منصة مهارات؟",
        answer:
          "منصة مهارات هي منصة تبادل المهارات والخدمات بين الطلاب، حيث يمكن للطلاب تقديم مهاراتهم والاستفادة من مهارات زملائهم. تعتمد المنصة على نظام بنك الوقت حيث يتم تبادل الخدمات على أساس ساعة بساعة.",
      },
      {
        question: "كيف يمكنني التسجيل في المنصة؟",
        answer:
          "يمكنك التسجيل في المنصة من خلال النقر على زر 'إنشاء حساب' في الصفحة الرئيسية أو صفحة تسجيل الدخول، ثم إدخال معلوماتك الشخصية والبريد الإلكتروني وكلمة المرور والجامعة التي تنتمي إليها.",
      },
      {
        question: "هل المنصة مجانية؟",
        answer:
          "نعم، المنصة مجانية بالكامل للطلاب. تعتمد على نظام تبادل الوقت والمهارات، حيث تقدم خدماتك وتكتسب ساعات يمكنك استخدامها للحصول على خدمات من الآخرين.",
      },
    ],
  },
  {
    id: "timebank",
    name: "بنك الوقت",
    icon: <Clock className="h-5 w-5" />,
    questions: [
      {
        question: "كيف يعمل نظام بنك الوقت؟",
        answer:
          "نظام بنك الوقت يعتمد على مبدأ تبادل الوقت والمهارات بين الطلاب، حيث تكتسب ساعات في رصيدك عندما تقدم خدمات للآخرين، ويمكنك استخدام هذه الساعات للحصول على خدمات من زملائك الطلاب.",
      },
      {
        question: "كيف يتم احتساب الساعات في بنك الوقت؟",
        answer:
          "يتم احتساب الساعات بناءً على الوقت الفعلي الذي تستغرقه الخدمة. على سبيل المثال، إذا قدمت ساعتين من التدريس، ستحصل على ساعتين في رصيدك. يمكن للطلاب الاتفاق على تقدير الساعات قبل بدء الخدمة.",
      },
      {
        question: "ماذا يحدث إذا نفدت الساعات في رصيدي؟",
        answer:
          "يمكنك الحصول على خدمات حتى لو كان رصيدك صفرًا، لكن يُفضل أن تحافظ على رصيد إيجابي من خلال تقديم خدماتك للآخرين. المنصة تشجع على التوازن بين تقديم واستلام الخدمات.",
      },
    ],
  },
  {
    id: "marketplace",
    name: "سوق المهارات",
    icon: <ShoppingBag className="h-5 w-5" />,
    questions: [
      {
        question: "كيف يمكنني نشر خدمة في سوق المهارات؟",
        answer:
          "يمكنك نشر خدمة في سوق المهارات من خلال النقر على 'إنشاء إعلان جديد' في صفحة سوق المهارات، ثم إدخال تفاصيل الخدمة التي تقدمها، بما في ذلك العنوان والوصف والفئة ومعدل الساعات.",
      },
      {
        question: "كيف أبحث عن خدمات محددة؟",
        answer:
          "يمكنك البحث عن خدمات محددة من خلال خانة البحث في صفحة سوق المهارات، أو تصفية النتائج حسب الفئة أو نوع الإعلان (عرض أو طلب) أو معدل الساعات.",
      },
      {
        question: "ما الفرق بين 'عرض' و 'طلب' في سوق المهارات؟",
        answer:
          "'عرض' يعني أنك تقدم خدمة أو مهارة للآخرين. 'طلب' يعني أنك تبحث عن شخص يقدم خدمة أو مهارة محددة. يمكنك إنشاء كلا النوعين من الإعلانات حسب احتياجاتك.",
      },
    ],
  },
  {
    id: "profile",
    name: "الملف الشخصي",
    icon: <User className="h-5 w-5" />,
    questions: [
      {
        question: "كيف يمكنني تعديل معلوماتي الشخصية؟",
        answer:
          "يمكنك تعديل معلوماتك الشخصية من خلال الانتقال إلى صفحة الملف الشخصي، ثم النقر على 'تعديل الملف الشخصي'. يمكنك تغيير معلوماتك الشخصية وصورتك الشخصية وسيرتك الذاتية.",
      },
      {
        question: "كيف يمكنني إضافة مهارات إلى ملفي الشخصي؟",
        answer:
          "يمكنك إضافة مهارات إلى ملفك الشخصي من خلال الانتقال إلى قسم 'المهارات' في صفحة الملف الشخصي، ثم النقر على 'إضافة مهارة جديدة' وتحديد المهارات التي تمتلكها.",
      },
      {
        question: "هل يمكن للآخرين رؤية تاريخ معاملاتي؟",
        answer:
          "لا، تاريخ معاملاتك في بنك الوقت خاص بك ولا يمكن للآخرين الاطلاع عليه. يمكن للآخرين رؤية المهارات والخدمات التي تقدمها فقط، وليس تفاصيل معاملاتك.",
      },
    ],
  },
  {
    id: "community",
    name: "المجتمع والفعاليات",
    icon: <Users className="h-5 w-5" />,
    questions: [
      {
        question: "كيف يمكنني المشاركة في الفعاليات؟",
        answer:
          "يمكنك المشاركة في الفعاليات من خلال الانتقال إلى صفحة 'الفعاليات'، واستعراض الفعاليات المتاحة، ثم النقر على 'المشاركة' للفعالية التي ترغب في حضورها.",
      },
      {
        question: "كيف يمكنني إنشاء فعالية جديدة؟",
        answer:
          "يمكنك إنشاء فعالية جديدة من خلال الانتقال إلى صفحة 'الفعاليات'، ثم النقر على 'إنشاء فعالية جديدة'. ستحتاج إلى إدخال تفاصيل الفعالية بما في ذلك العنوان والوصف والتاريخ والموقع.",
      },
      {
        question: "ما هي مزايا المشاركة في المجتمع؟",
        answer:
          "المشاركة في المجتمع تتيح لك التواصل مع طلاب آخرين يشاركونك اهتماماتك، وحضور فعاليات تعليمية وترفيهية، والمشاركة في مناقشات حول مواضيع مختلفة. كما تساعدك على بناء شبكة علاقات قيمة قد تفيدك في حياتك الأكاديمية والمهنية.",
      },
    ],
  },
  {
    id: "security",
    name: "الأمان والخصوصية",
    icon: <Shield className="h-5 w-5" />,
    questions: [
      {
        question: "كيف يتم حماية بياناتي الشخصية؟",
        answer:
          "نحن نأخذ خصوصية وأمان بياناتك الشخصية بجدية. نستخدم تقنيات تشفير متقدمة لحماية معلوماتك، ولا نشاركها مع أي طرف ثالث دون موافقتك. يمكنك الاطلاع على سياسة الخصوصية لمزيد من التفاصيل.",
      },
      {
        question: "كيف يمكنني الإبلاغ عن محتوى غير لائق أو مسيء؟",
        answer:
          "يمكنك الإبلاغ عن أي محتوى غير لائق أو مسيء من خلال النقر على زر 'الإبلاغ' بجانب المحتوى، أو الاتصال بفريق الدعم مباشرة. سنتعامل مع جميع البلاغات بسرية تامة وسرعة.",
      },
      {
        question: "ما هي سياسة المنصة تجاه المحتوى غير اللائق؟",
        answer:
          "نحن نلتزم بتوفير بيئة آمنة وإيجابية لجميع المستخدمين. لا نسمح بأي محتوى يتضمن إساءة أو تمييزًا أو تحرشًا أو أي سلوك غير لائق آخر. سيتم اتخاذ إجراءات فورية ضد أي مستخدم ينتهك هذه السياسة، بما في ذلك تعليق أو إنهاء حسابه.",
      },
    ],
  },
];

interface HelpCenterGuide {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  link: string;
}

const popularGuides: HelpCenterGuide[] = [
  {
    id: "getting-started",
    title: "دليل البداية",
    description: "كل ما تحتاج معرفته لبدء استخدام منصة مهارات",
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    link: "/help/guide/getting-started"
  },
  {
    id: "timebank-guide",
    title: "كيفية استخدام بنك الوقت",
    description: "تعرف على كيفية تبادل الساعات وإدارة رصيدك",
    icon: <Clock className="h-10 w-10 text-primary" />,
    link: "/help/guide/timebank"
  },
  {
    id: "marketplace-guide",
    title: "دليل سوق المهارات",
    description: "كيفية نشر وطلب الخدمات في سوق المهارات",
    icon: <ShoppingBag className="h-10 w-10 text-primary" />,
    link: "/help/guide/marketplace"
  },
  {
    id: "community-guide",
    title: "المشاركة في المجتمع",
    description: "كيفية المشاركة في الفعاليات والمناقشات",
    icon: <Users className="h-10 w-10 text-primary" />,
    link: "/help/guide/community"
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("faq");
  
  // Filter FAQ based on search query
  const filteredFAQ = searchQuery 
    ? faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(
          q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
               q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqCategories;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow mt-16">
        {/* Hero section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-6">مركز المساعدة</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              نحن هنا لمساعدتك. ابحث عن إجابات لأسئلتك أو تصفح الأقسام أدناه.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                className="pl-10 h-12"
                placeholder="ابحث في مركز المساعدة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>
        
        {/* Quick links */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">أدلة شائعة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularGuides.map((guide) => (
                <Card key={guide.id} className="transition-all hover:shadow-md">
                  <CardHeader className="pb-4 text-center">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4">
                      {guide.icon}
                    </div>
                    <CardTitle>{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-6">
                      {guide.description}
                    </CardDescription>
                    <Button variant="outline" asChild>
                      <Link to={guide.link}>قراءة الدليل</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ and Contact sections */}
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <Tabs
              defaultValue="faq"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="faq">الأسئلة الشائعة</TabsTrigger>
                  <TabsTrigger value="contact">تواصل معنا</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="faq">
                <div className="max-w-3xl mx-auto">
                  {filteredFAQ.length > 0 ? (
                    filteredFAQ.map((category) => (
                      <div key={category.id} className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          {category.icon}
                          <h3 className="text-xl font-bold">{category.name}</h3>
                        </div>
                        
                        <Accordion type="single" collapsible className="w-full">
                          {category.questions.map((item, index) => (
                            <AccordionItem key={index} value={`${category.id}-${index}`}>
                              <AccordionTrigger className="text-right">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="text-muted-foreground">
                                  {item.answer}
                                </p>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">لم يتم العثور على نتائج</h3>
                      <p className="text-muted-foreground mb-6">
                        لم نتمكن من العثور على إجابات تطابق بحثك. جرب كلمات بحث مختلفة أو اتصل بنا للمساعدة.
                      </p>
                      <Button onClick={() => setActiveTab("contact")}>تواصل معنا</Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="contact">
                <div className="max-w-2xl mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>تواصل مع فريق الدعم</CardTitle>
                      <CardDescription>
                        أرسل لنا استفسارك وسنقوم بالرد عليك في أقرب وقت ممكن
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">الاسم</label>
                          <Input id="name" placeholder="أدخل اسمك" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
                          <Input id="email" type="email" placeholder="أدخل بريدك الإلكتروني" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">الموضوع</label>
                        <Input id="subject" placeholder="أدخل عنوان الاستفسار" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">الرسالة</label>
                        <textarea
                          id="message"
                          className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-base"
                          placeholder="اكتب رسالتك هنا..."
                        />
                      </div>
                      <div className="pt-4">
                        <Button className="w-full md:w-auto">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          إرسال الرسالة
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-center text-lg">البريد الإلكتروني</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <a href="mailto:support@skills-platform.com" className="text-primary hover:underline">
                          support@skills-platform.com
                        </a>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-center text-lg">الدعم المباشر</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <MessageSquare className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <p className="text-muted-foreground">متاح من الأحد إلى الخميس</p>
                        <p className="font-medium">9:00 ص - 5:00 م</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-center text-lg">مركز المعرفة</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <BookOpen className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <Link to="/knowledge-base" className="text-primary hover:underline">
                          تصفح قاعدة المعرفة
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Helper component for the Mail icon
function Mail(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
