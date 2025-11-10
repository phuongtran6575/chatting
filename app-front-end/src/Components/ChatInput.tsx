import { Box, TextField, IconButton, InputAdornment, } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import EmojiEmotionsRoundedIcon from "@mui/icons-material/EmojiEmotionsRounded";
import type { Conversation, User } from "../core/Types";
import { useChatWebSocket, useSendFirstMessage } from "../core/hook/useWebsocket";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetOrCreateSingleConversation } from "../core/hook/useConversation";

interface ChatInputProps {
    currentConversation: any | null;
    currentUser: User | null;
    targetUser: User | null;
    onConversationCreated?: (conversation: any) => void; // 👈 Thêm prop
    onMessageAdd?: (message: any) => void;
}

const isConversation = (obj: any): obj is Conversation => {
    return obj &&
        typeof obj === 'object' &&
        'type' in obj &&
        'participants' in obj &&
        (obj.type === 'group' || obj.type === 'single');
};

const ChatInput = ({ currentConversation, targetUser, currentUser, onConversationCreated, onMessageAdd }: ChatInputProps) => {
    const [text, setText] = useState("");
    const [pendingMessages, setPendingMessages] = useState<string[]>([]);

    // 👇 Track conversation creation state
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);
    const [tempConversationId, setTempConversationId] = useState<string>("");

    const creatingForUserRef = useRef<string | null>(null);

    const isValidConversation = currentConversation && currentConversation.participants;
    const conversationId = isValidConversation ? currentConversation.id : tempConversationId;

    const { messages, sendMessage, isConnected } = useChatWebSocket(
        conversationId,
        currentUser?.id || ""
    );

    const getOrCreateConversation = useGetOrCreateSingleConversation();
    const sendFirstMessage = useSendFirstMessage();

    // 👇 Reset temp conversation khi chuyển user
    useEffect(() => {
        if (!targetUser && !currentConversation) {
            setTempConversationId("");
            setPendingMessages([]);
            setIsCreatingConversation(false);
        }
    }, [targetUser, currentConversation]);

    // 👇 AUTO-SEND pending messages khi WebSocket ready
    useEffect(() => {
        if (isConnected && conversationId && pendingMessages.length > 0 && !isCreatingConversation) {
            console.log("📤 Sending", pendingMessages.length, "pending messages");

            pendingMessages.forEach((msg, index) => {
                setTimeout(() => {
                    sendMessage(msg);

                    // 👇 ADD TỪNG TIN NHẮN VÀO UI
                    onMessageAdd?.({
                        id: `temp-${Date.now()}-${index}`,
                        content: msg,
                        sender_id: currentUser?.id,
                        sender: currentUser,
                        created_at: new Date().toISOString(),
                    });
                }, index * 100);
            });

            setPendingMessages([]);
        }
    }, [isConnected, conversationId, pendingMessages, isCreatingConversation, sendMessage, currentUser, onMessageAdd]);

    const handleSendMessage = useCallback(() => {
        if (!text.trim()) return;

        const messageToSend = text.trim();
        setText("");

        console.log("\n" + "=".repeat(60));
        console.log("📝 SEND MESSAGE:", messageToSend);
        console.log("   - currentConversation:", currentConversation?.id);
        console.log("   - tempConversationId:", tempConversationId);
        console.log("   - isValidConversation:", isValidConversation);
        console.log("   - conversationId:", conversationId);
        console.log("   - isConnected:", isConnected);
        console.log("   - isCreatingConversation:", isCreatingConversation);
        console.log("   - targetUser:", targetUser?.id);
        console.log("   - pendingMessages.length:", pendingMessages.length);
        console.log("=".repeat(60) + "\n");

        // 🧩 Case 1: Đang tạo conversation → Queue ngay
        if (isCreatingConversation) {
            console.log("⏳ [QUEUE] Conversation is being created");
            setPendingMessages(prev => [...prev, messageToSend]);
            return;
        }

        // 🧩 Case 2: Chưa có conversation - tạo mới
        if (!isValidConversation && targetUser) {
            const targetId = targetUser.id;
            creatingForUserRef.current = targetId;
            setIsCreatingConversation(true);

            console.log("🆕 [CREATE] Creating new conversation with user:", targetId);

            getOrCreateConversation.mutate(
                { senderId: currentUser?.id || "", receiverId: targetId },
                {
                    onSuccess: (newConversation) => {
                        // Kiểm tra race condition
                        if (creatingForUserRef.current !== targetId) {
                            console.log("⚠️ [CANCEL] User switched - ignoring old conversation");
                            creatingForUserRef.current = null;
                            setIsCreatingConversation(false);
                            return;
                        }

                        console.log("✅ [CREATE SUCCESS] Conversation:", newConversation.id);

                        // 👇 Set temp conversation ID để WebSocket connect ngay
                        setTempConversationId(newConversation.id);

                        // 👇 Thông báo cho parent
                        onConversationCreated?.(newConversation);

                        // 👇 Send first message qua API
                        console.log("📤 [API] Sending first message");
                        sendFirstMessage.mutate({
                            conversationId: newConversation.id,
                            senderId: currentUser?.id || "",
                            content: messageToSend,
                        }, {
                            onSuccess: () => {
                                console.log("✅ [API SUCCESS] First message sent");
                                setIsCreatingConversation(false);
                                creatingForUserRef.current = null;
                            },
                            onError: (error) => {
                                console.error("❌ [API ERROR] Failed to send first message:", error);
                                setIsCreatingConversation(false);
                                creatingForUserRef.current = null;
                                setText(messageToSend);
                            }
                        });
                    },
                    onError: (error) => {
                        console.error("❌ [CREATE ERROR] Failed to create conversation:", error);
                        setText(messageToSend);
                        setIsCreatingConversation(false);
                        creatingForUserRef.current = null;
                    },
                }
            );
            return;
        }

        // 🧩 Case 3: Đã có conversation
        if (isValidConversation) {
            if (isConnected) {
                console.log("📤 [WEBSOCKET] Sending message (connected)");
                sendMessage(messageToSend);

                // 👇 ADD TIN NHẮN NGAY VÀO UI
                onMessageAdd?.({
                    id: `temp-${Date.now()}`,
                    content: messageToSend,
                    sender_id: currentUser?.id,
                    sender: currentUser,
                    created_at: new Date().toISOString(),
                });
            } else {
                console.log("⏳ [QUEUE] WebSocket not connected yet");
                setPendingMessages(prev => [...prev, messageToSend]);
            }
        }
    }, [
        text,
        currentConversation,
        tempConversationId,
        isValidConversation,
        conversationId,
        isConnected,
        isCreatingConversation,
        targetUser,
        pendingMessages.length,
        currentUser,
        getOrCreateConversation,
        sendFirstMessage,
        sendMessage,
        onConversationCreated
    ]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#0d1627",
                p: 2,
                borderTop: "1px solid rgba(255,255,255,0.1)",
                position: "relative"
            }}
        >
            <TextField
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                    }
                }}
                placeholder="Nhắn tin..."
                variant="outlined"
                multiline
                maxRows={4}
                disabled={isCreatingConversation}
                InputProps={{
                    sx: {
                        bgcolor: "#2c3e55",
                        borderRadius: 3,
                        color: "#cfd8dc",
                        px: 2,
                        py: 1,
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    },
                }}
            />
            <IconButton
                onClick={handleSendMessage}
                disabled={!text.trim() || isCreatingConversation}
                sx={{
                    ml: 1.5,
                    bgcolor: "#3b4a63",
                    color: "#fff",
                    p: 1.2,
                    borderRadius: "50%",
                    "&:hover": { bgcolor: "#4a5d7a" },
                    "&:disabled": {
                        bgcolor: "#2c3e55",
                        color: "#666"
                    },
                }}
            >
                <SendRoundedIcon />
            </IconButton>

            {/* 👇 Status indicators */}
            {/*} {isCreatingConversation && (
                <Box sx={{
                    position: 'absolute',
                    bottom: 70,
                    right: 20,
                    bgcolor: 'blue',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: 12,
                    zIndex: 1000
                }}>
                    🔄 Đang tạo cuộc trò chuyện...
                </Box>
            )}*/}

            {/* {!isCreatingConversation && pendingMessages.length > 0 && (
                <Box sx={{
                    position: 'absolute',
                    bottom: 70,
                    right: 20,
                    bgcolor: 'orange',
                    color: 'black',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: 12,
                    zIndex: 1000
                }}>
                    ⏳ {pendingMessages.length} tin nhắn đang chờ...
                </Box>
            )}*/}

            {/*{isConnected && conversationId && (
                <Box sx={{
                    position: 'absolute',
                    bottom: 70,
                    left: 20,
                    bgcolor: 'green',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: 12,
                    zIndex: 1000
                }}>
                    ✅ Đã kết nối
                </Box>
            )}*/}
        </Box>
    );
};

export default ChatInput;