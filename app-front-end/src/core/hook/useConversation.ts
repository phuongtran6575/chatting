import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { conversationService } from '../services/conversationService';
import type { ConversationResponse, CreateGroupPayload } from "../Types";

export const useGetOrCreateSingleConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ senderId, receiverId }: { senderId: string; receiverId: string }) => conversationService.getOrCreateSingleConversation(senderId, receiverId),
    onSuccess: () => {
      console.log("create conversation success");
      queryClient.invalidateQueries({ queryKey: ["single-conversation"] }); 
    },
  });
};
export const useCreateGroupConversation = (creator_id: string, member_ids: string[], group_name?: string) => {
  return useMutation({
    mutationFn: async () => conversationService.createGroupConversation({ creator_id, member_ids, group_name }),
})}

export const useGetGroupConversation = (senderId: string, receiverId: string) => {
  return useQuery({
    queryKey: ["group-conversation", senderId, receiverId],
    queryFn: async () => conversationService.getGroupConversation(senderId, receiverId),
    enabled: Boolean(senderId && receiverId),
    refetchOnWindowFocus: false,
  });
}

export const useGetAllConversations = () => {
  return useQuery({
    queryKey: ["all-conversations"],
    queryFn: async () => conversationService.getAllConversations(),
    refetchOnWindowFocus: false,
  });
}
export const useGetUserConversations = (userId: string) => {
  return useQuery<ConversationResponse>({
    queryKey: ["conversations", userId],
    queryFn: async () => conversationService.getUserConversations(userId),
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
  });
};
 
