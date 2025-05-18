
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { TimeBankCard } from "@/components/timebank/TimeBankCard";

export function TimeBankPreview() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">نظام بنك الوقت</h2>
            <p className="text-lg mb-6 text-muted-foreground">
              بنك الوقت هو نظام تبادل الخدمات بين الطلاب بشكل عادل. يمكنك كسب ساعات من خلال تقديم مهاراتك للآخرين، واستخدام هذه الساعات للاستفادة من مهارات زملائك.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                <span>ساعة بساعة: قدّم ساعة من وقتك، واحصل على ساعة من وقت زميلك</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                <span>تبادل المهارات بعدالة تامة بين جميع التخصصات</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                <span>تراكم الساعات في رصيدك لاستخدامها متى احتجت إليها</span>
              </li>
            </ul>
            <Button asChild size="lg">
              <Link to="/timebank">
                استكشف بنك الوقت
                <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <TimeBankCard hoursEarned={6} hoursSpent={3} pendingHours={1} />
          </div>
        </div>
      </div>
    </section>
  );
}
