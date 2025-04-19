
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageSquare,
  Heart,
  Share2,
  Flag,
  Search,
  Plus,
  ThumbsUp,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// Mock discussion data
const MOCK_DISCUSSIONS = [
  {
    id: "1",
    title: "كيفية تحسين مهارات العمل الجماعي في مشاريع البرمجة؟",
    content:
      "أعمل حالياً على مشروع تخرج مع مجموعة من الطلاب، وأواجه صعوبة في تنسيق العمل وتوزيع المهام. هل لديكم نصائح لتحسين التعاون وإدارة المشروع بشكل أفضل؟",
    author: {
      name: "أحمد الزهراني",
      avatar: "أز",
      university: "جامعة الملك سعود",
    },
    createdAt: "منذ 2 ساعة",
    commentsCount: 12,
    likesCount: 24,
    tags: ["برمجة", "عمل جماعي", "مشاريع تخرج"],
  },
  {
    id: "2",
    title: "أفضل المصادر لتعلم تصميم واجهات المستخدم UI/UX",
    content:
      "أرغب في تطوير مهاراتي في تصميم واجهات المستخدم وتجربة المستخدم. هل يمكن مشاركة أفضل الكتب، الدورات أو المواقع التي تنصحون بها للمبتدئين؟",
    author: {
      name: "نورة السالم",
      avatar: "نس",
      university: "جامعة الأميرة نورة",
    },
    createdAt: "منذ 5 ساعات",
    commentsCount: 8,
    likesCount: 15,
    tags: ["تصميم", "UI/UX", "تعلم ذاتي"],
  },
  {
    id: "3",
    title: "تجربتي في العمل الحر كمبرمج أثناء الدراسة الجامعية",
    content:
      "أود مشاركة تجربتي في العمل الحر كمطور ويب خلال سنوات دراستي الجامعية. سأتحدث عن التحديات، الفرص، وكيفية الموازنة بين الدراسة والعمل...",
    author: {
      name: "محمد العتيبي",
      avatar: "مع",
      university: "جامعة الملك فهد للبترول والمعادن",
    },
    createdAt: "منذ يوم",
    commentsCount: 20,
    likesCount: 42,
    tags: ["عمل حر", "برمجة", "خبرات"],
  },
  {
    id: "4",
    title: "كيف يمكن الاستعداد لسوق العمل في مجال تقنية المعلومات؟",
    content:
      "أنا طالب سنة أخيرة في تخصص علوم الحاسب، وأرغب في معرفة أفضل الطرق للاستعداد لسوق العمل. ما هي المهارات المطلوبة حالياً؟ وكيف يمكنني بناء سيرة ذاتية قوية؟",
    author: {
      name: "فيصل القحطاني",
      avatar: "فق",
      university: "جامعة الإمام عبدالرحمن بن فيصل",
    },
    createdAt: "منذ يومين",
    commentsCount: 15,
    likesCount: 30,
    tags: ["وظائف", "تطوير مهني", "سوق العمل"],
  },
];

// Mock questions data
const MOCK_QUESTIONS = [
  {
    id: "1",
    title: "كيف يمكنني حل مشكلة في خوارزمية البحث الثنائي؟",
    content:
      "أواجه مشكلة في تطبيق خوارزمية البحث الثنائي على مصفوفة مرتبة تصاعدياً. الكود يعمل مع بعض الحالات ولكنه يفشل مع أخرى. هل يمكن مساعدتي في تصحيح الخطأ؟",
    author: {
      name: "سلطان المالكي",
      avatar: "سم",
      university: "جامعة الملك عبدالعزيز",
    },
    createdAt: "منذ 3 ساعات",
    answersCount: 5,
    status: "مفتوح",
    tags: ["خوارزميات", "برمجة", "هياكل بيانات"],
  },
  {
    id: "2",
    title: "كيفية إعداد بيئة تطوير React Native على نظام ويندوز؟",
    content:
      "أحاول إعداد بيئة تطوير React Native على جهازي الذي يعمل بنظام ويندوز 10، لكنني أواجه العديد من المشاكل. هل يمكن مساعدتي بخطوات واضحة ومفصلة؟",
    author: {
      name: "عبدالله الشمري",
      avatar: "عش",
      university: "جامعة الملك خالد",
    },
    createdAt: "منذ 8 ساعات",
    answersCount: 3,
    status: "مفتوح",
    tags: ["React Native", "تطوير تطبيقات", "ويندوز"],
  },
  {
    id: "3",
    title: "ما هو الفرق بين الـ Promise و Async/Await في JavaScript؟",
    content:
      "أنا جديد في عالم JavaScript وأحاول فهم آليات التعامل مع العمليات غير المتزامنة. هل يمكن شرح الفرق بين الـ Promise و Async/Await مع أمثلة بسيطة؟",
    author: {
      name: "منى الحربي",
      avatar: "مح",
      university: "جامعة طيبة",
    },
    createdAt: "منذ يوم",
    answersCount: 8,
    status: "حُل",
    tags: ["JavaScript", "برمجة", "تطوير ويب"],
  },
  {
    id: "4",
    title: "كيفية تحسين أداء قاعدة بيانات MySQL لتطبيق ويب؟",
    content:
      "لدي تطبيق ويب يستخدم قاعدة بيانات MySQL ويعاني من بطء في الاستجابة عند زيادة عدد المستخدمين. ما هي أفضل الممارسات لتحسين الأداء وتسريع الاستعلامات؟",
    author: {
      name: "طارق العنزي",
      avatar: "طع",
      university: "جامعة القصيم",
    },
    createdAt: "منذ يومين",
    answersCount: 10,
    status: "مفتوح",
    tags: ["قواعد بيانات", "MySQL", "تحسين أداء"],
  },
];

export default function Community() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("discussions");

  const handleLike = (id: string) => {
    toast.success("تم تسجيل إعجابك بالمنشور");
  };

  const handleShare = (id: string) => {
    toast.success("تم نسخ رابط المنشور");
  };

  const filteredDiscussions = MOCK_DISCUSSIONS.filter(
    (discussion) =>
      discussion.title.includes(searchTerm) ||
      discussion.content.includes(searchTerm) ||
      discussion.tags.some((tag) => tag.includes(searchTerm))
  );

  const filteredQuestions = MOCK_QUESTIONS.filter(
    (question) =>
      question.title.includes(searchTerm) ||
      question.content.includes(searchTerm) ||
      question.tags.some((tag) => tag.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">مجتمع الطلاب</h1>
          <Button onClick={() => toast.success("سيتم تنفيذ هذه الميزة قريباً")}>
            <Plus className="ml-2 h-4 w-4" />
            إنشاء منشور جديد
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Main content */}
          <div className="md:w-3/4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في المجتمع..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Tabs
              defaultValue="discussions"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-4"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="discussions">المناقشات</TabsTrigger>
                <TabsTrigger value="questions">الأسئلة</TabsTrigger>
              </TabsList>

              <TabsContent value="discussions">
                <div className="space-y-6">
                  {filteredDiscussions.length > 0 ? (
                    filteredDiscussions.map((discussion) => (
                      <Card key={discussion.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {discussion.author.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg">
                                  {discussion.title}
                                </CardTitle>
                                <CardDescription>
                                  <span>
                                    {discussion.author.name} • {discussion.author.university} •{" "}
                                    {discussion.createdAt}
                                  </span>
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-foreground/90">{discussion.content}</p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {discussion.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                          <div className="flex items-center space-x-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(discussion.id)}
                              className="flex items-center gap-1"
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span>{discussion.likesCount}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>{discussion.commentsCount}</span>
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare(discussion.id)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Flag className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        لم يتم العثور على مناقشات مطابقة للبحث
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="questions">
                <div className="space-y-6">
                  {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question) => (
                      <Card key={question.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {question.author.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-lg">
                                    {question.title}
                                  </CardTitle>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      question.status === "حُل"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {question.status}
                                  </span>
                                </div>
                                <CardDescription>
                                  <span>
                                    {question.author.name} • {question.author.university} •{" "}
                                    {question.createdAt}
                                  </span>
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-foreground/90">{question.content}</p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {question.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-muted-foreground">
                              {question.answersCount} إجابة
                            </span>
                          </div>
                          <Button variant="outline" size="sm">
                            إجابة
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        لم يتم العثور على أسئلة مطابقة للبحث
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="md:w-1/4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المجتمع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>المستخدمين النشطين</span>
                  <span className="font-bold">1,245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>المناقشات</span>
                  <span className="font-bold">357</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>الأسئلة</span>
                  <span className="font-bold">528</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>الإجابات</span>
                  <span className="font-bold">1,890</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المواضيع الشائعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="ml-2">
                  #برمجة
                </Button>
                <Button variant="outline" size="sm" className="ml-2">
                  #تصميم
                </Button>
                <Button variant="outline" size="sm" className="ml-2">
                  #تطوير_ويب
                </Button>
                <Button variant="outline" size="sm" className="ml-2">
                  #تخرج
                </Button>
                <Button variant="outline" size="sm" className="ml-2">
                  #وظائف
                </Button>
                <Button variant="outline" size="sm" className="ml-2">
                  #تعلم_ذاتي
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أعضاء نشطون</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>أز</AvatarFallback>
                  </Avatar>
                  <span>أحمد الزهراني</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>نس</AvatarFallback>
                  </Avatar>
                  <span>نورة السالم</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>مع</AvatarFallback>
                  </Avatar>
                  <span>محمد العتيبي</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>سم</AvatarFallback>
                  </Avatar>
                  <span>سلطان المالكي</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
