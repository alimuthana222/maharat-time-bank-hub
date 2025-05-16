
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  CalendarClock,
  ArrowRight,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface Transaction {
  id: string;
  provider_id: string;
  recipient_id: string;
  hours: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  provider_name?: string;
  recipient_name?: string;
}

interface TimeBankTransactionProps {
  transaction: Transaction;
  currentUserId: string;
  onStatusChange?: () => void;
}

export function TimeBankTransaction({
  transaction,
  currentUserId,
  onStatusChange,
}: TimeBankTransactionProps) {
  const [processing, setProcessing] = React.useState(false);
  const { isAdmin, isModerator } = useAuth();

  const isProvider = transaction.provider_id === currentUserId;
  const isRecipient = transaction.recipient_id === currentUserId;
  const canApprove = isRecipient || isAdmin() || isModerator();
  const isPending = transaction.status === "pending";

  const handleStatusChange = async (status: "approved" | "rejected") => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("time_bank_transactions")
        .update({ status })
        .eq("id", transaction.id);

      if (error) throw error;

      toast.success(
        `تم ${
          status === "approved" ? "قبول" : "رفض"
        } المعاملة بنجاح`
      );

      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة المعاملة");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            في انتظار الموافقة
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            تمت الموافقة
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            تم الرفض
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ar,
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className={isPending ? "border-yellow-300 shadow-sm" : ""}>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {isProvider ? (
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-1" />
                  <span>أنت</span>
                  <ArrowRight className="h-4 w-4 mx-1" />
                  <span>{transaction.recipient_name}</span>
                </div>
              ) : (
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-1" />
                  <span>{transaction.provider_name}</span>
                  <ArrowLeft className="h-4 w-4 mx-1" />
                  <span>أنت</span>
                </div>
              )}
            </div>
            {getStatusBadge(transaction.status)}
          </div>

          <p className="text-lg font-semibold">
            {transaction.hours} {transaction.hours === 1 ? "ساعة" : "ساعات"}
          </p>

          <p className="text-sm">{transaction.description}</p>

          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarClock className="h-3 w-3 mr-1" />
            <span>{formatDate(transaction.created_at)}</span>
          </div>
        </div>
      </CardContent>
      {isPending && canApprove && (
        <CardFooter className="flex justify-end gap-2 p-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            disabled={processing}
            onClick={() => handleStatusChange("rejected")}
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
            رفض
          </Button>
          <Button
            size="sm"
            disabled={processing}
            onClick={() => handleStatusChange("approved")}
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
            قبول
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
