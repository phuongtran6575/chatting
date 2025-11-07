import type { CreateGroupPayload } from "../Types";
import { axiosAPI } from "./baseService";

export  const conversationService = {
    getOrCreateSingleConversation: async (senderId: string, receiverId: string) => {
        const res = await axiosAPI.get("/conversations/single", {params: { sender_id: senderId, receiver_id: receiverId }});
        return  res.data;
    },
    createGroupConversation: async ({ creator_id, member_ids, group_name }: CreateGroupPayload) => {
        const res = await axiosAPI.post(`/conversations/group`, {creator_id,member_ids, group_name,});
      return res.data;
    },
    getGroupConversation: async (senderId: string, receiverId: string) => {
        const res = await axiosAPI.get("/conversations/single", {params: { sender_id: senderId, receiver_id: receiverId }});
        return  res.data;
    },
    getAllConversations: () =>{
        const res = axiosAPI.get("/conversations/");
        return res;
    },
    getUserConversations: (userId: string) =>{
        const res = axiosAPI.get(`/conversations/user/${userId}`);
        return res;
    }
}