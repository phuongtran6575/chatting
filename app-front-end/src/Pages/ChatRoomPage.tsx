import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import ChatContent from "../Components/ChatContent";
import ChatInfoSidebar from "../Components/ChatInforSidebar";
import ChatInput from "../Components/ChatInput";
import { useReadMe } from "../core/hook/useAuth";
import { useGetAllUsers } from "../core/hook/useUser";
import { useGetUserConversations } from "../core/hook/useConversation";

const ChatRoomPage = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState<any | null>(null);

    const { data: profile, isLoading: isLoadingReadMe } = useReadMe();
    const { data: conversations, isLoading: isLoadingConversations, error: errorConversations, refetch: refetchConversations } = useGetUserConversations(profile?.user.id || "");
    const { data: users, isLoading: isLoadingUsers, error: errorUsers } = useGetAllUsers()

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

    // 👇 Callback để update conversation sau khi tạo mới
    const handleConversationCreated = async (newConversation: any) => {
        console.log("✅ Conversation created:", newConversation);

        // 1. Update selectedConversation
        setSelectedConversation(newConversation);

        // 2. Refetch conversations để cập nhật sidebar
        await refetchConversations();
    };

    if (isLoadingReadMe || isLoadingConversations || isLoadingUsers) return <p>Loading...</p>;
    if (!profile?.user) return <p>No user found</p>;

    return (
        <Box sx={{ display: "flex", height: "100vh", color: "#fff", }} >
            <Sidebar
                conversations={mergedList}
                isCollapsed={isCollapsed}
                onSelectUser={(user) => setSelectedConversation(user)}
                selectedUser={selectedConversation}
                currentUser={profile?.user || null}
            />

            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%", }}  >
                <Header
                    selectedConversation={selectedConversation}
                    onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    onToggleInfo={() => setIsInfoOpen(!isInfoOpen)}
                    currentUser={profile?.user || null}
                />

                <ChatContent />

                <ChatInput
                    currentConversation={selectedConversation}
                    currentUser={profile?.user}
                    onConversationCreated={handleConversationCreated} // 👈 Truyền callback
                />
            </Box>

            <ChatInfoSidebar isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
        </Box>
    );
};
export default ChatRoomPage;