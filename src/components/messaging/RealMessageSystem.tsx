
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useMessages } from "@/hooks/useMessages";
import { Card } from "@/components/ui/card";
import { ConversationItem } from "./ConversationItem";
import { MessageThread } from "./MessageThread";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RealMessageSystem() {
  const { user } = useAuth();
  const { conversations, loading, fetchConversations } = useMessages();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversationId(conversation.id);
    setSelectedParticipant(conversation.other_participant);
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
    setSelectedConversationId(null);
    setSelectedParticipant(null);
  };

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">يرجى تسجيل الدخول لعرض الرسائل</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">جاري تحميل المحادثات...</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px] border rounded-lg overflow-hidden">
      {/* قائمة المحادثات - مخفية على الموبايل عند عرض المحادثة */}
      <div className={`border-r bg-white ${showChat ? 'hidden lg:block' : 'block'}`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">المحادثات</h3>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              محادثة جديدة
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[550px]">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد محادثات بعد</p>
              <p className="text-sm text-gray-500 mt-2">
                ابدأ محادثة مع مقدمي الخدمات من السوق
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedConversationId === conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* منطقة المحادثة - تظهر على الموبايل فقط عند اختيار محادثة */}
      <div className={`col-span-2 bg-gray-50 ${showChat ? 'block' : 'hidden lg:flex lg:items-center lg:justify-center'}`}>
        {selectedConversationId && selectedParticipant ? (
          <MessageThread
            conversationId={selectedConversationId}
            participant={selectedParticipant}
            onBack={handleBackToList}
            showBackButton={true}
          />
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">اختر محادثة لبدء المراسلة</p>
            <p className="text-sm mt-2">يمكنك بدء محادثات جديدة من السوق</p>
          </div>
        )}
      </div>
    </div>
  );
}
