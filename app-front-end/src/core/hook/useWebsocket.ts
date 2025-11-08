// src/hooks/useChatWebSocket.ts
import { useEffect, useState } from "react";
import { chatSocketService } from "../services/websocketService";

export const useChatWebSocket = (conversationId: string, userId: string) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    chatSocketService.connect(conversationId, userId);

    const handleMessage = (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    };

    chatSocketService.onMessage(handleMessage);

    return () => {
      chatSocketService.offMessage(handleMessage);
      chatSocketService.disconnect();
    };
  }, [conversationId, userId]);

  const sendMessage = (text: string) => {
    chatSocketService.sendMessage(text);
  };

  return { messages, sendMessage };
};
