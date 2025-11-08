import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import ChatContent from "../Components/ChatContent";
import ChatInfoSidebar from "../Components/ChatInforSidebar";
import ChatInput from "../Components/ChatInput";
import { useReadMe } from "../core/hook/useAuth";

const ChatRoomPage = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    // 🧠 user đang được chọn (từ Sidebar)
    const [selectedConversation, setSelectedConversation] = useState<any | null>(null);

    const { data: profile, isLoading: isLoadingReadMe } = useReadMe();
    if (isLoadingReadMe) return <p>Loading...</p>;
    if (!profile?.user) return <p>No user found</p>;

    return (
        <Box sx={{ display: "flex", height: "100vh", color: "#fff", }} >
            {/* Sidebar trái */}
            <Sidebar
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