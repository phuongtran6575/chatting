import { useMutation, useQuery } from "@tanstack/react-query"
import { authService } from "../services/authService"
import { useAuthStore } from "../Stores/authStore";

export const useLogin = () => {
  const login = useAuthStore(state => state.login);

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const tokenRes = await authService.login(data); // lấy token
      return { token: tokenRes.access_token };      
    },
    onSuccess: ({ token }) => {
      console.log(token)
      login(token)
    },
  });
};
export const useRegister = () =>{
    return useMutation({
        mutationFn: authService.register,
    })
}
export const useReadMe = () => {
  const setAuth = useAuthStore(state => state.setAuth);

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await authService.readMe();
      setAuth(res.user, res.roles);
      return res;
    },
    enabled: !!useAuthStore.getState().token, // chỉ chạy nếu có token
  });
};