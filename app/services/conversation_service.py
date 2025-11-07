
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
    
async def create_or_get_group_conversation():
    return
