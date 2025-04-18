
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: object) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isOwner: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Defer data fetching to avoid Supabase auth deadlock
        if (session?.user) {
          setTimeout(() => {
            console.log("Auth state changed, user is logged in", session.user);
          }, 0);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدخول");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: object) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;
      
      toast.success("تم إنشاء الحساب بنجاح، يرجى تأكيد البريد الإلكتروني");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/");
      toast.success("تم تسجيل الخروج بنجاح");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تسجيل الخروج");
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = () => {
    return user?.user_metadata?.role === "admin";
  };

  const isOwner = () => {
    return user?.user_metadata?.role === "owner";
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      signIn, 
      signUp, 
      signOut, 
      isAdmin, 
      isOwner 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
