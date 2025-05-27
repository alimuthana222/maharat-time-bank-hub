
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAuth } from '@/components/auth/AuthProvider';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface MessageChatProps {
  chatPartnerId: string;
}

export function MessageChat({ chatPartnerId }: MessageChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [chatPartner, setChatPartner] = useState<any>(null);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatData();
  }, [chatPartnerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatData = async () => {
    setIsLoading(true);
    try {
      // Mock chat partner data
      const partnerData = {
        id: chatPartnerId,
        name: chatPartnerId === 'user-1' ? 'أحمد محمد' : 
              chatPartnerId === 'user-2' ? 'سارة أحمد' : 'خالد العمري',
        avatar: `https://i.pravatar.cc/150?u=${chatPartnerId}`,
        status: 'online',
        lastSeen: new Date().toISOString()
      };

      // Mock messages
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: chatPartnerId,
          content: 'السلام عليكم، كيف حالك؟',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          isRead: true
        },
        {
          id: '2',
          senderId: user?.id || 'current-user',
          content: 'وعليكم السلام، بخير والحمد لله',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          isRead: true
        },
        {
          id: '3',
          senderId: chatPartnerId,
          content: 'ممتاز، هل يمكننا مناقشة تفاصيل المشروع؟',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          isRead: true
        },
        {
          id: '4',
          senderId: user?.id || 'current-user',
          content: 'بالطبع، أنا متاح الآن للمناقشة',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          isRead: true
        }
      ];

      setChatPartner(partnerData);
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || 'current-user',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, messageToSend]);
    setNewMessage('');

    // Simulate partner response after a delay
    setTimeout(() => {
      const responses = [
        'شكراً لك على الرسالة',
        'أفهم ما تقصده',
        'ممتاز، سأعمل على ذلك',
        'هل يمكنك توضيح أكثر؟',
        'سأرسل لك التفاصيل قريباً'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const partnerMessage = {
        id: `msg-${Date.now()}-partner`,
        senderId: chatPartnerId,
        content: randomResponse,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      setMessages(prev => [...prev, partnerMessage]);
    }, 1000 + Math.random() * 2000);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'الآن';
    } else if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else {
      return formatDistanceToNow(date, { addSuffix: true, locale: ar });
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">جاري تحميل المحادثة...</p>
      </div>
    );
  }

  if (!chatPartner) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">حدث خطأ في تحميل المحادثة</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chatPartner.avatar} alt={chatPartner.name} />
            <AvatarFallback>{chatPartner.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{chatPartner.name}</h3>
            <p className="text-xs text-muted-foreground">
              {chatPartner.status === 'online' ? 'متصل الآن' : 'غير متصل'}
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

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.senderId === (user?.id || 'current-user');
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    isOwnMessage
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {formatMessageTime(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالة..."
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
