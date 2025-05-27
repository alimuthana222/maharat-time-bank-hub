
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function NewAuth() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <AuthLayout
      title="تسجيل الدخول"
      subtitle="أدخل بياناتك للوصول إلى حسابك"
    >
      <LoginForm />
    </AuthLayout>
  );
}
