
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { UserProfileSetup } from "./UserProfileSetup";
import { WelcomeFlow } from "./WelcomeFlow";

type OnboardingStep = "profile" | "welcome" | "complete";

export function UserOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("profile");

  const steps = [
    { id: "profile", title: "إعداد الملف الشخصي", progress: 33 },
    { id: "welcome", title: "مرحباً بك", progress: 66 },
    { id: "complete", title: "اكتمال", progress: 100 },
  ];

  const currentStepData = steps.find(step => step.id === currentStep);

  const handleNext = () => {
    if (currentStep === "profile") {
      setCurrentStep("welcome");
    } else if (currentStep === "welcome") {
      setCurrentStep("complete");
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep === "welcome") {
      setCurrentStep("profile");
    } else if (currentStep === "complete") {
      setCurrentStep("welcome");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "profile":
        return <UserProfileSetup />;
      case "welcome":
        return <WelcomeFlow />;
      case "complete":
        return (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">مرحباً بك في منصة مهارات!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                تم إعداد حسابك بنجاح. يمكنك الآن البدء في استكشاف المنصة والاستفادة من جميع الميزات المتاحة.
              </p>
              <Button onClick={() => navigate("/dashboard")} className="w-full">
                ابدأ الاستكشاف
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">إعداد الحساب</h1>
              <span className="text-sm text-muted-foreground">
                الخطوة {steps.findIndex(s => s.id === currentStep) + 1} من {steps.length}
              </span>
            </div>
            <Progress value={currentStepData?.progress || 0} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {currentStepData?.title}
            </p>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation */}
          {currentStep !== "complete" && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === "profile"}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                السابق
              </Button>
              <Button onClick={handleNext}>
                التالي
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
