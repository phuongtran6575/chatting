// src/hooks/useChatWebSocket.ts
import { useEffect, useState } from "react";
import { chatSocketService, messageService } from "../services/websocketService";
import { useMutation } from "@tanstack/react-query";

export const useSendFirstMessage = () => {
  return useMutation({
    mutationFn: async ({
      conversationId,
      senderId,
      content,
    }: {
      conversationId: string;
      senderId: string;
      content: string;
    }) => {
      return await messageService.sendFirstMessage(conversationId, senderId, content);
    },

    onSuccess: (data) => {
      console.log("✅ First message sent successfully:", data);
    },

    onError: (error) => {
      console.error("❌ Failed to send first message:", error);
    },
  });
};

export const useChatWebSocket = (conversationId: string, userId: string) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!conversationId || !userId) {
      setIsConnected(false);
      return;
    }

    chatSocketService.connect(conversationId, userId);

    const handleMessage = (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleConnectionChange = (connected: boolean) => {
      console.log("🔌 Connection state changed:", connected);
      setIsConnected(connected);
    };

    chatSocketService.onMessage(handleMessage);
    chatSocketService.onConnectionChange(handleConnectionChange);

    return () => {
      chatSocketService.offMessage(handleMessage);
      chatSocketService.offConnectionChange(handleConnectionChange);
      chatSocketService.disconnect();
    };
  }, [conversationId, userId]);

  const sendMessage = (text: string) => {
    chatSocketService.sendMessage(text);
  };

  return { messages, sendMessage, isConnected };
};