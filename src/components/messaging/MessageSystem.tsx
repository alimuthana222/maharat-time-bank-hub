
import React, { useState } from 'react';
import { MessagesList } from './MessagesList';
import { MessageChat } from './MessageChat';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ResponsiveContainer, HideOnMobile, ShowOnMobile } from '@/components/ui/mobile-responsive';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function MessageSystem() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleSelectChat = (participantId: string) => {
    setSelectedChatId(participantId);
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
    setSelectedChatId(null);
  };

  return (
    <ResponsiveContainer>
      <Card className="h-[600px] flex overflow-hidden">
        {/* Desktop Layout */}
        <HideOnMobile>
          <div className="w-80 border-r">
            <MessagesList 
              onSelectChat={handleSelectChat} 
              selectedChatId={selectedChatId || undefined}
            />
          </div>
          <Separator orientation="vertical" />
          <div className="flex-1">
            {selectedChatId ? (
              <MessageChat chatPartnerId={selectedChatId} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p>اختر محادثة لبدء المراسلة</p>
                </div>
              </div>
            )}
          </div>
        </HideOnMobile>

        {/* Mobile Layout */}
        <ShowOnMobile className="w-full">
          {!showChat ? (
            <MessagesList 
              onSelectChat={handleSelectChat}
              selectedChatId={selectedChatId || undefined}
            />
          ) : (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">المحادثات</span>
              </div>
              <div className="flex-1">
                {selectedChatId && <MessageChat chatPartnerId={selectedChatId} />}
              </div>
            </div>
          )}
        </ShowOnMobile>
      </Card>
    </ResponsiveContainer>
  );
}
