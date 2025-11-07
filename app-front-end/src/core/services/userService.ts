import type { Pagination, User } from "../Types";
import { axiosAPI } from "./baseService";

export const userService = {
    searchUsers: async (q: string, currentUserId: string, page: number = 10, page_size: number = 0) => {
        const res = await axiosAPI.get("/users/search",  {
            params: { q, current_user_id: currentUserId, page, page_size },
        });
        return res.data;
    },
    creatUser: async (data: { full_name: string; email: string; phone_number: string; password: string }) => {
        const res = await axiosAPI.post("/users/", data);
        return res.data;
    },
    getListUsers: async (page: number = 1, pageSize: number = 10) => {
        const url = `/users?page=${page}&page_size=${pageSize}`;
        const res = await axiosAPI.get<Pagination<User>>(url);
        return res.data;
    },
    deleteUser: async (userId: string) => {
        const res = await axiosAPI.delete(`/users/${userId}`);
        return res.data;
    },
    getUserById: async (userId: string) => {
        const res = await axiosAPI.get(`/users/${userId}`);
        return res.data;
    },
    updateUserById: async (userId: string, data: { full_name?: string; email?: string; phone_number?: string }) => {
        const res = await axiosAPI.put(`/users/${userId}`, data);
        return res.data;
    },

}
