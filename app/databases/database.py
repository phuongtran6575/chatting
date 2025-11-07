# app/db.py
from typing import AsyncGenerator, Annotated
from fastapi import Depends
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from models import __all__

# =============================
# CẤU HÌNH DATABASE
# =============================
DATABASE_URL = "sqlite+aiosqlite:///./chatting.db"

engine = create_async_engine(DATABASE_URL,)

async_session = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)

# =============================
# TẠO SESSION
# =============================
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

sessionDepends = Annotated[AsyncSession, Depends(get_session)]


# =============================
# HÀM KHỞI TẠO DATABASE
# =============================
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


# Gọi khi cần khởi tạo DB lần đầu
if __name__ == "__main__":
    import asyncio

    asyncio.run(init_db())