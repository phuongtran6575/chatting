from typing import Any, Dict, Optional
from uuid import UUID
from sqlmodel import select
from models.messenger_model import SystemRole, User
from models.role_schema import SystemRoleCreate, SystemRoleUpdate
from services.base_service import create_item, delete_item_by_id, get_item_by_id, get_list_items, update_item_by_id
from sqlalchemy.ext.asyncio import AsyncSession


async def create_system_role(session: AsyncSession, schema: SystemRoleCreate) -> SystemRole:
    return await create_item(session, SystemRole, schema)


async def get_system_role_by_id(session: AsyncSession, role_id: UUID) -> Optional[SystemRole]:
    return await get_item_by_id(session, SystemRole, role_id)


async def get_all_system_roles(session: AsyncSession, page: int, page_size: int) -> Dict[str, Any]:
    return await get_list_items(session, SystemRole, page, page_size)


async def update_system_role(session: AsyncSession, role_id: UUID, schema: SystemRoleUpdate) -> Optional[SystemRole]:
    return await update_item_by_id(session, SystemRole, role_id, schema)


async def delete_system_role(session: AsyncSession, role_id: UUID) -> bool:
    return await delete_item_by_id(session, SystemRole, role_id)

async def get_system_role_by_name(session: AsyncSession, role_name: UUID) -> Optional[SystemRole]:
    statement = select(SystemRole).where(SystemRole.id == role_name)
    result = await session.execute(statement)
    return result.scalars().first()

async def change_user_role_by_id( session: AsyncSession,user_id: UUID, role_id: UUID) -> Optional[User]:
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise ValueError(f"User with id={user_id} not found")

    user.system_role_id = role_id
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user




