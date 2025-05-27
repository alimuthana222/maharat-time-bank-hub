
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface ErrorPageProps {
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export function ErrorPage({ 
  message = "حدث خطأ غير متوقع", 
  onRetry,
  showHomeButton = true 
}: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-red-500/10">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl">عذراً، حدث خطأ</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">{message}</p>
          
          <div className="flex flex-col gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                إعادة المحاولة
              </Button>
            )}
            
            {showHomeButton && (
              <Button variant="outline" asChild className="w-full">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  العودة للرئيسية
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage 
          message="حدث خطأ في التطبيق. يرجى إعادة تحميل الصفحة."
          onRetry={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
