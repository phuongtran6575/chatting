import { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import ChatContent from "../Components/ChatContent";
import ChatInfoSidebar from "../Components/ChatInforSidebar";
import ChatInput from "../Components/ChatInput";
import { useReadMe } from "../core/hook/useAuth";
import { useGetAllUsers } from "../core/hook/useUser";
import { useGetUserConversations } from "../core/hook/useConversation";
import { useGetAllMessageFromConversation } from "../core/hook/useMessage";

const ChatRoomPage = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    const { data: profile, isLoading: isLoadingReadMe } = useReadMe();
    const {
        data: conversations,
        isLoading: isLoadingConversations,
        refetch: refetchConversations,
    } = useGetUserConversations(profile?.user.id || "");
    const { data: users, isLoading: isLoadingUsers } = useGetAllUsers();
    const isConversation = !selectedUser ? selectedConversation : selectedUser;

    // 👇 CHỈ GỌI API KHI CÓ CONVERSATION ID HỢP LỆ
    const conversationId = selectedConversation?.id || "";
    const shouldFetchMessages = !!conversationId; // Boolean, không thay đổi liên tục

    const { data: apiMessages = [] } = useGetAllMessageFromConversation(
        conversationId,

    );

    // 👇 FIXED: Chỉ sync khi có conversation ID hợp lệ
    useEffect(() => {
        console.log("🔄 Sync effect triggered");
        console.log("   - selectedConversation?.id:", selectedConversation?.id);
        console.log("   - apiMessages.length:", apiMessages.length);

        // Case 1: Không có conversation → Clear messages
        if (!selectedConversation?.id) {
            console.log("🧹 No conversation selected, clearing messages");
            setMessages([]);
            return;
        }

        // Case 2: Có conversation → Load messages từ API
        console.log("📥 Loading messages from API:", apiMessages.length);
        setMessages(apiMessages);

    }, [selectedConversation?.id, apiMessages.length]); // 👈 Dùng length thay vì array

    const mergedList = useMemo(() => {
        if (!users?.items || !conversations?.items) return [];

        const friendWithoutConv = users.items.filter((f: any) =>
            !conversations.items.some((c: any) => {
                if (c.type !== "single") return false;
                const participants = Array.isArray(c.participants[0])
                    ? c.participants.flat()
                    : c.participants;
                return participants.some((p: any) => p.id === f.id);
            })
        );

        return [...conversations.items, ...friendWithoutConv];
    }, [users, conversations]);

    const handleConversationCreated = useCallback((newConversation: any) => {
        console.log("🎉 Conversation created:", newConversation.id);
        setSelectedConversation(newConversation);
        setSelectedUser(null);
        setMessages([]); // Messages sẽ được load từ API
        refetchConversations();
    }, [refetchConversations]);

    // 👇 CALLBACK THÊM TIN NHẮN MỚI
    const handleAddMessage = useCallback((newMessage: any) => {
        console.log("➕ Adding new message:", newMessage);
        setMessages(prev => {
            // Check duplicate
            const exists = prev.some(msg =>
                msg.id === newMessage.id ||
                (msg.content === newMessage.content &&
                    msg.sender_id === newMessage.sender_id &&
                    Math.abs(new Date(msg.created_at).getTime() - new Date(newMessage.created_at).getTime()) < 1000)
            );

            if (exists) {
                console.log("⚠️ Duplicate message, skipping");
                return prev;
            }

            return [...prev, newMessage];
        });
    }, []);

    // 👇 CALLBACK KHI CHỌN CONVERSATION
    const handleSelectConversation = useCallback((conv: any) => {
        console.log("🔀 Selecting conversation:", conv?.id);
        setSelectedConversation(conv);
        setSelectedUser(null);
        // Messages sẽ tự động load qua useEffect
    }, []);

    // 👇 CALLBACK KHI CHỌN USER (chưa có conversation)
    const handleSelectUser = useCallback((user: any) => {
        console.log("🔀 Selecting user (no conversation):", user?.id);
        setSelectedUser(user);
        setSelectedConversation(null);
        setMessages([]); // Clear messages vì chưa có conversation
    }, []);

    if (isLoadingReadMe || isLoadingConversations || isLoadingUsers) {
        return <p>Loading...</p>;
    }

    if (!profile?.user) {
        return <p>No user found</p>;
    }

    return (
        <Box sx={{ display: "flex", height: "100vh", color: "#fff" }}>
            <Sidebar
                conversations={mergedList}
                isCollapsed={isCollapsed}
                selectedConversation={selectedConversation}
                selectedUser={selectedUser}
                currentUser={profile?.user || null}
                onSelectConversation={handleSelectConversation}
                onSelectUser={handleSelectUser}
            />

            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <Header
                    selectedConversation={isConversation}
                    onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    onToggleInfo={() => setIsInfoOpen(!isInfoOpen)}
                    currentUser={profile?.user || null}
                />

                <ChatContent
                    messages={messages}
                    currentUser={profile?.user}
                />

                <ChatInput
                    currentConversation={selectedConversation}
                    targetUser={selectedUser}
                    currentUser={profile?.user}
                    onConversationCreated={handleConversationCreated}
                    onMessageAdd={handleAddMessage}
                />
            </Box>

            <ChatInfoSidebar isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
        </Box>
    );
};

export default ChatRoomPage;