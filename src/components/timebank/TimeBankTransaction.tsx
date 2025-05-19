
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { CheckCircle, Clock, XCircle } from "lucide-react";

// Define the status types
export type TimeBankTransactionStatus = "pending" | "approved" | "rejected" | "completed" | "canceled";

// Define the user type for provider and recipient
export interface TimeBankTransactionUser {
  name: string;
  avatarUrl: string;
  university?: string;
}

// Define the transaction props interface
export interface TimeBankTransactionProps {
  id: string;
  providerId: string;
  recipientId: string;
  hours: number;
  status: TimeBankTransactionStatus;
  createdAt: string;
  description: string;
  provider: TimeBankTransactionUser;
  recipient: TimeBankTransactionUser;
}

interface TransactionProps {
  transaction: any;
  currentUserId?: string;
  onStatusChange?: () => void;
}

export function TimeBankTransaction({
  transaction,
  currentUserId,
  onStatusChange,
}: TransactionProps) {
  // Map from backend status to display status if needed
  const mapStatus = (status: string): TimeBankTransactionStatus => {
    if (["pending", "approved", "rejected", "completed", "canceled"].includes(status)) {
      return status as TimeBankTransactionStatus;
    }
    return "pending"; // Default fallback
  };

  const status = mapStatus(transaction.status);
  
  // Format date appropriately
  const formattedDate = transaction.created_at 
    ? formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true, locale: ar })
    : transaction.createdAt 
      ? formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true, locale: ar })
      : "غير معروف";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-amber-500";
      case "rejected":
      case "canceled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "تمت الموافقة";
      case "completed":
        return "مكتمل";
      case "pending":
        return "قيد الانتظار";
      case "rejected":
        return "مرفوض";
      case "canceled":
        return "ملغي";
      default:
        return "غير معروف";
    }
  };

  // Get provider and recipient information
  const provider = transaction.provider || {
    name: transaction.provider_name || "غير معروف",
    avatarUrl: transaction.provider_avatar || "https://i.pravatar.cc/150?u=" + transaction.provider_id,
  };

  const recipient = transaction.recipient || {
    name: transaction.recipient_name || "غير معروف",
    avatarUrl: transaction.recipient_avatar || "https://i.pravatar.cc/150?u=" + transaction.recipient_id,
  };

  // Check if the current user is the recipient of this transaction
  const isRecipient = currentUserId && (currentUserId === transaction.recipient_id || currentUserId === transaction.recipientId);
  const isPending = status === "pending";

  const handleApprove = () => {
    // In a real app, this would update in the database
    console.log("Approving transaction:", transaction.id);
    if (onStatusChange) onStatusChange();
  };

  const handleReject = () => {
    // In a real app, this would update in the database
    console.log("Rejecting transaction:", transaction.id);
    if (onStatusChange) onStatusChange();
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={provider.avatarUrl} alt={provider.name} />
              <AvatarFallback>{provider.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{provider.name}</div>
              <div className="text-sm text-muted-foreground mb-2">
                {transaction.description || transaction.description}
              </div>
              <div className="flex flex-wrap gap-2 items-center text-xs">
                <Badge variant="outline" className="font-normal">
                  {transaction.hours || transaction.hours} ساعة
                </Badge>
                <Badge
                  className={`${getStatusColor(status)} text-white`}
                >
                  {getStatusText(status)}
                </Badge>
                <span className="text-muted-foreground">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground text-left">
                المستلم: {recipient.name}
              </div>
              <Avatar className="h-6 w-6">
                <AvatarImage src={recipient.avatarUrl} alt={recipient.name} />
                <AvatarFallback>{recipient.name?.[0]}</AvatarFallback>
              </Avatar>
            </div>

            {isRecipient && isPending && (
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                  onClick={handleReject}
                >
                  <XCircle className="mr-1 h-4 w-4" />
                  رفض
                </Button>
                <Button
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                  onClick={handleApprove}
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  موافقة
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
