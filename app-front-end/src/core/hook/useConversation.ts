import { useQuery } from "@tanstack/react-query"
import { conversationService } from "../services/conversationService"

export const useGetOrCreateSingleConversation = (senderId: string, receiverId: string) => {
  return useQuery({
    queryKey: ["single-conversation", senderId, receiverId],    
    queryFn: async () => conversationService.getOrCreateSingleConversation(senderId, receiverId),
    enabled: Boolean(senderId && receiverId), // Chỉ chạy khi có senderId và receiverId
    refetchOnWindowFocus: false,
  });
}