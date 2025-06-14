
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Clock, Calendar, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-20 lg:py-28">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            منصة تبادل المهارات
            <span className="text-blue-600 block">للطلاب العراقيين</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            انضم إلى أكبر مجتمع لتبادل المهارات والمعرفة بين طلاب الجامعات العراقية. 
            شارك خبراتك، تعلم مهارات جديدة، وابني شبكة علاقات مهنية قوية.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/auth">
              <Button size="lg" className="px-8 py-4 text-lg">
                ابدأ رحلتك الآن
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/community">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                استكشف المجتمع
              </Button>
            </Link>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-white shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">بنك الوقت</h3>
              <p className="text-gray-600 text-sm">
                تبادل الساعات مع زملائك الطلاب لتعلم مهارات جديدة
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">سوق المهارات</h3>
              <p className="text-gray-600 text-sm">
                اعرض مهاراتك واحصل على خدمات من طلاب آخرين
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">الفعاليات</h3>
              <p className="text-gray-600 text-sm">
                احضر ونظم فعاليات تعليمية ومهنية في جامعتك
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white shadow-sm border">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">المجتمع</h3>
              <p className="text-gray-600 text-sm">
                تواصل وتفاعل مع طلاب من جميع الجامعات العراقية
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-20 h-20 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-20 h-20 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}
