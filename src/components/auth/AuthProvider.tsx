
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Role } from "@/types/auth";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isOwner: () => boolean;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  userRoles: Role[];
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<Role[]>([]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, sessionData) => {
        setSession(sessionData);
        setUser(sessionData?.user ?? null);
        
        // Fetch user roles when auth state changes
        if (sessionData?.user) {
          setTimeout(() => {
            fetchUserRoles(sessionData.user.id);
          }, 0);
        } else {
          setUserRoles([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: sessionData } }) => {
      setSession(sessionData);
      setUser(sessionData?.user ?? null);
      
      if (sessionData?.user) {
        fetchUserRoles(sessionData.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching user roles:", error);
        return;
      }

      const roles = data?.map(r => r.role as Role) || [];
      setUserRoles(roles);
    } catch (error) {
      console.error("Error in fetchUserRoles:", error);
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
      
      if (data.session?.user) {
        fetchUserRoles(data.session.user.id);
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  };

  const isOwner = () => {
    return userRoles.includes("owner");
  };

  const isAdmin = () => {
    return userRoles.includes("admin") || isOwner();
  };

  const isModerator = () => {
    return userRoles.includes("moderator") || isAdmin();
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.fullName,
            university: userData.university,
            avatar_url: null,
          },
        },
      });
      
      if (!error && data.user) {
        toast.success("تم إنشاء الحساب بنجاح!");
      }
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserRoles([]);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isOwner,
    isAdmin,
    isModerator,
    userRoles,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
