from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlmodel import Session, select
from uuid import UUID
from databases.database import sessionDepends
from models import Message, Conversation, User
from services.websokcet_message_service import ConnectionManager

router = APIRouter()
manager = ConnectionManager()

@router.websocket("/ws/chat/{conversation_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, conversation_id: UUID, user_id: UUID, session: sessionDepends):
    await manager.connect(user_id, conversation_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # 👉 Lưu tin nhắn vào DB
            message = Message(
                conversation_id=conversation_id,
                sender_id=user_id,
                content=data
            )
            session.add(message)
            await session.commit()
            await session.refresh(message)

            # 👉 Gửi tin nhắn lại cho các user khác trong conversation
            await manager.send_to_conversation(
                conversation_id,
                f"{user_id}: {data}",
                exclude_user=user_id
            )
    except WebSocketDisconnect:
        manager.disconnect(user_id, conversation_id)
