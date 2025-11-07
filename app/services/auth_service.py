from typing import Any, Dict, List, Optional
from uuid import UUID
from fastapi import Depends
from jwt import InvalidTokenError
import jwt
from sqlmodel import  select
from services.base_service import create_item, delete_item_by_id, get_item_by_id, get_list_items, update_item_by_id
from core.helpers.auth_helper import ALGORITHM, SECRET_KEY, get_hashed_password, verify_password
from models.messenger_model import SystemRole, User
from models.user_schema import UserCreate, UserRead, UserUpdate
from sqlalchemy.ext.asyncio import AsyncSession


async def registered(session: AsyncSession, schema: UserCreate ):
    user_create = User(
        full_name= schema.full_name,
        email=schema.email,
        password_hash= await get_hashed_password(schema.password),
        phone_number= schema.phone_number)
    
    statement = select(SystemRole).where(SystemRole.name == "user")
    result = await session.execute(statement)
    role = result.scalars().first()
    if role is None:
        raise ValueError("Not Found")
    
    user_create.system_role_id = role.id 
    await session.commit()    
    return await create_item( session,User, user_create)

async def get_user_by_email(session: AsyncSession, email:str)-> Optional[User]:
    statement = select(User).where(User.email == email)
    result = await session.execute(statement)
    return result.scalars().first()

async def authentication_user(email: str, password:str, session: AsyncSession):
    user = await get_user_by_email( session, email)
    if not user or not await verify_password(password, user.password_hash):
        raise ValueError("Incorrect email or password")
    return user

async def get_role_name_by_user_id(session: AsyncSession, user_id: UUID) -> Optional[str]:
    query = (
        select(SystemRole.name)
        .join(User)
        .where(User.id == user_id)
    )
    result = await session.execute(query)
    return result.scalars().first()

async def read_me(token: str, session:AsyncSession):
    user = await get_current_user(token, session)
    return {
        "user": UserRead(
                full_name = user.full_name,
                email = user.email,
                id = user.id,
                phone_number = user.phone_number,
                created_at = user.created_at,
                updated_at = user.updated_at,
                system_role_id= user.system_role_id,
                ),
        "role": await get_role_name_by_user_id(session, user.id),
    }

async def get_current_user(token: str, session: AsyncSession):
    if SECRET_KEY is None or ALGORITHM is None:
        raise ValueError("Secret key not configured")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except InvalidTokenError:
        raise ValueError("Not found")
    user_id = payload.get("sub")
    if user_id is None:
        raise ValueError("Not found")
    try:
        user_uuid = UUID(user_id)
    except (ValueError, TypeError):
        raise ValueError("Not found")
    user = await  get_item_by_id(session, User, user_uuid)
    if user is None:
        raise ValueError("Not found")
    return user

def require_roles(allowed_roles: List[str]):
    async def role_checker(current_user: User = Depends(get_current_user)):
        if not current_user.system_role or current_user.system_role.name not in allowed_roles:
            raise ValueError("Not found")
        return current_user
    return role_checker

