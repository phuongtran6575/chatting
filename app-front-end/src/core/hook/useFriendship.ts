import { useMutation, useQuery } from "@tanstack/react-query"
import { friendshipService } from "../services/friendshipService";

export const useSendFriendRequest = async (currentUserId: string, userId: string) => {
    return useMutation({
        mutationFn: async () => friendshipService.send_friend_request(currentUserId, userId),
    });
}
export const useAcceptFriendRequest = async (currentUserId: string, requesterId: string) => {
    return useMutation({
        mutationFn: async () => friendshipService.accept_friend_request(currentUserId, requesterId),
    });
}

export const useRejectFriendRequest = async (currentUserId: string, requesterId: string) => {
    return useMutation({
        mutationFn: async () => friendshipService.reject_friend_request(currentUserId, requesterId),
    });
}
 export const useRemoveFriend = async (currentUserId: string, friendId: string) => {
    return useMutation({
        mutationFn: async () => friendshipService.remove_friend(currentUserId, friendId),
    });
}
export const useGetFriendshipStatus = async (currentUserId: string, otherId: string) => {
    return useMutation({
        mutationFn: async () => friendshipService.get_friendship_status(currentUserId, otherId),
    });
}
export const useGetListFriends = (
  currentUserId: string,
  page: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: ["friends", currentUserId, page, pageSize],
    queryFn: () => friendshipService.getlistFriends(currentUserId, page, pageSize),
    refetchOnWindowFocus: false,
  });
};