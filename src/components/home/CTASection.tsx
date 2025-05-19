
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Users, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-90" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-2 bg-white/20 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="h-5 w-5 text-white mr-2" />
            <span className="text-white font-medium">انضم لأكثر من 1000 طالب نشط</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            انضم لمجتمع تبادل المهارات
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            سجل الآن وابدأ في تبادل المهارات مع زملائك الطلاب. قدّم مهاراتك واستفد من مهارات الآخرين في نظام عادل وفعال.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" className="bg-white hover:bg-white/90 text-primary" asChild>
              <Link to="/register" className="flex items-center gap-2">
                إنشاء حساب
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/skills" className="flex items-center gap-2">
                <Users className="h-4 w-4 mr-1" />
                استكشف المهارات
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">+1000</div>
              <div className="text-white/80 text-sm">طالب مسجل</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">+500</div>
              <div className="text-white/80 text-sm">مهارة متاحة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">+2500</div>
              <div className="text-white/80 text-sm">ساعة تم تبادلها</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
