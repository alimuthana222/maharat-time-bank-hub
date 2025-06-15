
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export function PaymentNotificationBadge() {
  const [pendingCount, setPendingCount] = useState(0);
  const { user, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (isAdmin() || isModerator())) {
      fetchPendingCount();
      // تحديث العدد كل 30 ثانية
      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user, isAdmin, isModerator]);

  const fetchPendingCount = async () => {
    try {
      const { count, error } = await supabase
        .from('charge_transactions')
        .select('*', { count: 'exact', head: true })
        .eq('payment_method', 'zaincash_manual')
        .eq('manual_verification_status', 'pending');

      if (error) throw error;
      setPendingCount(count || 0);
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  };

  const handleNavigateToPayments = () => {
    if (isAdmin()) {
      navigate('/admin');
    } else if (isModerator()) {
      navigate('/moderator');
    }
  };

  if (!user || (!isAdmin() && !isModerator()) || pendingCount === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {pendingCount}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={handleNavigateToPayments} className="cursor-pointer">
          <div className="flex items-center gap-3 w-full">
            <CreditCard className="h-4 w-4 text-orange-500" />
            <div className="flex-1">
              <div className="font-medium">طلبات شحن معلقة</div>
              <div className="text-sm text-muted-foreground">
                {pendingCount} طلب في انتظار المراجعة
              </div>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
