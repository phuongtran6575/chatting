import { axiosAPI } from "./baseService";

export  const conversationService = {
    getOrCreateSingleConversation: async (senderId: string, receiverId: string) => {
        const res = await axiosAPI.get("/conversations/single", {params: { sender_id: senderId, receiver_id: receiverId }});
        return  res.data;
    }
}