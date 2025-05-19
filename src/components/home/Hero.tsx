
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Clock, Users, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute start-1/2 top-0 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary/30 to-secondary/30 opacity-30" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
        </div>
      </div>

      <div className="pb-16 pt-14 sm:pb-20 lg:pb-24 lg:pt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              منصة تبادل المهارات والخدمات للطلاب
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              ساعد زملائك واستفد من مهاراتهم. نظام بنك الوقت يضمن تبادل عادل للخدمات بين الطلاب.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/register" className="flex items-center gap-2">
                  ابدأ الآن
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/marketplace">استكشف المهارات</Link>
              </Button>
            </div>
          </div>
          
          <div className="mt-16 flow-root sm:mt-24">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-white/5 border border-primary/10 p-8 text-center shadow-lg transition-all hover:border-primary/20 hover:shadow-xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Brain className="h-7 w-7 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-8">مهارات متنوعة</h3>
                <p className="mt-2 text-base leading-7 text-muted-foreground">
                  تبادل المهارات في التصميم والبرمجة والترجمة والتدريس الخصوصي وأكثر
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-secondary/10 p-8 text-center shadow-lg transition-all hover:border-secondary/20 hover:shadow-xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10">
                  <Clock className="h-7 w-7 text-secondary" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-8">بنك الوقت</h3>
                <p className="mt-2 text-base leading-7 text-muted-foreground">
                  بنك الوقت يضمن تبادل عادل للخدمات، ساعة بساعة
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-accent/10 p-8 text-center shadow-lg transition-all hover:border-accent/20 hover:shadow-xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                  <Users className="h-7 w-7 text-accent" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-8">سوق الاحتياجات</h3>
                <p className="mt-2 text-base leading-7 text-muted-foreground">
                  نشر احتياجاتك وعروضك في سوق مخصص للطلاب
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-primary/10 p-8 text-center shadow-lg transition-all hover:border-primary/20 hover:shadow-xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-7 w-7 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-8">فعاليات المجتمع</h3>
                <p className="mt-2 text-base leading-7 text-muted-foreground">
                  شارك في الفعاليات وورش العمل وتواصل مع مجتمع الطلاب
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
