from datetime import datetime
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Depends
from sqlmodel import Session, select
from uuid import UUID
from models.conversation_schema import FirstMessageCreate
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
        
@router.post("/sendfirstMessage")
async def send_first_message(data: FirstMessageCreate,session: sessionDepends,):
    conversation = await session.get(Conversation, data.conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    sender = await session.get(User, data.sender_id)
    if not sender:
        raise HTTPException(status_code=404, detail="Sender not found")

    if not data.content.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty")

    new_message = Message(
        conversation_id=data.conversation_id,
        sender_id=data.sender_id,
        content=data.content.strip(),
        sent_at=datetime.utcnow(),
    )

    session.add(new_message)
    await session.commit()
    await session.refresh(new_message)

    return {
        "status": "success",
        "message": {
            "id": new_message.id,
            "conversation_id": new_message.conversation_id,
            "sender_id": new_message.sender_id,
            "content": new_message.content,
            "sent_at": new_message.sent_at.isoformat(),
        }
    }