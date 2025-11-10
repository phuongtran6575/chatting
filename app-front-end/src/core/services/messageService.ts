import { axiosAPI } from "./baseService";

export const messageService ={
    getAllMessageFromConversation: async (conversation_id: string) =>{
        const res = await axiosAPI.get("/messages/all-message-from-conversation", {params: { conversation_id: conversation_id }});
        return  res.data;
    }
}