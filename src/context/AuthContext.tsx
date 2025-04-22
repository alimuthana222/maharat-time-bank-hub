
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Role } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: object) => Promise<void>;
  signOut: () => Promise<void>;
  setUserRole: (role: Role) => Promise<void>;
  checkUserRole: (role: Role) => Promise<boolean>;
  isAdmin: () => boolean;
  isOwner: () => boolean;
  isModerator: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user roles when session changes
        if (session?.user) {
          fetchUserRoles(session.user.id);
        } else {
          setUserRoles([]);
        }
        
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Fetch user roles on initial load
      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error fetching user roles:', error);
        return;
      }
      
      if (data) {
        setUserRoles(data.map(item => item.role as Role));
      }
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
    }
  };

  const checkUserRole = async (role: Role): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', role)
        .single();

      return !error && !!data;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  };

  const isAdmin = () => {
    return userRoles.includes('admin') || userRoles.includes('owner');
  };

  const isOwner = () => {
    return userRoles.includes('owner');
  };

  const isModerator = () => {
    return userRoles.includes('moderator') || userRoles.includes('admin') || userRoles.includes('owner');
  };

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
      
      setUserRoles([]);
      navigate("/");
      toast.success("تم تسجيل الخروج بنجاح");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تسجيل الخروج");
    } finally {
      setIsLoading(false);
    }
  };

  const setUserRole = async (role: Role) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: role });
      
      if (error) throw error;
      
      // Update local state
      setUserRoles(prev => [...prev, role]);
      toast.success(`تم تعيين دورك كـ ${role} بنجاح`);
    } catch (error: any) {
      toast.error(`فشل تحديث الدور: ${error.message}`);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      signIn, 
      signUp, 
      signOut, 
      setUserRole,
      checkUserRole,
      isAdmin,
      isOwner,
      isModerator
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
