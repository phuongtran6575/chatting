
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from sqlmodel import col, func, select
from models.conversation_schema import ConversationCreate
from models.messenger_model import Conversation, ConversationParticipant, ConversationType
from sqlalchemy.orm import selectinload



async def create_or_get_single_conversation(sender_id: UUID, receiver_id: UUID, session: AsyncSession):
    
    stmt = (
        select(Conversation, ConversationParticipant)
        .join(Conversation)
        .where(
            Conversation.type == ConversationType.SINGLE,
            col(ConversationParticipant.user_id).in_([sender_id, receiver_id])
        )
        .group_by(col(Conversation.id))
        .having(func.count(col(ConversationParticipant.user_id)) == 2)
    )
    result = await session.execute(stmt)
    conversation = result.scalars().first()

    if conversation:
        return conversation

    # Nếu chưa có, tạo mới cuộc trò chuyện
    new_conversation = Conversation(
        creator_id=sender_id,
        type=ConversationType.SINGLE
    )
    session.add(new_conversation)
    await session.commit()
    await session.refresh(new_conversation)

    # Thêm người tham gia cuộc trò chuyện
    participants = [
        ConversationParticipant(conversation_id=new_conversation.id, user_id=sender_id),
        ConversationParticipant(conversation_id=new_conversation.id, user_id=receiver_id)
    ]
    session.add_all(participants)
    await session.commit()

    return new_conversation
    
async def create_group_conversation(creator_id: UUID, member_ids: List[UUID],session: AsyncSession, group_name: str | None = None):
 # 👉 Bước 3: Nếu chưa có thì tạo mới
    new_conversation = Conversation(
        creator_id=creator_id,
        type=ConversationType.GROUP,
        name=group_name or "New Group"
    )
    session.add(new_conversation)
    await session.commit()
    await session.refresh(new_conversation)

    # 👉 Bước 4: thêm người tham gia (bao gồm creator)
    participants = [
        ConversationParticipant(conversation_id=new_conversation.id, user_id=user_id)
        for user_id in set(member_ids + [creator_id])
    ]
    session.add_all(participants)
    await session.commit()

    return new_conversation

async def get_group_conversation(conversation_id: UUID, session: AsyncSession):
    """Lấy thông tin một group conversation theo ID."""
    stmt = select(Conversation).where(
        Conversation.id == conversation_id,
        Conversation.type == ConversationType.GROUP
    )
    result = await session.execute(stmt)
    conversation = result.scalars().first()
    return conversation

async def get_all_conversations(session: AsyncSession, page: int = 1, page_size: int = 10):
    """Lấy danh sách tất cả cuộc trò chuyện có phân trang."""
    total_stmt = select(func.count()).select_from(Conversation)
    total_result = await session.execute(total_stmt)
    total = total_result.scalar_one()

    offset = (page - 1) * page_size

    stmt = select(Conversation).offset(offset).limit(page_size)
    result = await session.execute(stmt)
    conversations = result.scalars().all()

    return {
        "items": conversations,
        "total": total,
        "page": page,
        "page_size": page_size,
    }
    
async def get_user_conversations(
    session: AsyncSession,
    user_id: UUID,
    page: int = 1,
    page_size: int = 10
):
    total_stmt = select(func.count()).select_from(ConversationParticipant).where(
        ConversationParticipant.user_id == user_id
    )
    total_result = await session.execute(total_stmt)
    total = total_result.scalar_one()

    stmt = (
        select(Conversation)
        .join(ConversationParticipant)
        .where(ConversationParticipant.user_id == user_id)
        .options(
            selectinload(Conversation.participants).selectinload(ConversationParticipant.user),
            selectinload(Conversation.creator),
        )
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    result = await session.execute(stmt)
    conversations = result.scalars().unique().all()  # ⚠️ nhớ .unique() nếu có join

    return {
        "items": [
        {
            "id": c.id,
            "type": c.type,
            "name": c.name,
            "participants": [
                {
                    "id": p.user.id,
                    "full_name": p.user.full_name,
                    "avatar_url": p.user.avatar_url,
                }
                for p in c.participants
            ],
        }
        for c in conversations
    ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }
    
    
async def delete_conversation(conversation_id: UUID, session: AsyncSession):
    """Xóa cuộc trò chuyện theo ID."""
    stmt = select(Conversation).where(Conversation.id == conversation_id)
    result = await session.execute(stmt)
    conversation = result.scalars().first()
    if conversation:
        await session.delete(conversation)
        await session.commit()
        return True
    return False