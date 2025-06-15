
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface PaymentStatusIndicatorProps {
  status: string;
  size?: "sm" | "default" | "lg";
}

export function PaymentStatusIndicator({ status, size = "default" }: PaymentStatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          text: 'مكتمل',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'قيد الانتظار',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'failed':
        return {
          icon: XCircle,
          text: 'فشل',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'cancelled':
        return {
          icon: AlertCircle,
          text: 'ملغي',
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      default:
        return {
          icon: Clock,
          text: status,
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <Badge variant={config.variant} className={`${config.className} flex items-center gap-1`}>
      <IconComponent className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {config.text}
    </Badge>
  );
}
