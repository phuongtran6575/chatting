from datetime import datetime
from typing import Optional
from uuid import UUID
from core.enums import UserStatus
from pydantic import BaseModel, EmailStr



class UserBase(BaseModel):
    username: str
    email: EmailStr   # 👈 đổi từ str sang EmailStr
    display_name: str
    avatar_url: Optional[str]
    status: UserStatus
    last_seen: Optional[datetime]


class UserCreate(BaseModel):
    username: str
    email: EmailStr   # 👈 validate email khi tạo user
    password: str
    display_name: str


class UserUpdate(BaseModel):
    display_name: Optional[str]
    avatar_url: Optional[str]
    status: Optional[UserStatus]


class UserRead(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime