from typing import Any, Dict, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import func, or_, select
from models.messenger_model import User
from services.base_service import delete_item_by_id, get_item_by_id, get_list_items, update_item_by_id
from models.user_schema import UserCreate, UserRead, UserUpdate

async def get_user_by_id(session: AsyncSession, user_id: UUID) -> Optional[User]:
    return await get_item_by_id(session, User, user_id)

async def search_users(session: AsyncSession, q: str, current_user_id: UUID, page: int = 1, page_size: int = 10,):
    

    # Tính offset cho phân trang
    offset = (page - 1) * page_size
    filters = (
        User.id != current_user_id,
        or_(
            getattr(User, "full_name").ilike(f"%{q}%"),
            getattr(User, "email").ilike(f"%{q}%")
        )
    )
    # Lấy danh sách items theo trang   
    stmt = (
        select(User)
        .where(*filters)
        .offset(offset)
        .limit(page_size)
    )
    result = await session.execute(stmt)
    items =  result.scalars().all()
    
    total_stmt = select(func.count()).select_from(User).where(*filters)
    total_result = await session.execute(total_stmt)
    total = total_result.scalar_one()
   
    return {
        "items":items,
        "total":total,
        "page":page,
        "page_size":page_size,
        }


async def get_all_users(session: AsyncSession, page: int, page_size: int) -> Dict[str, Any]:
    return await get_list_items(session, User, page, page_size)


async def update_user(session: AsyncSession, user_id: UUID, schema: UserUpdate) -> Optional[User]:
    return await update_item_by_id(session, User, user_id, schema)


async def delete_user(session: AsyncSession, user_id: UUID) -> bool:
    return await delete_item_by_id(session, User, user_id)