import { axiosAPI } from "./baseService";

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const authService =  {
    login: async (data: { email: string; password: string }): Promise<TokenResponse> => {
        const formData = new URLSearchParams();
        formData.append("username", data.email);
        formData.append("password", data.password);

        const res = await axiosAPI.post<TokenResponse>("/auth/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return res.data;
    },
    register: async (data: {full_name: string, password: string,confirm_password: string, email: string, phone_number: string}) => {
        const res = await axiosAPI.post("/auth/register", data);
        return res.data;
    },
    readMe: async () => {
        const res = await axiosAPI.get("/auth/read_me");
        return res.data;
    },
    
}