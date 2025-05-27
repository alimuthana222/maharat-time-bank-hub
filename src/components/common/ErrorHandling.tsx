
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: "default" | "destructive";
  showIcon?: boolean;
}

export function ErrorMessage({ 
  title = "حدث خطأ", 
  message, 
  variant = "destructive",
  showIcon = true 
}: ErrorMessageProps) {
  return (
    <Alert variant={variant}>
      {showIcon && <AlertTriangle className="h-4 w-4" />}
      <AlertDescription>
        {title && <div className="font-medium mb-1">{title}</div>}
        {message}
      </AlertDescription>
    </Alert>
  );
}

interface ErrorPageProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
}

export function ErrorPage({ 
  title = "حدث خطأ غير متوقع",
  message = "عذراً، حدث خطأ أثناء تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.",
  showRetry = true,
  showHome = true,
  onRetry 
}: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {showRetry && onRetry && (
            <Button onClick={onRetry} className="w-full" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              إعادة المحاولة
            </Button>
          )}
          {showHome && (
            <Button onClick={() => navigate("/")} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              العودة للرئيسية
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface NotFoundProps {
  title?: string;
  message?: string;
  showBack?: boolean;
}

export function NotFound({ 
  title = "الصفحة غير موجودة",
  message = "عذراً، الصفحة التي تبحث عنها غير موجودة.",
  showBack = true 
}: NotFoundProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold text-muted-foreground mb-4">404</CardTitle>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {showBack && (
            <Button onClick={() => navigate(-1)} className="w-full" variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة
            </Button>
          )}
          <Button onClick={() => navigate("/")} className="w-full">
            <Home className="h-4 w-4 mr-2" />
            الصفحة الرئيسية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface NetworkErrorProps {
  onRetry?: () => void;
}

export function NetworkError({ onRetry }: NetworkErrorProps) {
  return (
    <ErrorMessage
      title="مشكلة في الاتصال"
      message="تحقق من اتصالك بالإنترنت وحاول مرة أخرى"
      variant="destructive"
    />
  );
}

interface AccessDeniedProps {
  message?: string;
}

export function AccessDenied({ 
  message = "ليس لديك صلاحية للوصول إلى هذه الصفحة" 
}: AccessDeniedProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">ممنوع الدخول</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate("/")} className="w-full">
            <Home className="h-4 w-4 mr-2" />
            العودة للرئيسية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface FormErrorProps {
  errors: Record<string, string[]>;
}

export function FormError({ errors }: FormErrorProps) {
  const errorMessages = Object.values(errors).flat();
  
  if (errorMessages.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1">
          {errorMessages.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
