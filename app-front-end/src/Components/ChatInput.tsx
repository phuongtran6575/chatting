import { Box, TextField, IconButton, InputAdornment, } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import EmojiEmotionsRoundedIcon from "@mui/icons-material/EmojiEmotionsRounded";
import type { User } from "../core/Types";
import { useChatWebSocket } from "../core/hook/useWebsocket";
import { useState } from "react";
import { useGetOrCreateSingleConversation } from "../core/hook/useConversation";

interface ChatInputProps {
    currentConversation: any | null;
    currentUser: User | null;
}

const ChatInput = ({ currentConversation, currentUser }: ChatInputProps) => {
    // 🧩 Khởi tạo WebSocket khi có conversation và user
    const { messages, sendMessage } = useChatWebSocket(currentConversation?.id || "", currentUser?.id || "");
    const { data: Conversation } = useGetOrCreateSingleConversation(currentUser?.id || "", currentConversation?.participantId || "");

    const [text, setText] = useState("");

    const handleSendMessage = () => {
        //đoạn kiểm tra currenconversation id để kiểm tra các single conversation đã tốn tại hay chưa, 
        //nếu chưa thì đoạn chat đầu tiên sẽ tự tạo conversation, 
        // nếu  rồi thì tiếp tục gửi message
        // với group conversation thì thường phải tạo bằng tay nên đoạn này chủ yêus để kiểm tra  single type
        if (!currentConversation.id) {
            console.warn("No conversation selected.");
        }
        if (!text.trim()) return;
        sendMessage(text);
        setText(""); // reset input sau khi gửi
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#0d1627",
                p: 2,
                borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
        >
            {/* Ô nhập tin nhắn */}
            <TextField
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // enter để gửi
                placeholder="Nhắn tin với...."
                variant="outlined"
                InputProps={{
                    sx: {
                        bgcolor: "#2c3e55",
                        borderRadius: 50,
                        color: "#cfd8dc",
                        px: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                    },
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton size="small" sx={{ color: "#90a4ae" }}>
                                <EmojiEmotionsRoundedIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            {/* Nút gửi tin nhắn */}
            <IconButton
                onClick={handleSendMessage}
                sx={{
                    ml: 1.5,
                    bgcolor: "#3b4a63",
                    color: "#fff",
                    p: 1.2,
                    borderRadius: "50%",
                    "&:hover": {
                        bgcolor: "#4a5d7a",
                    },
                }}
            >
                <SendRoundedIcon />
            </IconButton>
        </Box>
    );
};

export default ChatInput;