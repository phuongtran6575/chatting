from typing import Optional
from uuid import UUID
from datetime import datetime
from sqlmodel import SQLModel

from models.messenger_model import NotificationType


class NotificationCreate(SQLModel):
    user_id: UUID
    type: NotificationType
    title: Optional[str] = None
    body: Optional[str] = None
    payload: Optional[str] = None


class NotificationRead(SQLModel):
    id: UUID
    user_id: UUID
    type: NotificationType
    title: Optional[str]
    body: Optional[str]
    payload: Optional[str]
    is_read: bool
    created_at: datetime
