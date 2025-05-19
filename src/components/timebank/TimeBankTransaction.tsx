
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import { timeAgo } from "@/lib/date-utils";
import { toast } from "sonner";

export interface TimeBankTransactionUser {
  name: string;
  avatarUrl?: string;
}

export interface TimeBankTransactionProps {
  transaction: {
    id: string;
    providerId: string;
    recipientId: string;
    hours: number;
    status: "pending" | "completed" | "rejected" | "canceled";
    createdAt: string;
    description: string;
    provider: TimeBankTransactionUser;
    recipient: TimeBankTransactionUser;
  };
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
}

export function TimeBankTransaction({ 
  transaction,
  onApprove,
  onReject,
  showActions = true
}: TimeBankTransactionProps) {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Define status badge properties
  const statusBadge = {
    pending: { label: "قيد الانتظار", color: "bg-amber-500/10 text-amber-600 border-amber-200" },
    completed: { label: "مكتمل", color: "bg-green-500/10 text-green-600 border-green-200" },
    rejected: { label: "مرفوض", color: "bg-red-500/10 text-red-600 border-red-200" },
    canceled: { label: "ملغي", color: "bg-gray-500/10 text-gray-600 border-gray-200" },
  };
  
  const handleApprove = () => {
    if (onApprove) {
      onApprove(transaction.id);
    } else {
      // Demo functionality
      toast.success("تم قبول المعاملة بنجاح");
    }
  };
  
  const handleReject = () => {
    if (onReject) {
      onReject(transaction.id);
    } else {
      // Demo functionality
      toast.success("تم رفض المعاملة");
    }
  };

  return (
    <div className="py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center -space-x-2 space-x-reverse">
            <Avatar className="border-2 border-background">
              <AvatarImage src={transaction.provider.avatarUrl} alt={transaction.provider.name} />
              <AvatarFallback>{getInitials(transaction.provider.name)}</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-background">
              <AvatarImage src={transaction.recipient.avatarUrl} alt={transaction.recipient.name} />
              <AvatarFallback>{getInitials(transaction.recipient.name)}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-medium">{transaction.provider.name}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mx-1" />
              <span className="font-medium">{transaction.recipient.name}</span>
              <Badge variant="outline" className={statusBadge[transaction.status].color}>
                {statusBadge[transaction.status].label}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">{transaction.description}</p>
            
            <div className="flex items-center text-sm">
              <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{timeAgo(transaction.createdAt)}</span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="font-medium text-primary">{transaction.hours} ساعة</span>
            </div>
          </div>
        </div>
        
        {showActions && transaction.status === "pending" && (
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button size="sm" variant="outline" className="h-8 px-3" onClick={handleApprove}>
              <CheckCircle className="mr-1 h-3.5 w-3.5" />
              قبول
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3" onClick={handleReject}>
              <XCircle className="mr-1 h-3.5 w-3.5" />
              رفض
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
