import { useQuery } from "@tanstack/react-query";
import { messageService } from "../services/messageService";

export const useGetAllMessageFromConversation = (conversationId: string) => {
    return useQuery({
        queryKey: ['messages', conversationId],
        queryFn: () => messageService.getAllMessageFromConversation(conversationId),
        enabled: !!conversationId, // 👈 CHỈ GỌI API KHI CÓ ID
        staleTime: 1000 * 60 * 5, // Cache 5 phút
    });
};