
import { Navbar } from "@/components/layout/Navbar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSkills } from "@/components/profile/ProfileSkills";
import { ProfileReviews, Review } from "@/components/profile/ProfileReviews";
import { ProfilePortfolio, PortfolioItem } from "@/components/profile/ProfilePortfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for demonstration
const PROFILE_DATA = {
  name: "أحمد محمد",
  university: "جامعة الملك سعود",
  major: "علوم الحاسب",
  level: "السنة الرابعة",
  avatarUrl: "/placeholder.svg",
  rating: 4.5,
  availability: "available" as const,
  bio: "طالب في كلية علوم الحاسب والمعلومات، متخصص في تطوير الويب وتطبيقات الجوال. أقدم خدمات برمجية متنوعة للطلاب والشركات الناشئة.",
};

const SKILLS_DATA = [
  {
    id: "1",
    title: "تطوير واجهات المستخدم",
    category: "برمجة",
    description: "تصميم وتطوير واجهات مستخدم تفاعلية باستخدام React و TypeScript. خبرة في إنشاء مواقع سريعة الاستجابة.",
    hourlyRate: 3,
    provider: {
      name: PROFILE_DATA.name,
      university: PROFILE_DATA.university,
    },
  },
  {
    id: "2",
    title: "تطوير تطبيقات الجوال",
    category: "برمجة",
    description: "إنشاء تطبيقات للهواتف الذكية باستخدام React Native. تطوير تطبيقات متوافقة مع أنظمة iOS وAndroid.",
    hourlyRate: 4,
    provider: {
      name: PROFILE_DATA.name,
      university: PROFILE_DATA.university,
    },
  },
  {
    id: "3",
    title: "تصميم قواعد البيانات",
    category: "برمجة",
    description: "تصميم وإدارة قواعد البيانات العلائقية باستخدام PostgreSQL و MySQL. تحسين استعلامات SQL للأداء الأمثل.",
    hourlyRate: 3,
    provider: {
      name: PROFILE_DATA.name,
      university: PROFILE_DATA.university,
    },
  },
];

const REVIEWS_DATA: Review[] = [
  {
    id: "1",
    reviewer: {
      name: "سارة العتيبي",
      avatarUrl: "/placeholder.svg",
    },
    rating: 5,
    comment: "عمل ممتاز في تطوير موقع الويب الخاص بمشروعي. كان سريعاً ومتعاوناً جداً، وقدم اقتراحات مفيدة لتحسين المشروع.",
    date: "1 مايو 2025",
    categories: {
      quality: 5,
      speed: 5,
      cooperation: 5,
    },
  },
  {
    id: "2",
    reviewer: {
      name: "خالد الشمري",
      avatarUrl: "/placeholder.svg",
    },
    rating: 4,
    comment: "ساعدني في إنشاء تطبيق جوال لمشروع التخرج. قام بإنجاز العمل قبل الموعد النهائي والنتيجة كانت رائعة.",
    date: "15 أبريل 2025",
    categories: {
      quality: 4,
      speed: 5,
      cooperation: 4,
    },
  },
  {
    id: "3",
    reviewer: {
      name: "نورة السالم",
      avatarUrl: "/placeholder.svg",
    },
    rating: 4,
    comment: "قام بتصميم قاعدة بيانات لمشروعي بشكل احترافي ودقيق. أسلوب عمله منظم جداً.",
    date: "3 أبريل 2025",
    categories: {
      quality: 5,
      speed: 3,
      cooperation: 4,
    },
  },
];

const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: "1",
    title: "منصة تعليمية للطلاب",
    description: "تطبيق ويب لمساعدة الطلاب في تنظيم جداولهم الدراسية ومتابعة واجباتهم",
    imageUrl: "/placeholder.svg",
    link: "#",
  },
  {
    id: "2",
    title: "تطبيق مشاركة المواصلات",
    description: "تطبيق جوال يساعد طلاب الجامعة على مشاركة رحلات التنقل والمواصلات",
    imageUrl: "/placeholder.svg",
    link: "#",
  },
  {
    id: "3",
    title: "نظام إدارة المكتبة",
    description: "نظام قاعدة بيانات متكامل لإدارة عمليات الاستعارة والإرجاع في المكتبة",
    imageUrl: "/placeholder.svg",
    link: "#",
  },
  {
    id: "4",
    title: "موقع إلكتروني للنادي العلمي",
    description: "موقع تفاعلي للنادي العلمي في الجامعة مع نظام عضويات وإدارة فعاليات",
    imageUrl: "/placeholder.svg",
    link: "#",
  },
];

export default function StudentProfile() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <ProfileHeader {...PROFILE_DATA} />
          
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">نبذة تعريفية</h2>
            <p className="text-muted-foreground">{PROFILE_DATA.bio}</p>
          </div>
          
          <Tabs defaultValue="skills" className="mt-8">
            <TabsList className="w-full flex justify-start border-b">
              <TabsTrigger value="skills" className="flex-1 sm:flex-none">المهارات المقدمة</TabsTrigger>
              <TabsTrigger value="portfolio" className="flex-1 sm:flex-none">المحفظة</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 sm:flex-none">التقييمات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills">
              <ProfileSkills skills={SKILLS_DATA} />
            </TabsContent>
            
            <TabsContent value="portfolio">
              <ProfilePortfolio portfolioItems={PORTFOLIO_DATA} />
            </TabsContent>
            
            <TabsContent value="reviews">
              <ProfileReviews reviews={REVIEWS_DATA} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
