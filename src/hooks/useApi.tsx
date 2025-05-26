
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const {
    showErrorToast = true,
    showSuccessToast = false,
    successMessage = "تمت العملية بنجاح"
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (
    apiCall: () => Promise<{ data: T | null; error: any }>
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await apiCall();

      if (error) {
        const errorMessage = error.message || "حدث خطأ غير متوقع";
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: errorMessage,
          data: null 
        }));
        
        if (showErrorToast) {
          toast.error(errorMessage);
        }
        
        return { data: null, error };
      }

      setState(prev => ({ 
        ...prev, 
        loading: false, 
        data,
        error: null 
      }));

      if (showSuccessToast) {
        toast.success(successMessage);
      }

      return { data, error: null };
    } catch (err) {
      const errorMessage = "حدث خطأ في الاتصال";
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        data: null 
      }));
      
      if (showErrorToast) {
        toast.error(errorMessage);
      }
      
      console.error('API Error:', err);
      return { data: null, error: err };
    }
  }, [showErrorToast, showSuccessToast, successMessage]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}

export default useApi;
