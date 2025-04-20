
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";

export default function Auth() {
  const { user } = useAuth();
  
  useEffect(() => {
    document.title = "تسجيل الدخول | مهارات";
  }, []);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">منصة مهارات</h1>
            <p className="text-muted-foreground mt-2">
              منصة لتبادل المهارات والخدمات بين طلاب الجامعات
            </p>
          </div>
          
          <LoginForm />
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} مهارات. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}
