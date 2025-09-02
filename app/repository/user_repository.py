from uuid import UUID
from sqlmodel import Session, select
from models.chatting_model import User

async def get_all_users(session:Session):
    statement = select(User)
    list_user = session.exec(statement).all()
    return list_user

async def get_user_by_username(username: str, session: Session):
    statement = select(User).where(User.username == username)
    user_db = session.exec(statement).first()
    return user_db

async def get_user_by_id(user_id:UUID, session: Session):
    statement = select(User).where(User.id == user_id)
    user_db = session.exec(statement).first()
    return user_db

async def update_user(user_id:UUID ,user: User, session:Session):
    return user


async def delete_user(user_id: UUID, session: Session):
    statement = select(User).where(User.id == user_id)
    user_db = session.exec(statement).first()
    if not user_db:
        return None
    session.delete(user_db)
    session.commit()
    return {"status": "delete sucessful"}


async def create_user(user: User, session: Session):
    session.add(user)
    session.commit()
    session.refresh(user)
    return user