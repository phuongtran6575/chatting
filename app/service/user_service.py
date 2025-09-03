from uuid import UUID
from sqlmodel import Session
from repository import user_repository

async def delete_user(user_id: UUID, session: Session):
    user_db = await user_repository.delete_user(user_id=user_id, session=session)
    if not user_db:
        return None
    return user_db

async def get_user_by_id(user_id: UUID, session: Session):
    user_db = await user_repository.get_user_by_id(user_id=user_id, session=session)
    if not user_db:
        return None
    return user_db