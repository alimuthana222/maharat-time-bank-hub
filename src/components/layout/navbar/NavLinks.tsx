
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  MessageSquare, 
  Calendar, 
  Search,
  Wallet
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export function NavLinks() {
  const { user } = useAuth();

  return (
    <div className="hidden md:flex items-center space-x-8 space-x-reverse">
      <Button variant="ghost" asChild>
        <Link to="/" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          الرئيسية
        </Link>
      </Button>
      
      {user && (
        <>
          <Button variant="ghost" asChild>
            <Link to="/marketplace" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              السوق
            </Link>
          </Button>
          
          <Button variant="ghost" asChild>
            <Link to="/timebank" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              بنك الوقت
            </Link>
          </Button>
          
          <Button variant="ghost" asChild>
            <Link to="/community" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              المجتمع
            </Link>
          </Button>
          
          <Button variant="ghost" asChild>
            <Link to="/events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              الفعاليات
            </Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link to="/wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              المحفظة
            </Link>
          </Button>
          
          <Button variant="ghost" asChild>
            <Link to="/search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              البحث
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
