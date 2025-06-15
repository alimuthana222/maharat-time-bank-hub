
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<boolean>;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || sending) return;

    setSending(true);
    const success = await onSendMessage(message.trim());
    
    if (success) {
      setMessage("");
    }
    
    setSending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="اكتب رسالتك..."
        disabled={disabled || sending}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={!message.trim() || disabled || sending}
        size="sm"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
