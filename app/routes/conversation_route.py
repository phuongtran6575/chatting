from fastapi import APIRouter, HTTPException
from uuid import UUID
from core.utils.to_uuid import to_uuid
from services import conversation_service
from databases.database import sessionDepends

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.get("/single")
async def create_or_get_single_conversation(sender_id: UUID, receiver_id: UUID, session: sessionDepends):
    try:
        # Đã thay đổi: Tên biến
        sender_uuid = to_uuid(sender_id) 
        receiver_uuid = to_uuid(receiver_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
    return await conversation_service.create_or_get_single_conversation(sender_uuid, receiver_uuid, session)