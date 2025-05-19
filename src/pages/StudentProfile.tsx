
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSkills } from "@/components/profile/ProfileSkills";
import { ProfilePortfolio } from "@/components/profile/ProfilePortfolio";
import { ProfileReviews } from "@/components/profile/ProfileReviews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ReportDialog } from "@/components/shared/ReportDialog";
import { toast } from "sonner";

// Sample user data for demonstration
const dummyUserData = {
  id: "user-1",
  username: "ahmed_mohammed",
  fullName: "أحمد محمد",
  university: "جامعة الملك سعود",
  department: "علوم الحاسب",
  year: "السنة الرابعة",
  bio: "طالب شغوف بتطوير الويب والذكاء الاصطناعي. أعمل على مشاريع برمجية مختلفة وأحب مساعدة الآخرين في مجالي.",
  avatarUrl: "https://i.pravatar.cc/150?img=1",
  coverUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2670&auto=format&fit=crop",
  skills: [
    { id: "1", name: "تطوير الويب", level: "متقدم" },
    { id: "2", name: "React", level: "متقدم" },
    { id: "3", name: "Node.js", level: "متوسط" },
    { id: "4", name: "Python", level: "متقدم" },
    { id: "5", name: "الذكاء الاصطناعي", level: "متوسط" },
    { id: "6", name: "تحليل البيانات", level: "متوسط" },
  ],
  social: {
    twitter: "https://twitter.com/ahmed_mohammed",
    linkedin: "https://linkedin.com/in/ahmed-mohammed",
    github: "https://github.com/ahmed-mohammed",
  },
  joinDate: "2023-02-15T00:00:00.000Z",
  lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  timebankStats: {
    hoursEarned: 42,
    hoursSpent: 28,
    rating: 4.8,
    completedExchanges: 15,
  },
};

// Skills data for the user
const userSkills = [
  {
    id: "1",
    title: "تدريس خصوصي للرياضيات",
    category: "تدريس",
    description: "تدريس مواد الرياضيات للمرحلة الجامعية، متخصص في التفاضل والتكامل والمعادلات التفاضلية والجبر الخطي.",
    hourlyRate: 3,
    rating: 4.9,
    reviewCount: 28,
    provider: {
      name: "أحمد محمد",
      university: "جامعة الملك سعود",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    badges: ["مميز", "شعبي"],
  },
  {
    id: "2",
    title: "تطوير مواقع الويب بتقنية React",
    category: "برمجة",
    description: "تطوير مواقع الويب باستخدام React وNext.js وTailwind CSS. تصميم واجهات مستخدم متجاوبة وسريعة.",
    hourlyRate: 4,
    rating: 4.7,
    reviewCount: 15,
    provider: {
      name: "أحمد محمد",
      university: "جامعة الملك سعود",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    badges: ["خبير"],
  },
  {
    id: "3",
    title: "تحليل بيانات باستخدام Python",
    category: "برمجة",
    description: "تحليل البيانات وإنشاء الرسوم البيانية باستخدام Python، Pandas، NumPy، وMatplotlib. مناسب للمشاريع البحثية والتحليلية.",
    hourlyRate: 3.5,
    rating: 4.8,
    reviewCount: 12,
    provider: {
      name: "أحمد محمد",
      university: "جامعة الملك سعود",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    badges: [],
  },
];

// Portfolio projects for the user
const userPortfolio = [
  {
    id: "1",
    title: "منصة تبادل الكتب الجامعية",
    description: "منصة إلكترونية تتيح للطلاب تبادل الكتب الجامعية والمذكرات الدراسية. تم بناؤها باستخدام React وNode.js.",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop",
    category: "تطوير الويب",
    tags: ["React", "Node.js", "MongoDB"],
    date: "2023-05-20T00:00:00.000Z",
    url: "https://book-exchange.example.com",
  },
  {
    id: "2",
    title: "نظام توصيات دراسية ذكي",
    description: "نظام يستخدم الذكاء الاصطناعي لتقديم توصيات دراسية للطلاب بناءً على اهتماماتهم ومستواهم الأكاديمي.",
    imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop",
    category: "الذكاء الاصطناعي",
    tags: ["Python", "Machine Learning", "AI"],
    date: "2022-11-15T00:00:00.000Z",
    url: "https://study-recommender.example.com",
  },
  {
    id: "3",
    title: "تطبيق جدولة المهام الدراسية",
    description: "تطبيق موبايل لمساعدة الطلاب على تنظيم وقتهم وجدولة مهامهم الدراسية والمشاريع والاختبارات.",
    imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop",
    category: "تطوير تطبيقات",
    tags: ["React Native", "Firebase", "Mobile App"],
    date: "2023-02-10T00:00:00.000Z",
    url: "https://study-planner.example.com",
  },
];

// Reviews for the user
const userReviews = [
  {
    id: "1",
    user: {
      name: "سارة عبدالله",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      university: "جامعة الأميرة نورة",
    },
    rating: 5,
    comment: "ممتاز في شرح المفاهيم المعقدة وتبسيطها. استفدت كثيراً من دروس الرياضيات التي قدمها لي.",
    date: "2023-06-20T00:00:00.000Z",
    service: "تدريس مادة التفاضل والتكامل",
  },
  {
    id: "2",
    user: {
      name: "خالد العمري",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      university: "جامعة الملك فهد",
    },
    rating: 4,
    comment: "ساعدني في تطوير موقع إلكتروني لمشروع التخرج. عمل ممتاز وسريع.",
    date: "2023-05-10T00:00:00.000Z",
    service: "تطوير موقع إلكتروني",
  },
  {
    id: "3",
    user: {
      name: "ليلى أحمد",
      avatarUrl: "https://i.pravatar.cc/150?img=9",
      university: "جامعة الأميرة نورة",
    },
    rating: 5,
    comment: "قدم لي مساعدة في تحليل البيانات لمشروع بحثي. كان متعاوناً ومحترفاً جداً.",
    date: "2023-04-05T00:00:00.000Z",
    service: "تحليل بيانات بحثية",
  },
  {
    id: "4",
    user: {
      name: "محمد العلي",
      avatarUrl: "https://i.pravatar.cc/150?img=14",
      university: "جامعة الملك سعود",
    },
    rating: 5,
    comment: "شرح ممتاز لمادة الجبر الخطي. أسلوبه سلس وواضح وساعدني على فهم المادة بشكل أفضل.",
    date: "2023-03-15T00:00:00.000Z",
    service: "تدريس مادة الجبر الخطي",
  },
];

export default function StudentProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("skills");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be a fetch to an API endpoint
    // For demo, we'll simulate a loading delay
    const timer = setTimeout(() => {
      setUserData(dummyUserData);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const handleMessageClick = () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً للتواصل مع المستخدمين");
      return;
    }
    
    // In a real app, this would navigate to messages with this user pre-selected
    toast.success("تم فتح محادثة مع أحمد محمد");
  };
  
  const handleReportSubmit = (reportData) => {
    // In a real app, this would send the report to the backend
    console.log("Report submitted:", reportData);
    toast.success("تم إرسال البلاغ بنجاح. سيتم مراجعته من قبل الإدارة.");
    setIsReportDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-10 mt-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">جاري تحميل الصفحة...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-10 mt-16">
        {userData && (
          <>
            <ProfileHeader user={userData} />
            
            <div className="mt-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                  <TabsList>
                    <TabsTrigger value="skills">المهارات</TabsTrigger>
                    <TabsTrigger value="portfolio">المشاريع</TabsTrigger>
                    <TabsTrigger value="reviews">التقييمات</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button onClick={handleMessageClick}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    مراسلة
                  </Button>
                  <ReportDialog
                    open={isReportDialogOpen}
                    onOpenChange={setIsReportDialogOpen}
                    onSubmit={handleReportSubmit}
                    reportedUser={userData}
                    contentType="profile"
                  >
                    <Button variant="outline">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      إبلاغ
                    </Button>
                  </ReportDialog>
                </div>
              </div>
              
              <TabsContent value="skills" className="mt-0">
                <ProfileSkills skills={userSkills} />
              </TabsContent>
              
              <TabsContent value="portfolio" className="mt-0">
                <ProfilePortfolio projects={userPortfolio} />
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0">
                <ProfileReviews reviews={userReviews} />
              </TabsContent>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
