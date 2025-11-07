import { Box, Avatar, Typography, Paper } from "@mui/material";

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

const ChatContent = () => {
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
            {messages.map((msg) => (
                <Box
                    key={msg.id}
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        flexDirection: msg.isUser ? "row-reverse" : "row",
                    }}
                >
                    {/* Avatar người gửi */}
                    <Avatar
                        src={msg.avatar}
                        alt={msg.sender}
                        sx={{
                            width: 36,
                            height: 36,
                            mt: "auto",
                            mb: "auto",
                        }}
                    />

                    {/* Bong bóng tin nhắn */}
                    <Paper
                        elevation={2}
                        sx={{
                            bgcolor: msg.isUser ? "#1976d2" : "#2c3e55",
                            color: "#fff",
                            px: 2,
                            py: 1,
                            borderRadius: 3,
                            borderTopLeftRadius: msg.isUser ? 3 : 0,
                            borderTopRightRadius: msg.isUser ? 0 : 3,
                            maxWidth: "70%",
                            boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                        }}
                    >
                        <Typography variant="body1">{msg.text}</Typography>
                    </Paper>
                </Box>
            ))}
        </Box>
    );
}
export default ChatContent