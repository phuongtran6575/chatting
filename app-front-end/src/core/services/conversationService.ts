import { axiosAPI } from "./baseService";

export  const conversationService = {
    getOrCreateSingleConversation: async (senderId: string, receiverId: string) => {
        const res = await axiosAPI.post("/conversations/single", { sender_id: senderId, receiver_id: receiverId });
        return  res.data;
    }
}