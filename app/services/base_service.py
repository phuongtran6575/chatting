from typing import Any, Dict, TypeVar, Optional, Type
from uuid import UUID
from sqlalchemy import func
from sqlmodel import SQLModel, select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

# Generic type
ModelType = TypeVar("ModelType", bound=SQLModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


async def create_item(session: AsyncSession,model: Type[ModelType], schema: CreateSchemaType) -> ModelType:
    """Tạo mới một item."""
    obj = model(**schema.model_dump())
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj


async def get_item_by_id(session: AsyncSession, model: Type[ModelType], id: UUID) -> Optional[ModelType]:
    """Lấy một item theo ID."""
    return await session.get(model, id)


async def get_list_items( session: AsyncSession, model: Type[ModelType], page: int = 1, page_size: int = 10,) -> Dict[str, Any]:
    """
    Lấy danh sách items có phân trang.
    Trả về (items, total_count)
    """

    # Tổng số bản ghi (để FE biết tổng số trang)
    total_stmt = select(func.count()).select_from(model)
    total_result = await session.execute(total_stmt)
    total = total_result.scalar_one()

    # Tính offset cho phân trang
    offset = (page - 1) * page_size

    # Lấy danh sách items theo trang
    stmt = select(model).offset(offset).limit(page_size)
    result = await session.execute(stmt)
    items = result.scalars().all()

    return {
        "items":items,
        "total":total,
        "page":page,
        "page_size":page_size,
        }


async def update_item_by_id( session: AsyncSession, model: Type[ModelType],  id: UUID,  schema: UpdateSchemaType) -> Optional[ModelType]:
    """Cập nhật item theo ID."""
    db_obj = await session.get(model, id)
    if not db_obj:
        return None

    data = schema.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(db_obj, key, value)

    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj


async def delete_item_by_id(session: AsyncSession,model: Type[ModelType],  id: UUID) -> bool:
    """Xóa item theo ID."""
    db_obj = await session.get(model, id)
    if not db_obj:
        return False

    await session.delete(db_obj)
    await session.commit()
    return True
