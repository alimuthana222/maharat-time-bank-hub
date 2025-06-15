
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, CheckCircle, Phone } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isRecommended?: boolean;
  isEnabled: boolean;
}

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (methodId: string) => void;
}

export function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  const paymentMethods: PaymentMethod[] = [
    {
      id: "wallet",
      name: "المحفظة الداخلية",
      icon: <Wallet className="h-5 w-5" />,
      description: "ادفع مباشرة من رصيد المحفظة",
      isRecommended: true,
      isEnabled: true
    },
    {
      id: "zaincash_manual", 
      name: "ZainCash",
      icon: <Phone className="h-5 w-5" />,
      description: "الدفع عبر ZainCash مع التحقق اليدوي",
      isEnabled: true
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">طرق الدفع المتاحة</h3>
      
      {paymentMethods.map((method) => (
        <Card 
          key={method.id}
          className={`cursor-pointer transition-all ${
            selectedMethod === method.id 
              ? "ring-2 ring-blue-500 bg-blue-50" 
              : "hover:bg-gray-50"
          } ${!method.isEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => method.isEnabled && onMethodChange(method.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  selectedMethod === method.id ? "bg-blue-100" : "bg-gray-100"
                }`}>
                  {method.icon}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{method.name}</h4>
                    {method.isRecommended && (
                      <Badge variant="secondary" className="text-xs">
                        موصى به
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </div>
              
              {selectedMethod === method.id && (
                <CheckCircle className="h-5 w-5 text-blue-600" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
