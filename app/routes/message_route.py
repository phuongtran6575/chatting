from uuid import UUID
from fastapi import APIRouter, HTTPException
from core.utils.to_uuid import to_uuid
from databases.database import sessionDepends
from services import message_service 

router = APIRouter(prefix="/messages", tags=["Messages"])

@router.get("all-message-from-conversation")
async  def get_all_message_from_conversation(conversation_id: UUID | str, session: sessionDepends):
    try:
        # Đã thay đổi: Tên biến
        conversation_uuid = to_uuid(conversation_id) 
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
    messages = await message_service.get_all_message_from_conversation(conversation_uuid, session)
    return messages