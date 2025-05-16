import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  User,
  Send,
  Loader2,
  Clock,
  Check,
  CheckCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface UserProfile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  last_seen?: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface ChatContact {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

export function MessageSystem() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchContacts();
      
      // Set up real-time subscription for new messages
      const channel = supabase
        .channel('messages-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`,
          },
          (payload) => {
            const newMessage = payload.new as Message;
            
            // If we're currently viewing this conversation, add the message and mark as read
            if (selectedChat === newMessage.sender_id) {
              setMessages(prev => [...prev, newMessage]);
              markMessageAsRead(newMessage.id);
              scrollToBottom();
            } else {
              // Otherwise, update the contacts list with new unread count
              setContacts(prev => 
                prev.map(contact => 
                  contact.id === newMessage.sender_id
                    ? {
                        ...contact,
                        last_message: newMessage.content,
                        last_message_time: newMessage.created_at,
                        unread_count: contact.unread_count + 1
                      }
                    : contact
                )
              );
              
              // Show a notification
              toast.info(`رسالة جديدة من ${
                contacts.find(c => c.id === newMessage.sender_id)?.full_name || 
                contacts.find(c => c.id === newMessage.sender_id)?.username || 
                'مستخدم'
              }`);
            }
          }
        )
        .subscribe();
        
      // Cleanup subscription
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, selectedChat]);
  
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
      fetchUserProfile(selectedChat);
    }
  }, [selectedChat]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const fetchContacts = async () => {
    if (!user) return;
    
    setLoadingContacts(true);
    
    try {
      // Get all conversations where user is either sender or receiver
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('receiver_id')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });
        
      if (sentError) throw sentError;
      
      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });
        
      if (receivedError) throw receivedError;
      
      // Combine unique IDs of all users we've chatted with
      const uniqueUserIds = Array.from(new Set([
        ...(sentMessages || []).map(msg => msg.receiver_id),
        ...(receivedMessages || []).map(msg => msg.sender_id)
      ]));
      
      if (uniqueUserIds.length === 0) {
        setLoadingContacts(false);
        return;
      }
      
      // Get profile info for all conversation partners
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', uniqueUserIds);
        
      if (profilesError) throw profilesError;
      
      // Get latest message for each conversation
      const contactsWithMessages = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Get last message
          const { data: lastMessages, error: lastMsgError } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
            .or(`sender_id.eq.${user.id},receiver_id.eq.${profile.id}`)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (lastMsgError) throw lastMsgError;
          
          // Count unread messages
          const { data: unreadCount, error: unreadError } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('sender_id', profile.id)
            .eq('receiver_id', user.id)
            .eq('is_read', false);
            
          if (unreadError) throw unreadError;
          
          return {
            id: profile.id,
            username: profile.username,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            last_message: lastMessages?.[0]?.content,
            last_message_time: lastMessages?.[0]?.created_at,
            unread_count: unreadCount?.length || 0
          };
        })
      );
      
      // Sort contacts by last message time
      const sortedContacts = contactsWithMessages.sort((a, b) => {
        if (!a.last_message_time) return 1;
        if (!b.last_message_time) return -1;
        return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
      });
      
      setContacts(sortedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('حدث خطأ أثناء تحميل جهات الاتصال');
    } finally {
      setLoadingContacts(false);
    }
  };
  
  const fetchMessages = async (contactId: string) => {
    if (!user) return;
    
    setLoadingMessages(true);
    
    try {
      // Get all messages between both users
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark all messages from this contact as read
      const unreadMessages = data?.filter(msg => msg.sender_id === contactId && !msg.is_read) || [];
      
      if (unreadMessages.length > 0) {
        for (const msg of unreadMessages) {
          await markMessageAsRead(msg.id);
        }
        
        // Update contact unread count
        setContacts(contacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, unread_count: 0 } 
            : contact
        ));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('حدث خطأ أثناء تحميل الرسائل');
    } finally {
      setLoadingMessages(false);
    }
  };
  
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, last_seen')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      setSelectedUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  
  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };
  
  const sendMessage = async () => {
    if (!user || !selectedChat || !messageInput.trim()) return;
    
    setSendingMessage(true);
    
    try {
      const newMessage = {
        sender_id: user.id,
        receiver_id: selectedChat,
        content: messageInput.trim(),
        is_read: false
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single();
        
      if (error) throw error;
      
      setMessages([...messages, data]);
      setMessageInput('');
      
      // Update contact's last message in the contact list
      setContacts(contacts.map(contact => 
        contact.id === selectedChat 
          ? {
              ...contact,
              last_message: messageInput.trim(),
              last_message_time: new Date().toISOString()
            } 
          : contact
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('فشل إرسال الرسالة');
    } finally {
      setSendingMessage(false);
    }
  };
  
  const formatMessageTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ar
      });
    } catch (error) {
      return '';
    }
  };
  
  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  if (!user) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>نظام المراسلة</CardTitle>
          <CardDescription>يرجى تسجيل الدخول لاستخدام نظام المراسلة</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-6xl mx-auto h-[calc(100vh-200px)] flex">
      {/* Contacts Sidebar */}
      <div className="w-1/3 border-r h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">المحادثات</CardTitle>
        </CardHeader>
        
        <ScrollArea className="flex-1">
          <div className="px-4 py-2">
            {loadingContacts ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : contacts.length > 0 ? (
              contacts.map(contact => (
                <div 
                  key={contact.id}
                  className={`flex items-center gap-3 p-2 cursor-pointer rounded-lg transition-colors ${
                    selectedChat === contact.id ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedChat(contact.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatar_url || undefined} alt={contact.full_name || contact.username} />
                    <AvatarFallback>{getInitials(contact.full_name || contact.username)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium truncate">
                        {contact.full_name || contact.username}
                      </span>
                      {contact.last_message_time && (
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(contact.last_message_time)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground truncate">
                        {contact.last_message || 'لا توجد رسائل'}
                      </span>
                      {contact.unread_count > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                          {contact.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                لا توجد محادثات بعد
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Chat Area */}
      <div className="w-2/3 flex flex-col h-full">
        {selectedChat ? (
          <>
            <CardHeader className="py-3 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser?.avatar_url || undefined} alt={selectedUser?.full_name || selectedUser?.username} />
                  <AvatarFallback>{getInitials(selectedUser?.full_name || selectedUser?.username)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedUser?.full_name || selectedUser?.username}</CardTitle>
                  <CardDescription>
                    {selectedUser?.last_seen ? `آخر ظهور ${formatMessageTime(selectedUser.last_seen)}` : '@' + selectedUser?.username}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <ScrollArea className="flex-1 p-4">
              {loadingMessages ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isSender = message.sender_id === user.id;
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isSender ? 'bg-primary text-primary-foreground' : 'bg-secondary'} rounded-lg p-3 space-y-1`}>
                          <div>{message.content}</div>
                          <div className="flex items-center justify-end gap-1 text-xs">
                            <span className={isSender ? 'text-primary-foreground/70' : 'text-muted-foreground'}>
                              {formatMessageTime(message.created_at)}
                            </span>
                            {isSender && (
                              message.is_read ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  ابدأ المحادثة بإرسال رسالة
                </div>
              )}
            </ScrollArea>
            
            <CardFooter className="pt-0 pb-3">
              <form 
                className="flex w-full gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={sendingMessage || !messageInput.trim()}>
                  {sendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </CardFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <User className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium">لم يتم اختيار محادثة</h3>
            <p>اختر محادثة من القائمة لعرض الرسائل</p>
          </div>
        )}
      </div>
    </Card>
  );
}
