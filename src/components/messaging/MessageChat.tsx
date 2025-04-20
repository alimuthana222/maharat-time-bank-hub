
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, PaperclipIcon, Smile, MoreVertical, Phone, Video } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  read: boolean;
}

interface ChatPartner {
  id: string;
  name: string;
  avatar_url?: string;
  avatarFallback: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

interface MessageChatProps {
  chatPartnerId: string;
}

export function MessageChat({ chatPartnerId }: MessageChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch chat partner details
  useEffect(() => {
    const fetchChatPartner = async () => {
      if (!chatPartnerId) return;
      
      try {
        // Simulating API call
        setTimeout(() => {
          setChatPartner({
            id: chatPartnerId,
            name: 'أحمد محمد',
            avatarFallback: 'أم',
            status: 'online'
          });
        }, 500);
      } catch (error) {
        console.error('Error fetching chat partner:', error);
        setChatPartner({
          id: chatPartnerId,
          name: 'أحمد محمد',
          avatarFallback: 'أم',
          status: 'online'
        });
      }
    };
    
    fetchChatPartner();
  }, [chatPartnerId]);
  
  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !chatPartnerId) return;
      
      setIsLoading(true);
      try {
        // For demo purposes, we're adding mock messages
        const mockMessages: Message[] = [
          {
            id: '1',
            content: 'مرحباً، كيف يمكنني مساعدتك؟',
            sender_id: chatPartnerId,
            recipient_id: user.id,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            read: true
          },
          {
            id: '2',
            content: 'أنا مهتم بالدروس الخصوصية في الرياضيات',
            sender_id: user.id,
            recipient_id: chatPartnerId,
            created_at: new Date(Date.now() - 3500000).toISOString(),
            read: true
          },
          {
            id: '3',
            content: 'رائع! أنا متخصص في الرياضيات ويمكنني مساعدتك',
            sender_id: chatPartnerId,
            recipient_id: user.id,
            created_at: new Date(Date.now() - 3400000).toISOString(),
            read: true
          },
          {
            id: '4',
            content: 'هل يمكننا تحديد موعد للجلسة الأولى؟',
            sender_id: user.id,
            recipient_id: chatPartnerId,
            created_at: new Date(Date.now() - 3300000).toISOString(),
            read: true
          }
        ];
        
        setMessages(mockMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [user, chatPartnerId]);
  
  // Set up real-time messaging simulation
  useEffect(() => {
    if (!user || !chatPartnerId) return;
    
    // Simulate a real-time connection
    const interval = setInterval(() => {
      // Simulate occasional new message (every 30 seconds)
      if (Math.random() > 0.7) {
        const newMessage: Message = {
          id: `auto-${Date.now()}`,
          content: 'هل أنت متواجد؟ أود مناقشة التفاصيل.',
          sender_id: chatPartnerId,
          recipient_id: user.id,
          created_at: new Date().toISOString(),
          read: false
        };
        setMessages(prev => [...prev, newMessage]);
      }
    }, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [user, chatPartnerId]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || !chatPartnerId) return;
    
    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      content: inputMessage,
      sender_id: user.id,
      recipient_id: chatPartnerId,
      created_at: new Date().toISOString(),
      read: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simulate message confirmation
    setTimeout(() => {
      toast.success("تم إرسال الرسالة");
      
      // Simulate reply after some time
      if (Math.random() > 0.5) {
        setTimeout(() => {
          const replyMessage: Message = {
            id: `reply-${Date.now()}`,
            content: 'شكراً لرسالتك، سأرد عليك قريباً.',
            sender_id: chatPartnerId,
            recipient_id: user.id,
            created_at: new Date().toISOString(),
            read: false
          };
          setMessages(prev => [...prev, replyMessage]);
        }, 5000 + Math.random() * 10000); // Reply between 5-15 seconds
      }
    }, 1000);
  };
  
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };
  
  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden">
      {/* Chat header */}
      <div className="p-4 border-b bg-card flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{chatPartner?.avatarFallback || ''}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{chatPartner?.name || 'جاري التحميل...'}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {chatPartner?.status === 'online' ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span>متصل الآن</span>
                </>
              ) : (
                'غير متصل'
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center">
              <p className="text-sm text-muted-foreground">جاري تحميل الرسائل...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center">
              <p className="text-sm text-muted-foreground">لا توجد رسائل بعد. ابدأ المحادثة!</p>
            </div>
          ) : (
            messages.map(message => (
              <div 
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender_id === user?.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <p>{message.content}</p>
                  <div 
                    className={`text-xs mt-1 ${
                      message.sender_id === user?.id 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    {formatMessageTime(message.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
      
      {/* Chat input */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          <Input 
            placeholder="اكتب رسالتك هنا..." 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-grow"
          />
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Button onClick={sendMessage} disabled={!inputMessage.trim()}>
            <Send className="h-4 w-4 mr-2" />
            إرسال
          </Button>
        </div>
      </div>
    </div>
  );
}
