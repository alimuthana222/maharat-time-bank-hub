
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message_at: string;
  other_participant?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function useMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      if (conversationsData) {
        const conversationsWithProfiles = await Promise.all(
          conversationsData.map(async (conv) => {
            const otherParticipantId = conv.participant1_id === user.id 
              ? conv.participant2_id 
              : conv.participant1_id;

            const { data: profile } = await supabase
              .from('profiles')
              .select('username, full_name, avatar_url')
              .eq('id', otherParticipantId)
              .single();

            return {
              ...conv,
              other_participant: profile
            };
          })
        );

        setConversations(conversationsWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('خطأ في تحميل المحادثات');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('new_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('خطأ في تحميل الرسائل');
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('new_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content
        });

      if (error) throw error;

      // تحديث وقت آخر رسالة في المحادثة
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('خطأ في إرسال الرسالة');
      return false;
    }
  };

  const createConversation = async (participantId: string) => {
    if (!user) return null;

    try {
      // التحقق من وجود محادثة موجودة
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${participantId}),and(participant1_id.eq.${participantId},participant2_id.eq.${user.id})`)
        .single();

      if (existingConv) {
        return existingConv.id;
      }

      // إنشاء محادثة جديدة
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant1_id: user.id,
          participant2_id: participantId
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('خطأ في إنشاء المحادثة');
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  return {
    conversations,
    messages,
    loading,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation
  };
}
