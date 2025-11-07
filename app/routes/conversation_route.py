from typing import List, Optional
from fastapi import APIRouter, HTTPException
from uuid import UUID
from core.utils.to_uuid import to_uuid
from services import conversation_service
from databases.database import sessionDepends

router = APIRouter(prefix="/conversations", tags=["Conversations"])




@router.get("/group")
async def get_group_conversation(conversation_id: UUID | str,session: sessionDepends):
    try:
        conversation_uuid = to_uuid(conversation_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    """Lấy danh sách các cuộc trò chuyện nhóm có phân trang."""
    return await conversation_service.get_group_conversation(conversation_uuid, session)

@router.get("/single")
async def create_or_get_single_conversation(sender_id: UUID | str, receiver_id: UUID | str, session: sessionDepends):
    try:
        # Đã thay đổi: Tên biến
        sender_uuid = to_uuid(sender_id) 
        receiver_uuid = to_uuid(receiver_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
    return await conversation_service.create_or_get_single_conversation(sender_uuid, receiver_uuid, session)

@router.get("/")
async def get_all_conversations(session: sessionDepends, page: int = 1, page_size: int = 10):
    """Lấy danh sách tất cả cuộc trò chuyện có phân trang."""
    return await conversation_service.get_all_conversations(session, page, page_size)

@router.post("/group")
async def create_group_conversation( creator_id: UUID | str, member_ids: List[UUID], session: sessionDepends, group_name: Optional[str] = None,):
    """
    Tạo hoặc lấy group conversation nếu đã tồn tại (có cùng tập người)
    """
    try:
        creator_uuid = to_uuid(creator_id)
        member_uuid_list = [to_uuid(mid) for mid in member_ids]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    # Gọi service
    conversation = await conversation_service.create_group_conversation(
        creator_id=creator_uuid,
        member_ids=member_uuid_list,
        session=session,
        group_name=group_name
    )
    return conversation


