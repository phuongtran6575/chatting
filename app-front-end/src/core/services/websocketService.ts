type MessageListener = (msg: string) => void;

export const createChatSocketService = () => {
  let socket: WebSocket | null = null;
  let listeners: MessageListener[] = [];

  const connect = (conversationId: string, userId: string) => {
    if (!conversationId || !userId) return;
    const wsUrl = `ws://localhost:8000/ws/chat/${conversationId}/${userId}`;
    //console.log("🧠 conversation:", conversationId);
    //console.log("🧠 userid:", userId);

    socket = new WebSocket(wsUrl);

    socket.onopen = () => console.log("✅ WebSocket connected");

    socket.onmessage = (event) => {
      console.log("📩 Received:", event.data);
      listeners.forEach((cb) => cb(event.data));
    };

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    socket.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
    };
  };

  const sendMessage = (msg: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(msg);
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

  const disconnect = () => {
    socket?.close();
    socket = null;
    listeners = [];
  };

  return {
    connect,
    disconnect,
    sendMessage,
    onMessage,
    offMessage,
  };
};

// 👉 instance dùng chung
export const chatSocketService = createChatSocketService();