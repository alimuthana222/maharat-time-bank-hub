
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSkills } from "@/components/profile/ProfileSkills";
import { ProfileReviews } from "@/components/profile/ProfileReviews";
import { ProfilePortfolio } from "@/components/profile/ProfilePortfolio";
import { ReportDialog } from "@/components/shared/ReportDialog";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  university: string;
  bio: string;
  joinedDate: string;
  skills: {
    id: string;
    name: string;
    level: "beginner" | "intermediate" | "expert";
    category: string; // Added this
    title: string; // Added this
    description: string; // Added this
    hourlyRate: number; // Added this
    provider: { // Added this
      name: string;
      university?: string;
      avatarUrl?: string;
    };
  }[];
  portfolioProjects: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    tags: string[];
    date: string;
    url: string;
  }[];
  reviews: {
    id: string;
    reviewer: {
      id: string;
      name: string;
      avatarUrl: string;
      university: string;
    };
    rating: number;
    categories: {
      quality: number;
      speed: number;
      cooperation: number;
    };
    comment: string;
    date: string;
  }[];
}

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("skills");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
  // Simulate loading user data
  useEffect(() => {
    // In a real app, fetch user data from API
    setTimeout(() => {
      const sampleUser = {
        id: id || "user-1",
        fullName: "أحمد محمد عبدالله",
        username: "@ahmad_abdullah",
        avatarUrl: "https://i.pravatar.cc/300?img=12",
        university: "جامعة الملك سعود",
        bio: "طالب في كلية علوم الحاسب، مهتم بتطوير الويب والذكاء الاصطناعي. أعمل على عدة مشاريع تقنية وأقدم خدمات برمجية للطلاب.",
        joinedDate: "2023-09-15",
        skills: [
          { 
            id: "skill1", 
            name: "تطوير الواجهات الأمامية", 
            level: "expert" as const,
            title: "تطوير الواجهات الأمامية",
            category: "برمجة",
            description: "تطوير واجهات مستخدم تفاعلية باستخدام أحدث التقنيات",
            hourlyRate: 3,
            provider: {
              name: "أحمد محمد عبدالله",
              university: "جامعة الملك سعود",
              avatarUrl: "https://i.pravatar.cc/300?img=12"
            }
          },
          { 
            id: "skill2", 
            name: "React.js", 
            level: "expert" as const,
            title: "React.js",
            category: "برمجة",
            description: "تطوير تطبيقات الويب باستخدام React.js",
            hourlyRate: 4,
            provider: {
              name: "أحمد محمد عبدالله",
              university: "جامعة الملك سعود",
              avatarUrl: "https://i.pravatar.cc/300?img=12"
            }
          },
          { 
            id: "skill3", 
            name: "تصميم قواعد البيانات", 
            level: "intermediate" as const,
            title: "تصميم قواعد البيانات",
            category: "برمجة",
            description: "تصميم وتطوير قواعد بيانات فعالة",
            hourlyRate: 3,
            provider: {
              name: "أحمد محمد عبدالله",
              university: "جامعة الملك سعود",
              avatarUrl: "https://i.pravatar.cc/300?img=12"
            }
          },
          { 
            id: "skill4", 
            name: "Node.js", 
            level: "intermediate" as const,
            title: "Node.js",
            category: "برمجة",
            description: "تطوير خدمات الويب باستخدام Node.js",
            hourlyRate: 3,
            provider: {
              name: "أحمد محمد عبدالله",
              university: "جامعة الملك سعود",
              avatarUrl: "https://i.pravatar.cc/300?img=12"
            }
          },
          { 
            id: "skill5", 
            name: "تصميم واجهات المستخدم", 
            level: "expert" as const,
            title: "تصميم واجهات المستخدم",
            category: "تصميم",
            description: "تصميم واجهات مستخدم جذابة وسهلة الاستخدام",
            hourlyRate: 4,
            provider: {
              name: "أحمد محمد عبدالله",
              university: "جامعة الملك سعود",
              avatarUrl: "https://i.pravatar.cc/300?img=12"
            }
          },
        ],
        portfolioProjects: [
          {
            id: "project1",
            title: "تطبيق إدارة المهام للطلاب",
            description: "تطبيق ويب لمساعدة الطلاب على تنظيم مهامهم الدراسية",
            imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
            category: "تطوير الويب",
            tags: ["React", "Node.js", "MongoDB"],
            date: "2023-05-20",
            url: "https://example.com/project1"
          },
          {
            id: "project2",
            title: "منصة تبادل الكتب الجامعية",
            description: "منصة تتيح للطلاب تبادل الكتب الجامعية بسهولة",
            imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
            category: "تطوير الويب",
            tags: ["Vue.js", "Firebase", "Tailwind CSS"],
            date: "2023-03-15",
            url: "https://example.com/project2"
          },
          {
            id: "project3",
            title: "تطبيق جوال لحساب المعدل التراكمي",
            description: "تطبيق جوال لحساب المعدل التراكمي للطلاب",
            imageUrl: "https://images.unsplash.com/photo-1581092918325-5c40b5aea3be",
            category: "تطوير تطبيقات الموبايل",
            tags: ["React Native", "Redux", "Firebase"],
            date: "2022-11-10",
            url: "https://example.com/project3"
          }
        ],
        reviews: [
          {
            id: "review1",
            reviewer: {
              id: "user2",
              name: "سارة أحمد",
              avatarUrl: "https://i.pravatar.cc/150?img=5",
              university: "جامعة الملك سعود"
            },
            rating: 5,
            categories: {
              quality: 5,
              speed: 5,
              cooperation: 5
            },
            comment: "قام أحمد بمساعدتي في مشروع تطوير موقع ويب، وكان العمل ممتازا وفي الوقت المحدد.",
            date: "2023-08-15"
          },
          {
            id: "review2",
            reviewer: {
              id: "user3",
              name: "محمد علي",
              avatarUrl: "https://i.pravatar.cc/150?img=3",
              university: "جامعة الملك فهد"
            },
            rating: 4,
            categories: {
              quality: 4,
              speed: 5,
              cooperation: 3
            },
            comment: "ساعدني أحمد في تصميم قاعدة بيانات لمشروعي التخرج، كان التصميم جيدا جدا لكن احتجت لبعض التعديلات الإضافية.",
            date: "2023-07-20"
          }
        ]
      };
      
      setProfileData(sampleUser);
      setIsLoading(false);
    }, 1000);
  }, [id]);
  
  const handleReport = (reportData: any) => {
    console.log("Report submitted:", reportData);
    toast.success("تم إرسال البلاغ بنجاح");
    setIsReportDialogOpen(false);
  };
  
  const handleSendMessage = () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولا");
      navigate("/auth");
      return;
    }
    
    navigate(`/messages?userId=${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-10 mt-16">
        {isLoading ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-60 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </div>
        ) : profileData ? (
          <>
            <ProfileHeader 
              name={profileData.fullName}
              university={profileData.university}
              major="علوم الحاسب"
              level="طالب بكالوريوس"
              avatarUrl={profileData.avatarUrl}
              rating={4.5}
              availability="available"
            />
            
            <div className="flex flex-col md:flex-row mt-6 gap-6">
              <div className="md:w-2/3">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="skills">المهارات</TabsTrigger>
                    <TabsTrigger value="portfolio">معرض الأعمال</TabsTrigger>
                    <TabsTrigger value="reviews">التقييمات</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="skills">
                    <ProfileSkills skills={profileData.skills} />
                  </TabsContent>
                  
                  <TabsContent value="portfolio">
                    <ProfilePortfolio portfolioItems={profileData.portfolioProjects.map(project => ({
                      id: project.id,
                      title: project.title,
                      description: project.description,
                      imageUrl: project.imageUrl,
                      link: project.url
                    }))} />
                  </TabsContent>
                  
                  <TabsContent value="reviews">
                    <ProfileReviews reviews={profileData.reviews.map(review => ({
                      id: review.id,
                      reviewer: {
                        name: review.reviewer.name,
                        avatarUrl: review.reviewer.avatarUrl
                      },
                      rating: review.rating,
                      comment: review.comment,
                      date: review.date,
                      categories: {
                        quality: review.categories.quality,
                        speed: review.categories.speed,
                        cooperation: review.categories.cooperation
                      }
                    }))} />
                  </TabsContent>
                </Tabs>
                
                <ReportDialog
                  isOpen={isReportDialogOpen}
                  onClose={() => setIsReportDialogOpen(false)}
                  contentId={profileData?.id || ''}
                  contentType="profile"
                  reportedUserId={profileData?.id || ''}
                />
              </div>
              
              <div className="md:w-1/3 mt-6 md:mt-0 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-bold">اتصال وتواصل</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full" 
                      onClick={handleSendMessage}
                    >
                      إرسال رسالة
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsReportDialogOpen(true)}
                    >
                      إبلاغ عن الملف الشخصي
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-bold">إحصائيات</h3>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">معدل التقييم:</span>
                      <span className="font-medium">4.5/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">عدد المشاريع المكتملة:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ساعات بنك الوقت:</span>
                      <span className="font-medium">24 ساعة</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ الانضمام:</span>
                      <span className="font-medium">{new Date(profileData.joinedDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-2">لم يتم العثور على الملف الشخصي</h2>
            <p className="text-muted-foreground mb-6">
              عذراً، لم نتمكن من العثور على الملف الشخصي المطلوب.
            </p>
            <Button onClick={() => navigate("/")}>
              العودة للصفحة الرئيسية
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
