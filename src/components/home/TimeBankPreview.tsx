
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, BarChart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { TimeBankCard } from "@/components/timebank/TimeBankCard";

export function TimeBankPreview() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-primary mb-4">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">ساعة مقابل ساعة</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">نظام بنك الوقت</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              بنك الوقت هو نظام تبادل الخدمات بين الطلاب بشكل عادل. يمكنك كسب ساعات من خلال تقديم مهاراتك للآخرين، واستخدام هذه الساعات للاستفادة من مهارات زملائك.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col items-center bg-white/5 border border-primary/10 rounded-lg p-6 text-center shadow-md">
                <Clock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">ساعة بساعة</h3>
                <p className="text-muted-foreground">قدّم ساعة من وقتك، واحصل على ساعة من وقت زميلك</p>
              </div>
              <div className="flex flex-col items-center bg-white/5 border border-primary/10 rounded-lg p-6 text-center shadow-md">
                <BarChart className="h-10 w-10 text-secondary mb-4" />
                <h3 className="text-lg font-semibold mb-2">رصيد متراكم</h3>
                <p className="text-muted-foreground">تراكم الساعات في رصيدك لاستخدامها متى احتجت إليها</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/timebank" className="flex items-center gap-2">
                  استكشف بنك الوقت
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/marketplace">عرض الخدمات</Link>
              </Button>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl p-8 shadow-lg border border-muted transition-all hover:shadow-xl">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">رصيدك في بنك الوقت</h3>
                <p className="text-muted-foreground mb-6">سجّل دخولك لتتبع رصيدك وإدارة معاملاتك في بنك الوقت</p>
              </div>
              <TimeBankCard hoursEarned={6} hoursSpent={3} pendingHours={1} />
              
              <div className="mt-8 pt-6 border-t border-muted">
                <div className="flex items-center gap-4">
                  <Users className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full" />
                  <div>
                    <h4 className="font-semibold">انضم لمجتمع التبادل</h4>
                    <p className="text-sm text-muted-foreground">أكثر من 250 طالب نشط يتبادلون المهارات</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
