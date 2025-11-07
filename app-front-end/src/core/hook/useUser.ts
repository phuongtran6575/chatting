import { useMutation, useQuery } from "@tanstack/react-query"
import { userService } from "../services/userService";

export const useSearchUsers = (q: string, currentUserId: string, page = 1, page_size = 10) => {
  return useQuery({
    queryKey: ["search-users", q, currentUserId, page, page_size],
    queryFn: () => userService.searchUsers(q, currentUserId, page, page_size),
    enabled: Boolean(q && q.trim() && currentUserId), // 🔥 chỉ chạy khi có từ khóa và user id
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30, // 30s cache
  });
};
export const useGetAllUsers = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: () => userService.getListUsers(page, pageSize),
    refetchOnWindowFocus: false,
  });
}