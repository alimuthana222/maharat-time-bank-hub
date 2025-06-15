
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { ConversationHeader } from "./ConversationHeader";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    username: string;
    avatar_url?: string;
  };
}

interface MessageThreadProps {
  conversationId: string;
  participant: {
    username: string;
    full_name?: string;
    avatar_url?: string;
  } | null;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function MessageThread({ conversationId, participant, onBack, showBackButton }: MessageThreadProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("new_messages")
        .select(`
          id,
          content,
          sender_id,
          created_at
        `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data) {
        const messagesWithSenders = await Promise.all(
          data.map(async (msg) => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", msg.sender_id)
              .single();

            return {
              ...msg,
              sender: profile ? {
                username: profile.username,
                avatar_url: profile.avatar_url
              } : undefined
            };
          })
        );

        setMessages(messagesWithSenders);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("خطأ في تحميل الرسائل");
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "new_messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          const newMsg = payload.new as any;
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", newMsg.sender_id)
            .single();

          setMessages(prev => [...prev, {
            ...newMsg,
            sender: profile ? {
              username: profile.username,
              avatar_url: profile.avatar_url
            } : undefined
          }]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSendMessage = async (content: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("new_messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("فشل في إرسال الرسالة");
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">جاري تحميل الرسائل...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader 
        participant={participant}
        onBack={onBack}
        showBackButton={showBackButton}
      />
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">لا توجد رسائل بعد. ابدأ المحادثة!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwnMessage={msg.sender_id === user?.id}
            />
          ))
        )}
      </ScrollArea>
      
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
