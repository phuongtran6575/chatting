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

    // 🧠 user đang được chọn (từ Sidebar)
    const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
    const { data: profile, isLoading: isLoadingReadMe } = useReadMe();
    const { data: conversations, isLoading: isLoadingConversations, error: errorConversations } = useGetUserConversations(profile?.user.id || "");
    const { data: users, isLoading: isLoadingUsers, error: errorUsers } = useGetAllUsers()
    const mergedList = useMemo(() => {
        if (!users?.items || !conversations?.items) return [];

        // lọc bạn bè chưa có conversation single
        const friendWithoutConv = users.items.filter((f: any) =>
            !conversations.items.some((c: any) => {
                // chỉ xét conversation loại 'single'
                if (c.type !== "single") return false;

                const participants = Array.isArray(c.participants[0])
                    ? c.participants.flat()
                    : c.participants;

                return participants.some((p: any) => p.id === f.id);
            })
        );

        //console.log("👥 friendWithoutConv:", friendWithoutConv);

        return [...conversations.items, ...friendWithoutConv];
    }, [users, conversations]);

    //console.log(mergedList)


    if (isLoadingReadMe || isLoadingConversations || isLoadingUsers) return <p>Loading...</p>;
    if (!profile?.user) return <p>No user found</p>;

    return (
        <Box sx={{ display: "flex", height: "100vh", color: "#fff", }} >
            {/* Sidebar trái */}
            <Sidebar conversations={mergedList}
                isCollapsed={isCollapsed}
                onSelectUser={(user) => setSelectedConversation(user)} // ⬅ nhận callback từ Sidebar
                selectedUser={selectedConversation}
                currentUser={profile?.user || null}
            />

            {/* Khu vực chính */}
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%", }}  >
                <Header
                    selectedConversation={selectedConversation}
                    onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    onToggleInfo={() => setIsInfoOpen(!isInfoOpen)}
                    currentUser={profile?.user || null}
                />

                {/* Nội dung chat co giãn */}

                <ChatContent />

                {/* Input luôn nằm cố định dưới */}
                <ChatInput currentConversation={selectedConversation} currentUser={profile?.user} />
            </Box>

            {/* Sidebar phải */}
            <ChatInfoSidebar isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
        </Box>
    );
};

export default ChatRoomPage;