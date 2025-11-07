
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from sqlmodel import col, func, select

from models.conversation_schema import ConversationCreate
from models.messenger_model import Conversation, ConversationParticipant, ConversationType


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
    
async def create_or_get_group_conversation(creator_id: UUID, member_ids: List[UUID],session: AsyncSession, group_name: str | None = None):
    """
    Tạo hoặc lấy group conversation nếu tồn tại (có cùng tập người tham gia)
    """

    # 👉 Bước 1: kiểm tra xem có conversation GROUP nào có đúng danh sách thành viên này không
    stmt = (
        select(Conversation.id)
        .join(ConversationParticipant)
        .where(Conversation.type == ConversationType.GROUP)
        .group_by(col(Conversation.id))
        .having(
            func.count(col(ConversationParticipant.user_id)) == len(member_ids),
        )
    )

    result = await session.execute(stmt)
    possible_conversations = result.scalars().all()

    # 👉 Bước 2: lọc ra conversation có đúng tập user_id
    for conv_id in possible_conversations:
        stmt_participants = select(ConversationParticipant.user_id).where(
            ConversationParticipant.conversation_id == conv_id
        )
        result_p = await session.execute(stmt_participants)
        participant_ids = set(result_p.scalars().all())

        if participant_ids == set(member_ids):
            # ✅ Tìm thấy nhóm có đúng tập user
            stmt_conv = select(Conversation).where(Conversation.id == conv_id)
            result_conv = await session.execute(stmt_conv)
            return result_conv.scalar_one()

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