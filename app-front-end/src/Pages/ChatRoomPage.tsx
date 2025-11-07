import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import ChatContent from "../Components/ChatContent";
import ChatInfoSidebar from "../Components/ChatInforSidebar";
import ChatInput from "../Components/ChatInput";

const ChatRoomPage = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    // 🧠 user đang được chọn (từ Sidebar)
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    return (
        <Box sx={{ display: "flex", height: "100vh", color: "#fff", }} >
            {/* Sidebar trái */}
            <Sidebar
                isCollapsed={isCollapsed}
                onSelectUser={(user) => setSelectedUser(user)} // ⬅ nhận callback từ Sidebar
                selectedUser={selectedUser}
            />

            {/* Khu vực chính */}
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%", }}  >
                <Header
                    selectedUser={selectedUser}
                    onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    onToggleInfo={() => setIsInfoOpen(!isInfoOpen)}
                />

                {/* Nội dung chat co giãn */}

                <ChatContent />

                {/* Input luôn nằm cố định dưới */}
                <ChatInput />
            </Box>

            {/* Sidebar phải */}
            <ChatInfoSidebar isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
        </Box>
    );
};

export default ChatRoomPage;