
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export async function authenticateUser(token: string): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const token = authHeader.substring(7);
    const user = await authenticateUser(token);
    
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.user = user;
    
    return handler(authenticatedReq);
  };
}
