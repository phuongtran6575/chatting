import { useQuery } from "@tanstack/react-query";
import { messageService } from "../services/messageService";

export const useGetAllMessageFromConversation = (conversation_id: string) =>{
    return useQuery({
    queryKey: ["users", conversation_id],
    queryFn: () => messageService.getAllMessageFromConversation(conversation_id),
    refetchOnWindowFocus: false,
  });
}