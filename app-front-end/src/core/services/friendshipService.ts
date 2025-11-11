import { axiosAPI } from "./baseService";

export const friendshipService = {
    getlistFriends: async (currentUserId: string, page: number, pageSize: number) => {
        const res = await axiosAPI.get(`/friends/list`, {
            params: { current_user_id: currentUserId, page: page, page_size: pageSize },
        });
        return res.data;
    },
    send_friend_request: async (currentUserId: string, userId: string) => {
        const res = await axiosAPI.post(`/friends/send/${userId}`, null, {
            params: { current_user_id: currentUserId },
        });
        return res.data;
    },
    get_friendship_status: async (currentUserId: string, otherId: string) => {
        const res = await axiosAPI.get(`/friends/status/${otherId}`, {
            params: { current_user_id: currentUserId },
        });
        return res.data;
    },
    accept_friend_request: async (currentUserId: string, requesterId: string) => {
        const res = await axiosAPI.post(`/friends/accept/${requesterId}`, null, {
            params: { current_user_id: currentUserId },
        });
        return res.data;
    },
    reject_friend_request: async (currentUserId: string, requesterId: string) => {
        const res = await axiosAPI.post(`/friends/reject/${requesterId}`, null, {
            params: { current_user_id: currentUserId },
        });
        return res.data;
    }, 
    remove_friend: async (currentUserId: string, friendId: string) => {
        const res = await axiosAPI.delete(`/friends/remove/${friendId}`, {
            params: { current_user_id: currentUserId },
        });
        return res.data;
    }
    
}