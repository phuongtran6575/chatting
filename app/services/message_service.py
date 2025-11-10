from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from models.messenger_model import Message

async  def get_all_message_from_conversation(conversation_id: UUID, session: AsyncSession):
    statement = select(Message).where(Message.conversation_id == conversation_id)
    result = await session.execute(statement)
    message = result.scalars().all()
    return message