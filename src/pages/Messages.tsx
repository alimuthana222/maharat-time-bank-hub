
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Send, PaperclipIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Mock data for conversations
const MOCK_CONVERSATIONS = [
  {
    id: "1",
    user: {
      name: "أحمد محمد",
      avatarFallback: "أم",
      lastSeen: "متصل الآن"
    },
    lastMessage: {
      text: "هل يمكنني الحصول على مساعدة في مشروع البرمجة؟",
      timestamp: "10:30 AM",
      isRead: true,
    },
    unreadCount: 0
  },
  {
    id: "2",
    user: {
      name: "سارة العتيبي",
      avatarFallback: "سع",
      lastSeen: "منذ 15 دقيقة"
    },
    lastMessage: {
      text: "شكراً جزيلاً على المساعدة في مشروع التخرج!",
      timestamp: "9:15 AM",
      isRead: false,
    },
    unreadCount: 2
  },
  {
    id: "3",
    user: {
      name: "خالد الزهراني",
      avatarFallback: "خز",
      lastSeen: "متصل الآن"
    },
    lastMessage: {
      text: "هل أنت متاح غدا للعمل على المشروع؟",
      timestamp: "أمس",
      isRead: true,
    },
    unreadCount: 0
  },
  {
    id: "4",
    user: {
      name: "نورة السالم",
      avatarFallback: "نس",
      lastSeen: "منذ 3 ساعات"
    },
    lastMessage: {
      text: "أرسلت لك الملفات المطلوبة للمراجعة",
      timestamp: "أمس",
      isRead: false,
    },
    unreadCount: 1
  },
];

// Mock data for messages in current conversation
const MOCK_MESSAGES = [
  {
    id: "1",
    sender: "them",
    text: "أهلاً، هل يمكنني الحصول على مساعدة في مشروع البرمجة؟",
    timestamp: "10:30 AM",
    read: true
  },
  {
    id: "2",
    sender: "me",
    text: "بالتأكيد! ما هو نوع المشروع الذي تعمل عليه؟",
    timestamp: "10:32 AM",
    read: true
  },
  {
    id: "3",
    sender: "them",
    text: "إنه مشروع تخرج يتعلق بتطوير تطبيق ويب باستخدام React و Node.js.",
    timestamp: "10:35 AM",
    read: true
  },
  {
    id: "4",
    sender: "me",
    text: "رائع! لدي خبرة جيدة في هذه التقنيات. هل يمكنك إخباري بالمزيد عن متطلبات المشروع والموعد النهائي؟",
    timestamp: "10:38 AM",
    read: true
  },
  {
    id: "5",
    sender: "them",
    text: "الموعد النهائي بعد شهر من الآن. هل يمكننا التحدث عن التفاصيل والأسعار؟",
    timestamp: "10:40 AM",
    read: true
  },
];

export default function Messages() {
  const { user } = useAuth();
  const [activeConversation, setActiveConversation] = useState(MOCK_CONVERSATIONS[0].id);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = MOCK_CONVERSATIONS.filter(convo =>
    convo.user.name.includes(searchQuery)
  );

  const sendMessage = () => {
    if (!messageText.trim()) return;
    // In a real app, we would send the message to the API
    console.log("Sending message:", messageText);
    setMessageText("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container py-6">
        <div className="flex h-[calc(100vh-8rem)] rounded-lg border shadow-sm overflow-hidden">
          {/* Conversations sidebar */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold mb-4">المحادثات</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="بحث..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`flex items-center p-4 w-full text-right hover:bg-accent/50 transition-colors ${
                    activeConversation === conversation.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{conversation.user.avatarFallback}</AvatarFallback>
                    </Avatar>
                    {conversation.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="mr-3 flex-1 overflow-hidden">
                    <div className="flex justify-between">
                      <span className="font-medium">{conversation.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {conversation.lastMessage.timestamp}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={`truncate ${!conversation.lastMessage.isRead ? "font-medium" : "text-muted-foreground"}`}>
                        {conversation.lastMessage.text}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{conversation.user.lastSeen}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Chat area */}
          <div className="w-2/3 flex flex-col">
            {/* Chat header */}
            <div className="p-4 border-b flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {MOCK_CONVERSATIONS.find(c => c.id === activeConversation)?.user.avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div className="mr-3">
                <h3 className="font-medium">
                  {MOCK_CONVERSATIONS.find(c => c.id === activeConversation)?.user.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {MOCK_CONVERSATIONS.find(c => c.id === activeConversation)?.user.lastSeen}
                </p>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="flex flex-col space-y-4">
                {MOCK_MESSAGES.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "me" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent"
                      }`}
                    >
                      <p>{message.text}</p>
                      <span className="text-xs opacity-70 block text-left mt-1">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t">
              <form
                className="flex items-center space-x-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                >
                  <PaperclipIcon className="h-5 w-5" />
                  <span className="sr-only">إرفاق ملف</span>
                </Button>
                <Input
                  placeholder="اكتب رسالة..."
                  className="flex-1"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Button type="submit" size="icon" className="rounded-full">
                  <Send className="h-5 w-5" />
                  <span className="sr-only">إرسال</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
