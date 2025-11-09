import { axiosAPI } from "./baseService";

// chatSocketService.ts
export const messageService = {

  sendFirstMessage: async ( conversationId: string, senderId: string, content: string) => {
      const res = await axiosAPI.post("/sendfirstMessage", { conversation_id: conversationId, sender_id: senderId, content: content,});
      return res.data; // { status: "success", message: {...} }
  },
};


type MessageListener = (msg: string) => void;
type ConnectionListener = (isConnected: boolean) => void;

export const createChatSocketService = () => {
  let socket: WebSocket | null = null;
  let listeners: MessageListener[] = [];
  let connectionListeners: ConnectionListener[] = []; // 👈 Thêm listeners cho connection state
  let isConnected = false; // 👈 Thêm state để track connection

  const connect = (conversationId: string, userId: string) => {
    if (!conversationId || !userId) return;

    // Đóng connection cũ nếu có
    if (socket?.readyState === WebSocket.OPEN) {
      console.log("⚠️ WebSocket already connected, closing old connection");
      disconnect();
    }

    const wsUrl = `ws://localhost:8000/ws/chat/${conversationId}/${userId}`;
    console.log("🔌 Connecting to:", wsUrl);

    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      isConnected = true;
      // 👇 Thông báo cho tất cả listeners
      notifyConnectionListeners(true);
    };

    socket.onmessage = (event) => {
      console.log("📩 Received:", event.data);
      listeners.forEach((cb) => cb(event.data));
    };

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected");
      isConnected = false;
      // 👇 Thông báo cho tất cả listeners
      notifyConnectionListeners(false);
    };

    socket.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
      isConnected = false;
      // 👇 Thông báo cho tất cả listeners
      notifyConnectionListeners(false);
    };
  };

  const sendMessage = (msg: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(msg);
      console.log("✅ Message sent:", msg);
    } else {
      console.warn("⚠️ WebSocket not open, message not sent");
    }
  };

  const onMessage = (callback: MessageListener) => {
    listeners.push(callback);
  };

  const offMessage = (callback: MessageListener) => {
    listeners = listeners.filter((cb) => cb !== callback);
  };

  // 👇 Thêm methods để theo dõi connection state
  const onConnectionChange = (callback: ConnectionListener) => {
    connectionListeners.push(callback);
    // Gọi ngay lập tức với trạng thái hiện tại
    callback(isConnected);
  };

  const offConnectionChange = (callback: ConnectionListener) => {
    connectionListeners = connectionListeners.filter((cb) => cb !== callback);
  };

  const notifyConnectionListeners = (connected: boolean) => {
    connectionListeners.forEach((cb) => cb(connected));
  };

  const getConnectionState = () => {
    return isConnected;
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
      socket = null;
    }
    listeners = [];
    connectionListeners = [];
    isConnected = false;
  };

  return {
    connect,
    disconnect,
    sendMessage,
    onMessage,
    offMessage,
    onConnectionChange, // 👈 Export method mới
    offConnectionChange, // 👈 Export method mới
    getConnectionState, // 👈 Export method để lấy state hiện tại
  };
};

// 👉 instance dùng chung
export const chatSocketService = createChatSocketService();