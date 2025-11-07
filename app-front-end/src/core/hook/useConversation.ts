import { useMutation, useQuery } from "@tanstack/react-query"
import { conversationService } from '../services/conversationService';
import type { CreateGroupPayload } from "../Types";

export const useGetOrCreateSingleConversation = (senderId: string, receiverId: string) => {
  return useQuery({
    queryKey: ["single-conversation", senderId, receiverId],    
    queryFn: async () => conversationService.getOrCreateSingleConversation(senderId, receiverId),
    enabled: Boolean(senderId && receiverId), // Chỉ chạy khi có senderId và receiverId
    refetchOnWindowFocus: false,
  });
}
export const useGetOrCreateGroupConversation = (creator_id: string, member_ids: string[], group_name?: string) => {
  return useMutation({
    mutationFn: async () => conversationService.createGroupConversation({ creator_id, member_ids, group_name }),
})}
export const useGetAllConversations = () => {
  return useQuery({
    queryKey: ["all-conversations"],
    queryFn: async () => conversationService.getAllConversations(),
    refetchOnWindowFocus: false,
  });
}
export const useGetUserConversations = (userId: string) => {
  return useQuery({
    queryKey: ["user-conversations", userId],})
  
}
 
