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
    targetUser: User | null;
    onConversationCreated?: (conversation: any) => void; // 👈 Thêm prop
}

const isConversation = (obj: any): obj is Conversation => {
    return obj &&
        typeof obj === 'object' &&
        'type' in obj &&
        'participants' in obj &&
        (obj.type === 'group' || obj.type === 'single');
};

const ChatInput = ({ currentConversation, targetUser, currentUser, onConversationCreated }: ChatInputProps) => {
    const [text, setText] = useState("");
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);
    const creatingForUserRef = useRef<string | null>(null);

    const isValidConversation = currentConversation && currentConversation.participants;
    const { messages, sendMessage, isConnected } = useChatWebSocket(
        isValidConversation ? currentConversation.id : "",
        currentUser?.id || ""
    );
    const getOrCreateConversation = useGetOrCreateSingleConversation();
    const sendFirstMessage = useSendFirstMessage();

    const handleSendMessage = () => {
        if (!text.trim()) return;
        const messageToSend = text.trim();
        setText("");

        // 🧩 Nếu chưa có conversation (chat với user)
        if (!isValidConversation && targetUser) {
            const targetId = targetUser.id;
            creatingForUserRef.current = targetId;

            getOrCreateConversation.mutate(
                { senderId: currentUser?.id || "", receiverId: targetId },
                {
                    onSuccess: (newConversation) => {
                        if (creatingForUserRef.current !== targetId) {
                            console.log("⚠️ Conversation changed — skipping sendFirstMessage");
                            creatingForUserRef.current = null;
                            return;
                        }
                        onConversationCreated?.(newConversation);
                        sendFirstMessage.mutate({
                            conversationId: newConversation.id,
                            senderId: currentUser?.id || "",
                            content: messageToSend,
                        });
                    },
                    onError: () => setText(messageToSend),
                }
            );
            return;
        }

        // 🧩 Nếu đã có conversation
        if (isValidConversation) {
            sendMessage(messageToSend);
        }
    };

    useEffect(() => {
        if (isConnected && pendingMessage) {
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
                placeholder="Nhắn tin..."
                variant="outlined"
                InputProps={{
                    sx: {
                        bgcolor: "#2c3e55",
                        borderRadius: 50,
                        color: "#cfd8dc",
                        px: 2,
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    },
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
                    "&:hover": { bgcolor: "#4a5d7a" },
                }}
            >
                <SendRoundedIcon />
            </IconButton>
        </Box>
    );
};

export default ChatInput;
