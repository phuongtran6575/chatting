import { Box, Avatar, Typography, Paper } from "@mui/material";
import { useEffect, useRef } from "react";
import type { User } from "../core/Types";

const messages = [
    {
        id: 1,
        sender: "Alex the Adventurer",
        avatar: "https://i.pravatar.cc/150?img=12",
        text: "Xin chào! Tôi là Alex the Adventurer. Tôi có thể giúp gì cho bạn?",
        isUser: false,
    },
    // Bạn có thể thêm tin nhắn khác ở đây
];

interface ChatContentProps {
    messages: any[]; // 👈 Nhận từ props thay vì fetch API
    currentUser: User | null;
}

const ChatContent = ({ messages, currentUser }: ChatContentProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 👇 Auto-scroll khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#0b1625",
                    color: "#666",
                }}
            >
                <Typography>Chưa có tin nhắn. Hãy bắt đầu trò chuyện!</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                bgcolor: "#0b1625",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            {messages.map((msg: any) => (
                <Box
                    key={msg.id}
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        flexDirection:
                            msg.sender_id === currentUser?.id ? "row-reverse" : "row",
                    }}
                >
                    <Avatar
                        src={msg.sender?.avatar || msg.avatar}
                        alt={msg.sender?.full_name || msg.sender}
                        sx={{ width: 36, height: 36, mt: "auto", mb: "auto" }}
                    />

                    <Paper
                        elevation={2}
                        sx={{
                            bgcolor:
                                msg.sender_id === currentUser?.id ? "#1976d2" : "#2c3e55",
                            color: "#fff",
                            px: 2,
                            py: 1,
                            borderRadius: 3,
                            borderTopLeftRadius:
                                msg.sender_id === currentUser?.id ? 3 : 0,
                            borderTopRightRadius:
                                msg.sender_id === currentUser?.id ? 0 : 3,
                            maxWidth: "70%",
                            boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                        }}
                    >
                        <Typography variant="body1">{msg.content}</Typography>
                        <Typography
                            variant="caption"
                            sx={{ opacity: 0.7, fontSize: "0.7rem", display: "block", mt: 0.5 }}
                        >
                            {new Date(msg.created_at).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Typography>
                    </Paper>
                </Box>
            ))}

            <div ref={messagesEndRef} />
        </Box>
    );
};

export default ChatContent;