from fastapi import WebSocket
from typing import Dict, List
from uuid import UUID



class ConnectionManager:
    def __init__(self):
        # Key: conversation_id, Value: dict[user_id -> WebSocket]
        self.active_conversations: Dict[UUID, Dict[UUID, WebSocket]] = {}

    async def connect(self, user_id: UUID, conversation_id: UUID, websocket: WebSocket):
        await websocket.accept()
        if conversation_id not in self.active_conversations:
            self.active_conversations[conversation_id] = {}
        self.active_conversations[conversation_id][user_id] = websocket
        print(f"User {user_id} joined conversation {conversation_id}")

    def disconnect(self, user_id: UUID, conversation_id: UUID):
        if conversation_id in self.active_conversations:
            self.active_conversations[conversation_id].pop(user_id, None)
            if not self.active_conversations[conversation_id]:
                del self.active_conversations[conversation_id]

    async def send_to_conversation(self, conversation_id: UUID, message: str, exclude_user: UUID | None = None):
        if conversation_id in self.active_conversations:
            for uid, ws in self.active_conversations[conversation_id].items():
                if uid != exclude_user:
                    await ws.send_text(message)
                    
                    
