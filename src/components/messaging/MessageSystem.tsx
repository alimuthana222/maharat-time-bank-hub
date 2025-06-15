
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  Send, 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Settings,
  Loader2,
  MessageCircle
} from "lucide-react";

interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message_at: string;
  created_at: string;
  other_user?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
    last_seen?: string;
  };
  last_message?: {
    content: string;
    sender_id: string;
  };
  unread_count?: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  message_type: string;
  file_url?: string;
}

export function MessageSystem() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
      setupRealTimeUpdates();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      markMessagesAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: conversationsData, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order("last_message_at", { ascending: false });

      if (error) throw error;

      if (!conversationsData) {
        setConversations([]);
        return;
      }

      // جلب معلومات المستخدمين الآخرين
      const otherUserIds = conversationsData.map(conv => 
        conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id
      );

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, last_seen")
        .in("id", otherUserIds);

      const profilesMap = profiles?.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>) || {};

      // جلب آخر رسالة لكل محادثة
      const conversationIds = conversationsData.map(conv => conv.id);
      const { data: lastMessages } = await supabase
        .from("new_messages")
        .select("conversation_id, content, sender_id, created_at")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: false });

      const lastMessagesMap = lastMessages?.reduce((acc, message) => {
        if (!acc[message.conversation_id]) {
          acc[message.conversation_id] = message;
        }
        return acc;
      }, {} as Record<string, any>) || {};

      // جلب عدد الرسائل غير المقروءة
      const { data: unreadCounts } = await supabase
        .from("new_messages")
        .select("conversation_id, id")
        .in("conversation_id", conversationIds)
        .eq("is_read", false)
        .neq("sender_id", user.id);

      const unreadCountsMap = unreadCounts?.reduce((acc, message) => {
        acc[message.conversation_id] = (acc[message.conversation_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const conversationsWithDetails = conversationsData.map(conv => {
        const otherUserId = conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id;
        return {
          ...conv,
          other_user: profilesMap[otherUserId],
          last_message: lastMessagesMap[conv.id],
          unread_count: unreadCountsMap[conv.id] || 0
        };
      });

      setConversations(conversationsWithDetails);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("حدث خطأ أثناء تحميل المحادثات");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from("new_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("حدث خطأ أثناء تحميل الرسائل");
    } finally {
      setMessagesLoading(false);
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from("new_messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from("new_messages")
        .insert([{
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: newMessage.trim(),
          message_type: "text"
        }]);

      if (error) throw error;

      setNewMessage("");
      fetchMessages(selectedConversation.id);
      fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("حدث خطأ أثناء إرسال الرسالة");
    }
  };

  const setupRealTimeUpdates = () => {
    if (!user) return;

    const channel = supabase
      .channel("messages-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "new_messages"
        },
        () => {
          fetchConversations();
          if (selectedConversation) {
            fetchMessages(selectedConversation.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredConversations = conversations.filter(conv =>
    !searchQuery || 
    conv.other_user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.other_user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[600px] flex border rounded-lg overflow-hidden bg-background">
      {/* قائمة المحادثات */}
      <div className="w-1/3 border-r bg-muted/20">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في المحادثات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(600px-80px)]">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>لا توجد محادثات</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedConversation?.id === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.other_user?.avatar_url} />
                        <AvatarFallback>
                          {conversation.other_user?.full_name?.charAt(0) || 
                           conversation.other_user?.username?.charAt(0) || "؟"}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.other_user?.last_seen && 
                       new Date(conversation.other_user.last_seen).getTime() > Date.now() - 5 * 60 * 1000 && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">
                          {conversation.other_user?.full_name || conversation.other_user?.username}
                        </h4>
                        {conversation.unread_count && conversation.unread_count > 0 && (
                          <Badge variant="destructive" className="text-xs h-5 w-5 p-0 flex items-center justify-center">
                            {conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                      
                      {conversation.last_message && (
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.last_message.sender_id === user?.id ? "أنت: " : ""}
                          {conversation.last_message.content}
                        </p>
                      )}
                      
                      {conversation.last_message_at && (
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.last_message_at), {
                            addSuffix: true,
                            locale: ar,
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* منطقة المحادثة */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* رأس المحادثة */}
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.other_user?.avatar_url} />
                    <AvatarFallback>
                      {selectedConversation.other_user?.full_name?.charAt(0) || 
                       selectedConversation.other_user?.username?.charAt(0) || "؟"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {selectedConversation.other_user?.full_name || selectedConversation.other_user?.username}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.other_user?.last_seen && 
                       new Date(selectedConversation.other_user.last_seen).getTime() > Date.now() - 5 * 60 * 1000
                        ? "متصل الآن"
                        : selectedConversation.other_user?.last_seen
                        ? `آخر ظهور ${formatDistanceToNow(new Date(selectedConversation.other_user.last_seen), { addSuffix: true, locale: ar })}`
                        : "غير متصل"
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* الرسائل */}
            <ScrollArea className="flex-1 p-4">
              {messagesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>لا توجد رسائل بعد. ابدأ المحادثة!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isOwnMessage = message.sender_id === user?.id;
                    const showAvatar = index === 0 || 
                      messages[index - 1].sender_id !== message.sender_id;

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        {!isOwnMessage && showAvatar && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={selectedConversation.other_user?.avatar_url} />
                            <AvatarFallback>
                              {selectedConversation.other_user?.full_name?.charAt(0) || "؟"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        {!isOwnMessage && !showAvatar && (
                          <div className="w-8"></div>
                        )}

                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isOwnMessage
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}>
                            {formatDistanceToNow(new Date(message.created_at), {
                              addSuffix: true,
                              locale: ar,
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* إرسال الرسائل */}
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder="اكتب رسالة..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold mb-2">مرحباً بك في الرسائل</p>
              <p>اختر محادثة لبدء المراسلة</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
