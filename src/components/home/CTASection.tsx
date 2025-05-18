
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">انضم لمجتمع تبادل المهارات</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          سجل الآن وابدأ في تبادل المهارات مع زملائك الطلاب. قدّم مهاراتك واستفد من مهارات الآخرين في نظام عادل وفعال.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">إنشاء حساب</Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground" asChild>
            <Link to="/skills">استكشف المهارات</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
