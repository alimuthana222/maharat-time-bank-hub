
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MessageSquare } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface MessageThread {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away';
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCount: number;
}

interface MessagesListProps {
  onSelectChat: (participantId: string) => void;
  selectedChatId?: string;
}

export function MessagesList({ onSelectChat, selectedChatId }: MessagesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMessageThreads();
  }, [user]);

  const fetchMessageThreads = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Mock data - in real app, fetch from Supabase
      const mockThreads: MessageThread[] = [
        {
          id: '1',
          participant: {
            id: 'user-1',
            name: 'أحمد محمد',
            status: 'online'
          },
          lastMessage: {
            content: 'شكراً لك، سأتواصل معك قريباً',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            isRead: true
          },
          unreadCount: 0
        },
        {
          id: '2',
          participant: {
            id: 'user-2',
            name: 'سارة أحمد',
            status: 'away'
          },
          lastMessage: {
            content: 'هل يمكننا تحديد موعد للجلسة؟',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            isRead: false
          },
          unreadCount: 2
        },
        {
          id: '3',
          participant: {
            id: 'user-3',
            name: 'خالد العمري',
            status: 'offline'
          },
          lastMessage: {
            content: 'ممتاز، أتطلع للعمل معك',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            isRead: true
          },
          unreadCount: 0
        }
      ];

      setThreads(mockThreads);
    } catch (error) {
      console.error('Error fetching message threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredThreads = threads.filter(thread =>
    thread.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
      return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    } else {
      return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">جاري تحميل المحادثات...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في المحادثات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Threads List */}
      <ScrollArea className="flex-1">
        {filteredThreads.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {searchTerm ? 'لم يتم العثور على محادثات' : 'لا توجد محادثات بعد'}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedChatId === thread.participant.id ? 'bg-muted' : ''
                }`}
                onClick={() => onSelectChat(thread.participant.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {thread.participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(thread.participant.status)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">
                        {thread.participant.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(thread.lastMessage.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-sm truncate ${
                        thread.lastMessage.isRead ? 'text-muted-foreground' : 'font-medium'
                      }`}>
                        {thread.lastMessage.content}
                      </p>
                      
                      {thread.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground ml-2">
                          {thread.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
