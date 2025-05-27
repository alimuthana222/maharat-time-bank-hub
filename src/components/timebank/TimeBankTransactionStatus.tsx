
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface TimeBankTransactionStatusProps {
  transactionId: string;
  status: "pending" | "approved" | "rejected";
  isRecipient: boolean;
  onStatusUpdate: () => void;
}

export function TimeBankTransactionStatus({
  transactionId,
  status,
  isRecipient,
  onStatusUpdate,
}: TimeBankTransactionStatusProps) {
  const handleStatusUpdate = async (newStatus: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("time_bank_transactions")
        .update({ status: newStatus })
        .eq("id", transactionId);

      if (error) throw error;

      toast.success(`تم ${newStatus === "approved" ? "قبول" : "رفض"} المعاملة`);
      onStatusUpdate();
    } catch (error: any) {
      toast.error(`حدث خطأ: ${error.message}`);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "approved":
        return "تمت الموافقة";
      case "rejected":
        return "مرفوض";
      default:
        return "قيد الانتظار";
    }
  };

  const getStatusVariant = () => {
    switch (status) {
      case "approved":
        return "default" as const;
      case "rejected":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusVariant()} className="flex items-center gap-1">
        {getStatusIcon()}
        {getStatusText()}
      </Badge>
      
      {isRecipient && status === "pending" && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusUpdate("rejected")}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            رفض
          </Button>
          <Button
            size="sm"
            onClick={() => handleStatusUpdate("approved")}
            className="bg-green-600 hover:bg-green-700"
          >
            قبول
          </Button>
        </div>
      )}
    </div>
  );
}
