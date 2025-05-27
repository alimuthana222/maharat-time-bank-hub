
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function NewRegister() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <AuthLayout
      title="إنشاء حساب جديد"
      subtitle="انضم إلى منصة مهارات وابدأ رحلتك"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
