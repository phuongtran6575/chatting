import { Box, TextField, IconButton, InputAdornment, } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import EmojiEmotionsRoundedIcon from "@mui/icons-material/EmojiEmotionsRounded";
import type { Conversation, User } from "../core/Types";
import { useChatWebSocket, useSendFirstMessage } from "../core/hook/useWebsocket";
import { useEffect, useRef, useState } from "react";
import { useGetOrCreateSingleConversation } from "../core/hook/useConversation";

interface ChatInputProps {
    currentConversation: any | null;
    currentUser: User | null;
    onConversationCreated?: (conversation: any) => void; // 👈 Thêm prop
}

const isConversation = (obj: any): obj is Conversation => {
    return obj &&
        typeof obj === 'object' &&
        'type' in obj &&
        'participants' in obj &&
        (obj.type === 'group' || obj.type === 'single');
};

const ChatInput = ({ currentConversation, currentUser, onConversationCreated }: ChatInputProps) => {
    const isValidConversation = isConversation(currentConversation);
    const creatingForUserRef = useRef<string | null>(null);

    const { messages, sendMessage, isConnected } = useChatWebSocket( // 👈 Nhận isConnected
        isValidConversation ? currentConversation.id : "",
        currentUser?.id || ""
    );
    const getOrCreateConversation = useGetOrCreateSingleConversation();
    const sendFirstMessage = useSendFirstMessage();

    const [text, setText] = useState("");
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);

    const handleSendMessage = () => {
        if (!text.trim()) return;

        if (!isValidConversation) {
            const messageToSend = text;
            const targetId = currentConversation.id; // người đang nhắn tới
            creatingForUserRef.current = targetId;
            setText("");
            console.log(creatingForUserRef)
            getOrCreateConversation.mutate(
                { senderId: currentUser?.id || "", receiverId: targetId },
                {
                    onSuccess: (newConversation) => {
                        // ✅ kiểm tra xem user hiện tại có còn là người đó không
                        if (creatingForUserRef.current !== targetId) {
                            // user đã chuyển tab -> bỏ qua gửi
                            console.log("⚠️ Conversation changed — skipping sendFirstMessage");
                            creatingForUserRef.current = null;
                            return;
                        }

                        onConversationCreated?.(newConversation);
                        console.log("luu lai day")
                        sendFirstMessage.mutate({
                            conversationId: newConversation.id,
                            senderId: currentUser?.id || "",
                            content: messageToSend,
                        });
                    },
                    onError: () => setText(messageToSend),
                }
            );
        } else {
            sendMessage(text);
            setText("");
        }
    };

    // 👇 Theo dõi khi WebSocket connected và có pending message
    useEffect(() => {
        if (isConnected && pendingMessage) {
            console.log("✅ WebSocket ready, sending pending message:", pendingMessage);
            sendMessage(pendingMessage);
            setPendingMessage(null);
        }
    }, [isConnected, pendingMessage, sendMessage]);

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
            <TextField
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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